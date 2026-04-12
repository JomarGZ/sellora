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
use App\Repositories\Contracts\IPaymentRepository;
use App\Repositories\Contracts\IProductItemRepository;
use App\Repositories\Contracts\IUserAddressRepository;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

final class CheckoutService
{
    public function __construct(
        private IProductItemRepository $productItemRepository,
        private IOrderRepository $orderRepository,
        private IUserAddressRepository $userAddressRepository,
        private IOrderAddressRepository $orderAddressRepository,
        private IPaymentRepository $paymentRepository,
        private IOrderItemRepository $orderItemRepository
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
        $ids = $dto->items->pluck('productItemId')->all();
        $productItems = $this->productItemRepository->findByIds($ids);

        $this->validateStock($dto->items, $productItems);

        $address = $this->userAddressRepository->findWithRelations($dto->address->addressId);
        $shippingMethod = ShippingMethod::findOrFail($dto->shippingMethodId);
        $pendingStatus = OrderStatus::where('status', 'pending')->firstOrFail();
        $subtotal = $this->calculateSubtotal($dto->items, $productItems);
        $shippingFee = (float) $shippingMethod->price;

        $order = DB::transaction(function () use (
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

            $this->createPayment($order->id, $subtotal + $shippingFee);

            return $order->load(['items', 'address', 'payment', 'shippingMethod', 'status']);
        });

        return [
            'order' => $order,
            'checkout_url' => $this->createStripeSession($order),
        ];
    }

    private function calculateSubtotal(Collection $items, Collection $productItems): float
    {
        return round(
            $items->sum(fn ($item) => $productItems->get($item->productItemId)->price * $item->qty
            ),
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

    private function createPayment(int $orderId, float $amount): void
    {
        $this->paymentRepository->createPayment([
            'order_id' => $orderId,
            'payment_method' => 'card',
            'payment_provider' => 'stripe',
            'amount' => $amount,
            'transaction_id' => null,
            'status' => 'pending',
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

    private function createStripeSession(Order $order): string
    {
        // TODO: implement real Stripe session
        // \Stripe\Stripe::setApiKey(config('services.stripe.secret'));
        // $session = \Stripe\Checkout\Session::create([...]);
        // return $session->url;

        return 'https://checkout.stripe.com/pay/placeholder_'.$order->id;
    }
}
