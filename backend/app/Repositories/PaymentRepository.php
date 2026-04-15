<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Payment;
use App\Repositories\Contracts\IPaymentRepository;

final class PaymentRepository extends BaseRepository implements IPaymentRepository
{
    public function __construct(Payment $payment)
    {
        parent::__construct($payment);
    }

    public function createPayment(array $data): Payment
    {
        return $this->model->create($data);
    }

    public function existsByStripeEventId(string $eventId): bool
    {
        return Payment::where('stripe_event_id', $eventId)->exists();
    }

    public function markAsPaid(int $paymentId, string $transactionId, string $stripeEventId): void
    {
        Payment::where('id', $paymentId)->update([
            'status'          => 'paid',
            'transaction_id'  => $transactionId, // now stores payment_intent ID, not session ID
            'stripe_event_id' => $stripeEventId,
            'payment_method'  => 'card',
        ]);
    }
}
