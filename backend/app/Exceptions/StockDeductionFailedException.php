<?php

namespace App\Exceptions;

use RuntimeException;

class StockDeductionFailedException extends RuntimeException
{
    public function __construct(string $productId)
    {
        parent::__construct(
            "Stock deduction failed for product ID: {$productId}. "
            . 'Stock may have been corrupted or over-deducted.'
        );
    }
}
