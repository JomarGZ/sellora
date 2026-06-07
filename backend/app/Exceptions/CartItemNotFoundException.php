<?php

namespace App\Exceptions;

use RuntimeException;

class CartItemNotFoundException extends RuntimeException
{
    public function __construct(public readonly int $itemId)
    {
        parent::__construct(
            "Cart item with ID '{$itemId}' not found."
        );
    }
}
