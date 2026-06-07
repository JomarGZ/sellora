<?php

namespace App\Exceptions;

use RuntimeException;

class OrderCannotRequestCancellationException extends RuntimeException
{
    public function __construct(int $orderId)
    {
        parent::__construct("This order with ID {$orderId} can no longer be cancelled.");
    }
}
