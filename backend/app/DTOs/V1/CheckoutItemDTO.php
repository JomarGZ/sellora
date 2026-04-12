<?php

declare(strict_types=1);

namespace App\DTOs\V1;

final readonly class CheckoutItemDTO
{
    public function __construct(
        public int $productItemId,
        public int $qty
    ) {}

}
