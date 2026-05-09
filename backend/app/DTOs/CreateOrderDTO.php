<?php

namespace App\DTOs;

use App\Enums\OrderStatus;

class CreateOrderDTO
{
    public function __construct(
        public readonly int $userId,
        public readonly int $shippingMethodId,
        public readonly int $shoppingCartId,
        public readonly float $subtotal,
        public readonly float $shippingFee,
        public readonly float $orderTotal,
        public readonly string $currency,
        public readonly string $idempotencyKey,
        public readonly OrderStatus $status,
        public readonly string $checkoutType,
    ) {}

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'shipping_method_id' => $this->shippingMethodId,
            'shopping_cart_id' => $this->shoppingCartId,
            'subtotal' => $this->subtotal,
            'shipping_fee' => $this->shippingFee,
            'order_total' => $this->orderTotal,
            'currency' => $this->currency,
            'idempotency_key' => $this->idempotencyKey,
            'status' => $this->status,
            'checkout_type' => $this->checkoutType,
        ];
    }
}
