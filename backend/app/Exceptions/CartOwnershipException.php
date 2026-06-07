<?php

namespace App\Exceptions;

use RuntimeException;

class CartOwnershipException extends RuntimeException
{
    public function __construct(int $userId)
    {
        parent::__construct(
            "No active cart found for user ID: {$userId}."
        );
    }
}
