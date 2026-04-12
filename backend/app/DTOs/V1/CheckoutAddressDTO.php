<?php

namespace App\DTOs\V1;

final readonly class CheckoutAddressDTO
{
    public function __construct(
        public int $addressId,
    ) {}
}
