<?php

namespace App\Exceptions;

use RuntimeException;

class OrderNotFoundException extends RuntimeException
{
    public function __construct(int $orderId)
    {
        parent::__construct("Order '{$orderId}' not found.");
    }
}
