<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;

final class OutOfStockException extends Exception
{
    public function __construct(string $sku, int $requested, int $available)
    {
        parent::__construct(
            sprintf(
                'Insufficient stock for %s. Requested: %d, Available: %d.',
                $sku,
                $requested,
                $available,
            )
        );
    }
}
