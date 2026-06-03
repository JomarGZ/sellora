<?php

namespace App\Exceptions;

use RuntimeException;

class ProductItemNotAvailableException extends RuntimeException
{
    public function __construct(public readonly int $productItemId)
    {
        parent::__construct(
            "Product item with ID '{$productItemId}' is not available."
        );
    }   
}
