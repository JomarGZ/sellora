<?php

namespace App\Exceptions;

use RuntimeException;

class CartNotFoundException extends RuntimeException
{
    public function __construct(public readonly int $cartId)
    {
        parent::__construct(
            "Cart with ID '{$cartId}' not found."
        );
    }
}
