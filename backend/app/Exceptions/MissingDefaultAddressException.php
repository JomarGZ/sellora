<?php

namespace App\Exceptions;

use RuntimeException;

class MissingDefaultAddressException extends RuntimeException
{
    public function __construct()
    {
        return parent::__construct("You need a default shipping address to continue checkout. Please update your address settings.");
    }
}
