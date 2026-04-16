<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Payment;

interface IPaymentRepository
{
    public function createPayment(array $data): Payment;

    public function existsByStripeEventId(string $eventId): bool;

    public function markAsPaid(int $paymentId, string $paymentIntent, string $stripeEventId): void;
}
