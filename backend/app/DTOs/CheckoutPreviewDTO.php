<?php

namespace App\DTOs;

readonly class CheckoutPreviewDTO
{
    public function __construct(
        public string $cartId,
        public array  $items,
        public string $subtotal,
        public string $shippingFee,
        public string $total,
        public string $currency,
        public bool   $allItemsInStock,
    ) {}
}
