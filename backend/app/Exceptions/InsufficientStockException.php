<?php

namespace App\Exceptions;

use Exception;
use RuntimeException;

class InsufficientStockException extends RuntimeException
{
    public function __construct(
        public readonly int $productItemId,
        public readonly string $productName,
        public readonly int    $requested,
        public readonly int    $available,
    ) {
        parent::__construct(
            "Insufficient stock for product '{$productName}' (ID: {$productItemId}). "
            . "Requested: {$requested}, Available: {$available}."
        );
    }
}
