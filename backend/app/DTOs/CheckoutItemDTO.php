<?php

namespace App\DTOs;

final readonly class CheckoutItemDTO
{
    public function __construct(
        public int $productItemId,
        public int $qty
    ){}

}
