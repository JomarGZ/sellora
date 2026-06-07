<?php

namespace App\Repositories\Contracts;

use App\Models\Checkout;

interface ICheckoutRepository extends IRepository
{
    /**
     * Find checkout by idempotency key.
     */
    public function findByIdempotencyKey(string $idempotencyKey): ?Checkout;
    /**
     * Find a checkout by the Stripe payment intent ID.
     * Used by the webhook job for idempotency checks.
     */
    public function findByPaymentIntentId(string $paymentIntentId): ?Checkout;
 
    /**
     * Find a checkout by Stripe session ID.
     * Used when the session.completed webhook arrives before
     * the payment_intent is populated.
     */
    public function findBySessionId(string $sessionId): ?Checkout;
 
    /**
     * Update the Stripe payment intent ID once known.
     */
    public function attachPaymentIntentId(Checkout $checkout, string $paymentIntentId): void;
 
    /**
     * Mark a checkout as completed after successful order creation.
     */
    public function markCompleted(Checkout $checkout): void;
 
    /**
     * Mark a checkout as failed (stock unavailable, refund triggered).
     */
    public function markFailed(Checkout $checkout, string $reason): void;
 
    /**
     * Find all pending checkouts past their expiry time.
     * Used by the scheduled cleanup job.
     */
    public function findExpiredPendingCheckouts(): \Illuminate\Support\Collection;

}
