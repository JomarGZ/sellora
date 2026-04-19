<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\PaymentStatus;
use Database\Factories\PaymentFactory;
use DomainException;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class Payment extends Model
{
    /** @use HasFactory<PaymentFactory> */
    use HasFactory;

    protected $fillable = [
        'order_id',
        'payment_method',
        'amount',
        'stripe_session_id',
        'stripe_payment_intent_id',
        'stripe_event_id',
        'status',
        'stripe_payment_intent_id',
        'payment_provider',
        'stripe_checkout_url',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'status' => PaymentStatus::class,
    ];

    /** @return BelongsTo<Order, $this> */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function transitionTo(PaymentStatus $next): void
    {
        if (! $this->status->canTransitionTo($next)) {
            throw new DomainException(
                "Illegal payment transition: {$this->status->value} → {$next->value} "
                ."(payment #{$this->id})"
            );
        }

        $this->update(['status' => $next]);
    }
}
