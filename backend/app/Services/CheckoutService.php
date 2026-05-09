<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\V1\CheckoutDTO;
use App\DTOs\V1\CheckoutItemDTO;
use App\Enums\CheckoutType;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ShippingMethod;
use App\Models\User;
use App\Repositories\CartRepository;
use App\Repositories\OrderRepository;
use App\Repositories\PaymentRepository;
use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Stripe\StripeClient;

final class CheckoutService
{
    public function __construct(
        private OrderRepository $orderRepo,
        private PaymentRepository $paymentRepo,
        private CartRepository $cartRepository,
        private InventoryService $inventory,
        private StripeClient $stripe,
    ) {}

    public function checkout(User $user, Order $order): array
    {
        $authUserDefaultAddress = $user?->defaultAddress()->first();
        $order->load('items.productItem');
        if (! $authUserDefaultAddress) {
            throw new Exception('User must have a default address to proceed with checkout.');
        }
        // ── Idempotency guard ─────────────────────────────────────────
  
        return DB::transaction(function () use ($order, $authUserDefaultAddress) {

            // ── Lock stock ─────────────────────────────────────────────
            $this->inventory->ensureStockAvailable($order->items);

            $orderItems = $order->items;

            $order->address()->create([
                'first_name' => $authUserDefaultAddress->first_name,
                'last_name' => $authUserDefaultAddress->last_name,
                'phone' => $authUserDefaultAddress->phone,
                'country' => $authUserDefaultAddress->country->name,
                'city' => $authUserDefaultAddress->city->name,
                'street_address' => $authUserDefaultAddress->street_address,
            ]);

            // ── Create Stripe session ─────────────────────────────────
            $session = $this->stripe->checkout->sessions->create([
                'payment_method_types' => ['card'],
                'line_items' => $this->buildLineItems($orderItems),
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
                'amount' => $order->order_total,
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
    private function handleExistingOrder(Order $order): array
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

    private function buildLineItems(Collection $items): array
    {
        return $items->map(function (OrderItem $item) {
            $productItem = $item->productItem;
            
            return [
                'price_data' => [
                    'currency' => 'usd',
                    'unit_amount' => (int) round($productItem->price * 100),
                    'product_data' => [
                        'name' => $productItem->product->name,
                    ],
                ],
                'quantity' => $item->quantity,
            ];
        })->values()->toArray();
    }
}
