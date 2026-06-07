<?php

namespace App\Exceptions;

use Exception;
use RuntimeException;

class CartEmptyException extends RuntimeException
{
    public function __construct()
    {
        parent::__construct('Cannot initiate checkout with an empty cart.');
    }
}
