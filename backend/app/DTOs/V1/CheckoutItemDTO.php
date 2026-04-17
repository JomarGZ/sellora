<?php

namespace App\DTOs\V1;

class CheckoutItemDTO
{
    public function __construct(
        public int $productItemId,
        public int $quantity,
    ) {}
}