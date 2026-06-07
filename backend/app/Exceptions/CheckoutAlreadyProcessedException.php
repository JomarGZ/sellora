<?php

namespace App\Exceptions;

use RuntimeException;

class CheckoutAlreadyProcessedException extends RuntimeException
{
    public function __construct(string $paymentIntentId)
    {
        parent::__construct(
            "Checkout for payment intent '{$paymentIntentId}' has already been processed."
        );
    }
}

