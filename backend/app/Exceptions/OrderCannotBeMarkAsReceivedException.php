<?php

namespace App\Exceptions;

use RuntimeException;

class OrderCannotBeMarkAsReceivedException extends RuntimeException
{
    public function __construct(int $orderId)
    {
        parent::__construct("Order with ID {$orderId} cannot be marked as received.");
    }
}
