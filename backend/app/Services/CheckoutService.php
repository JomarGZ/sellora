<?php

namespace App\Services;

use App\DTOs\V1\CheckoutDTO;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Repositories\OrderRepository;
use App\Repositories\PaymentRepository;
use App\Repositories\ProductItemRepository;
use App\Models\ShippingMethod;
use Illuminate\Support\Facades\DB;
use Stripe\StripeClient;

class CheckoutService
{
    public function __construct(
        private OrderRepository $orderRepo,
        private PaymentRepository $paymentRepo,
        private ProductItemRepository $productItemRepo,
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

        return DB::transaction(function () use ($dto) {

            // ── Fetch product items from DB (DO NOT TRUST FRONTEND) ────
            $productItems = $this->productItemRepo->findByIds(
                collect($dto->items)->pluck('productItemId')->toArray()
            );

            // ── Lock stock ─────────────────────────────────────────────
            $this->inventory->reserveStock($dto->items);

            // ── Compute totals ─────────────────────────────────────────
            $subtotal = 0;

            foreach ($dto->items as $item) {
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
                'order_total' => $orderTotal,
                'currency' => 'USD',
                'idempotency_key' => $dto->idempotencyKey,
                'status' => OrderStatus::Pending,
            ]);

            // ── Create Order Items ─────────────────────────────────────
            $this->orderRepo->createItems(
                $order->id,
                collect($dto->items)->map(function ($item) use ($productItems) {
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
                'line_items' => $this->buildLineItems($dto->items, $productItems),
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
                'success_url' => config('app.frontend_url') . '/checkout/success',
                'cancel_url' => config('app.frontend_url') . '/checkout/cancel',
                'metadata' => [
                    'order_id' => $order->id,
                ],
            ]);
                    logger('sdada', [$session]);
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
            } catch (\Exception $e) {
                // ignore
            }
        }

        return [
            'order' => $order,
            'checkout_url' => null,
            'message' => 'Session expired, create new checkout',
        ];
    }

    private function buildLineItems(array $items, $productItems): array
    {
        return collect($items)->map(function ($item) use ($productItems) {
            $product = $productItems->get($item->productItemId);

            return [
                'price_data' => [
                    'currency' => 'usd',
                    'unit_amount' => (int) ($product->price * 100),
                    'product_data' => [
                        'name' => $product->product->name,
                    ],
                ],
                'quantity' => $item->quantity,
            ];
        })->toArray();
    }
}