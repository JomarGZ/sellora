<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\V1\CheckoutDTO;
use App\DTOs\V1\PreviewDTO;
use App\Exceptions\OutOfStockException;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\ShippingMethod;
use App\Models\UserAddress;
use App\Repositories\Contracts\IOrderAddressRepository;
use App\Repositories\Contracts\IOrderItemRepository;
use App\Repositories\Contracts\IOrderRepository;
use App\Repositories\Contracts\IProductItemRepository;
use App\Repositories\Contracts\IUserAddressRepository;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

final class CheckoutService
{
    public function __construct(
        private IProductItemRepository $productItemRepository,
        private IOrderRepository $orderRepository,
        private IUserAddressRepository $userAddressRepository,
        private IOrderAddressRepository $orderAddressRepository,
        private IOrderItemRepository $orderItemRepository,
        private StripeService $stripeService,
        private PaymentService $paymentService
    ) {}

    public function preview(PreviewDTO $dto): array
    {
        $ids = $dto->items->pluck('productItemId')->all();
        $productItems = $this->productItemRepository->findByIds($ids);

        $shippingMethod = $dto->shippingMethodId
            ? ShippingMethod::find($dto->shippingMethodId)
            : ShippingMethod::first();

        $subtotal = $this->calculateSubtotal($dto->items, $productItems);
        $shippingFee = (float) ($shippingMethod?->price ?? 0);

        return [
            'items' => $dto->items->map(fn ($item) => [
                'product_item' => $productItems->get($item->productItemId),
                'qty' => $item->qty,
                'subtotal' => round($productItems->get($item->productItemId)->price * $item->qty, 2),
            ]),
            'subtotal' => $subtotal,
            'shipping_fee' => $shippingFee,
            'total' => round($subtotal + $shippingFee, 2),
            'shipping_method' => $shippingMethod,
        ];
    }

