<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\V1\CheckoutDTO;
use App\DTOs\V1\CheckoutItemDTO;
use App\Enums\CheckoutType;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\ShippingMethod;
use App\Repositories\CartRepository;
use App\Repositories\OrderRepository;
use App\Repositories\PaymentRepository;
use App\Repositories\ProductItemRepository;
use DomainException;
use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Stripe\StripeClient;

final class CheckoutService
{
    public function __construct(
        private OrderRepository $orderRepo,
        private PaymentRepository $paymentRepo,
        private ProductItemRepository $productItemRepo,
        private CartRepository $cartRepository,
        private InventoryService $inventory,
        private StripeClient $stripe,
    ) {}

    public function checkout(CheckoutDTO $dto): array
    {
        // ── Idempotency guard ─────────────────────────────────────────
        $existing = $this->orderRepo->findByIdempotencyKey(
            $dto->idempotencyKey,
            $dto->userId
        );

        if ($existing) {
            return $this->handleExistingOrder($existing);
        }

        $resolved = $this->resolveItems($dto);

        $items = $resolved['items'];
        $type = $resolved['type'];
        $cartId = $resolved['cart_id'] ?? null;

        return DB::transaction(function () use ($dto, $items, $type, $cartId) {

            // ── Fetch product items from DB (DO NOT TRUST FRONTEND) ────
            $productItems = $this->productItemRepo->findByIds(
                $items->pluck('productItemId')->toArray()
            );

            // ── Lock stock ─────────────────────────────────────────────
            $this->inventory->ensureStockAvailable($items);

            // ── Compute totals ─────────────────────────────────────────
            $subtotal = 0;

            foreach ($items as $item) {
                $product = $productItems->get($item->productItemId);
                $subtotal += $product->price * $item->quantity;
            }

            $shippingMethod = ShippingMethod::findOrFail($dto->shippingMethodId);
            $shippingFee = $shippingMethod->price;
            $orderTotal = $subtotal + $shippingFee;

            // ── Create Order ───────────────────────────────────────────
            $order = $this->orderRepo->create([
                'user_id' => $dto->userId,
                'shipping_method_id' => $dto->shippingMethodId,
                'subtotal' => $subtotal,
                'shipping_fee' => $shippingFee,
                'shopping_cart_id' => $cartId,
                'order_total' => $orderTotal,
                'currency' => 'USD',
                'idempotency_key' => $dto->idempotencyKey,
                'status' => OrderStatus::Pending,
                'checkout_type' => $type,
            ]);

            // ── Create Order Items ─────────────────────────────────────
            $this->orderRepo->createItems(
                $order->id,
                collect($items)->map(function ($item) use ($productItems) {
                    $product = $productItems->get($item->productItemId);

                    return [
                        'product_item_id' => $product->id,
                        'quantity' => $item->quantity,
                        'price' => $product->price,
                        'product_name' => $product->product->name,
                        'sku' => $product->sku,
                    ];
                })->toArray()
            );

            // ── Create Stripe session ─────────────────────────────────
            $session = $this->stripe->checkout->sessions->create([
                'payment_method_types' => ['card'],
                'line_items' => $this->buildLineItems($items, $productItems),
                'customer_email' => $order->user->email ?? null,

                'shipping_options' => [
                    [
                        'shipping_rate_data' => [
                            'type' => 'fixed_amount',
                            'fixed_amount' => [
                                'amount' => (int) round($order->shipping_fee * 100),
                                'currency' => 'usd',
                            ],
                            'display_name' => ucfirst($order->shippingMethod->name ?? 'Shipping'),
                        ],
                    ],
                ],
                'mode' => 'payment',
                'success_url' => config('app.frontend_url').'/checkout/success',
                'cancel_url' => config('app.frontend_url').'/checkout/cancel',
                'metadata' => [
                    'order_id' => $order->id,
                ],
            ]);
            // ── Create Payment ─────────────────────────────────────────
            $this->paymentRepo->create([
                'order_id' => $order->id,
                'stripe_session_id' => $session->id,
                'amount' => $orderTotal,
                'status' => PaymentStatus::Pending,
                'payment_provider' => 'stripe',
                'stripe_checkout_url' => $session->url,
            ]);

            return [
                'order' => $order,
                'checkout_url' => $session->url,
                'message' => 'Checkout created',
            ];
        });
    }

    // ── Handle existing order safely ──────────────────────────────────
    private function handleExistingOrder($order): array
    {
        $payment = $order->payment;

        // 🚫 Already paid
        if ($payment->status === PaymentStatus::Paid) {
            return [
                'order' => $order,
                'checkout_url' => null,
                'message' => 'Order already paid',
            ];
        }

        // 🔁 Reuse session if still valid
        if ($payment->stripe_session_id) {
            try {
                $session = $this->stripe->checkout->sessions->retrieve(
                    $payment->stripe_session_id
                );

                if ($session->status === 'open') {
                    return [
                        'order' => $order,
                        'checkout_url' => $session->url,
                        'message' => 'Reusing existing checkout session',
                    ];
                }
            } catch (Exception $e) {
                // ignore
            }
        }

        return [
            'order' => $order,
            'checkout_url' => null,
            'message' => 'Session expired, create new checkout',
        ];
    }

    private function resolveItems(CheckoutDTO $dto): array
    {
        if (! empty($dto->items)) {
            return [
                'items' => collect($dto->items),
                'type' => CheckoutType::BuyNow,
            ];
        }

        $cart = $this->cartRepository->getUserCartWithItems($dto->userId);

        if (! $cart || $cart->items->isEmpty()) {
            throw new Exception('Cart is empty.');
        }

        return [
            'items' => $cart->items->map(fn ($item) => new CheckoutItemDTO(
                productItemId: $item->product_item_id,
                quantity: $item->quantity,
            )
            ),
            'type' => CheckoutType::Cart,
            'cart_id' => $cart->id,
        ];
    }

    private function buildLineItems(Collection $items, Collection $productItems): array
    {
        return $items->map(function ($item) use ($productItems) {
            $product = $productItems->get($item->productItemId);

            if (! $product) {
                throw new DomainException("Invalid product item ID: {$item->productItemId}");
            }

            return [
                'price_data' => [
                    'currency' => $product->currency ?? 'usd',
                    'unit_amount' => (int) round($product->price * 100),
                    'product_data' => [
                        'name' => $product->product->name,
                    ],
                ],
                'quantity' => $item->quantity,
            ];
        })->values()->toArray(); // values() = clean indexed array
    }
}
