<?php

namespace App\DTOs;

final readonly class CheckoutAddressDTO
{
    public function __construct(
        public int $addressId,
    ) {}
}