    public function checkout(CheckoutDTO $dto): array
    {

        $existingOrder = $this->orderRepository->findByIdempotencyKey(
            $dto->idempotencyKey,
            auth()->id()
        );

        if ($existingOrder) {
            return $this->resolveExistingOrder($existingOrder);
        }
        $ids = $dto->items->pluck('productItemId')->all();
        $productItems = $this->productItemRepository->findByIds($ids);
        $addressId = $dto->address->addressId ?? null;
        $this->validateStock($dto->items, $productItems);

        $address = $addressId
            ? $this->userAddressRepository->findByIdAndUser($addressId, auth()->id())
            : $this->userAddressRepository->getDefault(auth()->id());

        if (! $address) {
            throw new Exception('No valid address found.');
        }

        $shippingMethod = ShippingMethod::findOrFail($dto->shippingMethodId);
        $pendingStatus = OrderStatus::where('status', 'pending')->firstOrFail();
        $subtotal = $this->calculateSubtotal($dto->items, $productItems);
        $shippingFee = (float) $shippingMethod->price;

        try {
            return DB::transaction(function () use (
                $dto,
                $productItems,
                $address,
                $subtotal,
                $shippingFee,
                $pendingStatus,
            ) {
                $order = $this->createOrder($dto, $subtotal, $shippingFee, $pendingStatus->id);

                $this->createOrderItems($order->id, $dto->items, $productItems);

                $this->createOrderAddress($order->id, $address);

                $this->paymentService->createPayment($order->id, $subtotal + $shippingFee);

                $order->load(['items', 'address', 'payment', 'shippingMethod', 'status']);
                $session = $this->stripeService->createCheckoutSession($this->buildPayload($order));

                $order->payment->update(['stripe_session_id' => $session->id]);

                return [
                    'order' => $order,
                    'checkout_url' => $session->url,
                ];
            });
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                $order = $this->orderRepository->findByIdempotencyKey(
                    $dto->idempotencyKey,
                    auth()->id()
                );

                if ($order) {
                    return $this->resolveExistingOrder($order);
                }
            }

            throw $e;
        }

    }

    private function resolveExistingOrder(Order $order): array
    {
        $payment = $order->payment;
        $checkoutUrl = null;

        if ($payment?->transaction_id) {
            try {
                $session = $this->stripeService->retrieveSession($payment->transaction_id);

                // Reuse the session if it's still open (not paid, not expired)
                if ($session->status === 'open') {
                    $checkoutUrl = $session->url;
                }
            } catch (\Stripe\Exception\InvalidRequestException $e) {
                // Session not found in Stripe — treat as expired, fall through
            }
        }

        // Session was expired, missing, or already paid — create a fresh one
        if (! $checkoutUrl) {
            $order->load(['items', 'address', 'payment', 'shippingMethod', 'status', 'user']);
            $session = $this->stripeService->createCheckoutSession($this->buildPayload($order));
            $checkoutUrl = $session->url;

            $payment->update(['transaction_id' => $session->id]);
        }

        return [
            'order' => $order,
            'checkout_url' => $checkoutUrl,
        ];
    }

    private function calculateSubtotal(Collection $items, Collection $productItems): float
    {
        return round(
            $items->sum(fn ($item) => $productItems->get($item->productItemId)->price * $item->qty),
            2
        );
    }

    private function createOrder(
        CheckoutDTO $dto,
        float $subtotal,
        float $shippingFee,
        int $pendingStatusId,
    ): Order {
        return $this->orderRepository->createOrder([
            'user_id' => auth()->id(),
            'idempotency_key' => $dto->idempotencyKey,
            'order_status_id' => $pendingStatusId,
            'shipping_method_id' => $dto->shippingMethodId,
            'subtotal' => $subtotal,
            'shipping_fee' => $shippingFee,
            'order_total' => $subtotal + $shippingFee,
            'currency' => 'PHP',
        ]);
    }

    private function createOrderItems(
        int $orderId,
        Collection $items,
        Collection $productItems,
    ): void {
        $rows = $items->map(fn ($item) => [
            'order_id' => $orderId,
            'product_item_id' => $item->productItemId,
            'product_name' => $productItems->get($item->productItemId)->product->name,
            'sku' => $productItems->get($item->productItemId)->sku,
            'quantity' => $item->qty,
            'price' => $productItems->get($item->productItemId)->price,
        ])->all();

        $this->orderItemRepository->createOrderItems($rows);
    }

    private function createOrderAddress(int $orderId, UserAddress $address): void
    {
        $this->orderAddressRepository->createOrderAddress([
            'order_id' => $orderId,
            'first_name' => $address->first_name,
            'last_name' => $address->last_name,
            'phone' => $address->phone,
            'country' => $address->country->name,
            'city' => $address->city->name,
            'street_address' => $address->street_address,
        ]);
    }

    private function validateStock(Collection $items, Collection $productItems): void
    {
        foreach ($items as $item) {
            $productItem = $productItems->get($item->productItemId);

            if ($productItem->qty_in_stock < $item->qty) {
                throw new OutOfStockException(
                    sku: $productItem->sku,
                    requested: $item->qty,
                    available: $productItem->qty_in_stock,
                );
            }
        }
    }

    private function buildPayload(Order $order): array
    {
        return [
            'payment_method_types' => ['card'],
            'mode' => 'payment',

            'line_items' => $this->buildLineItems($order),

            'customer_email' => $order->user->email ?? null,

            'shipping_options' => [
                [
                    'shipping_rate_data' => [
                        'type' => 'fixed_amount',
                        'fixed_amount' => [
                            'amount' => (int) round($order->shipping_fee * 100),
                            'currency' => 'php',
                        ],
                        'display_name' => ucfirst($order->shippingMethod->name ?? 'Shipping'),
                    ],
                ],
            ],

            'metadata' => [
                'order_id' => $order->id,
                'payment_id' => $order->payment->id,
            ],

            'success_url' => route('api.v1.checkout.verify').'?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('api.v1.checkout.cancel', ['order' => $order->id]),
        ];
    }

    private function buildLineItems(Order $order): array
    {
        return $order->items->map(fn ($item) => [
            'price_data' => [
                'currency' => 'php',
                'product_data' => [
                    'name' => $item->product_name,
                    'metadata' => [
                        'sku' => $item->sku,
                        'product_item_id' => $item->product_item_id,
                    ],
                ],
                'unit_amount' => (int) round($item->price * 100),
            ],
            'quantity' => $item->quantity,
        ])->toArray();
    }
}
