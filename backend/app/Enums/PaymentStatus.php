<?php

declare(strict_types=1);

namespace App\Enums;

enum PaymentStatus: string
{
    case Pending = 'pending';
    case Authorized = 'authorized';
    case Paid = 'paid';
    case Failed = 'failed';
    case Refunded = 'refunded';

    public function canTransitionTo(self $next): bool
    {
        return match ($this) {
            self::Pending => in_array($next, [self::Authorized, self::Paid, self::Failed]),
            self::Authorized => in_array($next, [self::Paid, self::Failed]),
            self::Paid => $next === self::Refunded,
            self::Failed => false,   // terminal
            self::Refunded => false,   // terminal
        };
    }

    public function isTerminal(): bool
    {
        return in_array($this, [self::Paid, self::Failed, self::Refunded]);
    }

    public function isPaid(): bool
    {
        return $this === self::Paid;
    }
}
