<?php

namespace App\Exceptions;

use RuntimeException;

class InvalidOrderTransitionException extends RuntimeException
{
    public function __construct(
        public readonly string $fromStatus,
        public readonly string $toStatus,
        public readonly array  $allowedTransitions,
    ) {
        $allowed = empty($allowedTransitions)
            ? 'none (terminal status)'
            : implode(', ', $allowedTransitions);
 
        parent::__construct(
            "Cannot transition order from '{$fromStatus}' to '{$toStatus}'. "
            . "Allowed transitions from '{$fromStatus}': {$allowed}."
        );
    }
}
