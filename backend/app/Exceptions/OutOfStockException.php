<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;

final class OutOfStockException extends Exception
{
    public function __construct(
        public string $sku,
        public int $requested,
        public int $available,
    ) {
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
