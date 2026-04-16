<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Pending    = 'pending';
    case Processing = 'processing';
    case Paid       = 'paid';
    case Cancelled  = 'cancelled';
    case Failed     = 'failed';

    // ── Transition guard ──────────────────────────────────────────────
    // Defines which transitions are legal. Call this before every update.
    public function canTransitionTo(self $next): bool
    {
        return match ($this) {
            self::Pending    => in_array($next, [self::Processing, self::Cancelled]),
            self::Processing => in_array($next, [self::Paid, self::Failed, self::Cancelled]),
            self::Paid       => false,   // terminal
            self::Cancelled  => false,   // terminal
            self::Failed     => false,   // terminal
        };
    }

    // ── Convenience predicates ────────────────────────────────────────
    public function isTerminal(): bool
    {
        return in_array($this, [self::Paid, self::Cancelled, self::Failed]);
    }

    public function isPaid(): bool
    {
        return $this === self::Paid;
    }

    // ── Human-readable label (for APIs / logs) ────────────────────────
    public function label(): string
    {
        return match ($this) {
            self::Pending    => 'Awaiting payment',
            self::Processing => 'Payment processing',
            self::Paid       => 'Payment confirmed',
            self::Cancelled  => 'Order cancelled',
            self::Failed     => 'Payment failed',
        };
    }
}