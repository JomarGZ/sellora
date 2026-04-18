<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Payment;

final class PaymentRepository extends BaseRepository
{
    public function __construct(Payment $payment)
    {
        parent::__construct($payment);
    }

    public function findBySessionId(string $sessionId): ?Payment
    {
        return Payment::where('stripe_session_id', $sessionId)->first();
    }
}
