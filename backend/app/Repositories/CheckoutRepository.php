<?php

namespace App\Repositories;

use App\Models\Checkout;
use App\Repositories\Contracts\ICheckoutRepository;
use Illuminate\Support\Collection;

class CheckoutRepository extends BaseRepository implements ICheckoutRepository
{
    /**
     * Create a new class instance.
     */
    public function __construct(Checkout $checkout)
    {
        parent::__construct($checkout);
    }

    public function findByIdempotencyKey(string $idempotencyKey): ?Checkout
    {
        return $this->model
            ->where('idempotency_key', $idempotencyKey)
            ->where('status', Checkout::STATUS_PENDING)
            ->where('expires_at', '>', now())
            ->first();
    }

    public function findByPaymentIntentId(string $paymentIntentId): ?Checkout
    {
        return $this->model->query()
            ->where('stripe_payment_intent_id', $paymentIntentId)
            ->first();
    }
 
    public function findBySessionId(string $sessionId): ?Checkout
    {
        return $this->model->query()
            ->where('stripe_session_id', $sessionId)
            ->first();
    }
 
    public function attachPaymentIntentId(Checkout $checkout, string $paymentIntentId): void
    {
        $checkout->update(['stripe_payment_intent_id' => $paymentIntentId]);
    }
 
    public function markCompleted(Checkout $checkout): void
    {
        $checkout->update(['status' => Checkout::STATUS_COMPLETED]);
    }
 
    public function markFailed(Checkout $checkout, string $reason): void
    {
        $checkout->update([
            'status'         => Checkout::STATUS_FAILED,
            'failure_reason' => $reason,
        ]);
    }
 
    public function findExpiredPendingCheckouts(): Collection
    {
        return $this->model->query()
            ->where('status', Checkout::STATUS_FAILED)
            ->where('expires_at', '<', now())
            ->with('cart')
            ->get();
    }
}
