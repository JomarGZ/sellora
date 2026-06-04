<?php

namespace App\Exceptions;

use RuntimeException;

class CartExpiredException extends RuntimeException
{
    public function __construct(public readonly int $cartId)
    {
        parent::__construct(
            "Cart with ID '{$cartId}' has expired. Please start a new cart to continue shopping."
        );
    }
}
