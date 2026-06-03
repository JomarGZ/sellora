<?php

namespace App\Exceptions;

use RuntimeException;

class CartNotModifiableException extends RuntimeException
{
    public function __construct(public readonly string $status)
    {
        parent::__construct(
            "Cart '{$status}' is not modifiable. Please start a new cart to continue shopping."
        );
    }
}
