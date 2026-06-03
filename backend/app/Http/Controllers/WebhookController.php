<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\ApiController;
use App\Jobs\ProcessSuccessfulpaymentJob;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;

class WebhookController extends ApiController
{
    public function handle(Request $request): JsonResponse
    {
        // ── Signature verification ──────────────────────────────
        // This is the security gate. It proves the request came
        // from Stripe and not a third party. Do this FIRST,
        // before any other processing.
        $payload   = $request->getContent(); // raw bytes, not parsed
        $signature = $request->header('Stripe-Signature');
        $secret    = config('services.stripe.webhook_secret');
 
        try {
            $event = Webhook::constructEvent($payload, $signature, $secret);
        } catch (SignatureVerificationException $e) {
            Log::warning('Invalid Stripe webhook signature', [
                'ip'    => $request->ip(),
                'error' => $e->getMessage(),
            ]);
 
            return $this->error(message: 'Invalid signature', code: 400);
        } catch (\UnexpectedValueException $e) {
            Log::warning('Invalid Stripe webhook payload', [
                'error' => $e->getMessage(),
            ]);
            
            return $this->error(message: 'Invalid payload', code: 400);
        }
 
        // ── Route the event ────────────────────────────────────
        // We only process checkout.session.completed here.
        // Other events (payment_intent.succeeded, charge.refunded)
        // can be added as additional cases.
        if ($event->type === 'checkout.session.completed') {
            $this->handleSessionCompleted($event->data->object);
        }
 
        // Always return 200. Even for unhandled event types.
        // Returning non-2xx causes Stripe to retry, clogging logs.
        return $this->success(message: 'Webhook received');
    }
 
    private function handleSessionCompleted(\Stripe\Checkout\Session $session): void
    {
        // Guard: only process sessions that have been paid.
        // A session can complete without payment in some Stripe
        // configurations (e.g., free trials). This prevents
        // creating orders for unpaid sessions.
        if ($session->payment_status !== 'paid') {
            Log::info('Skipping unpaid checkout session', [
                'session_id'     => $session->id,
                'payment_status' => $session->payment_status,
            ]);
            return;
        }
 
        $checkoutId      = $session->metadata->checkout_id ?? null;
        $paymentIntentId = $session->payment_intent;
 
        if (!$checkoutId || !$paymentIntentId) {
            Log::error('Missing metadata in Stripe session', [
                'session_id' => $session->id,
            ]);
            return;
        }
 
        // Dispatch asynchronously. The job handles all idempotency,
        // transaction management, and error handling.
        // ShouldBeUnique on the job means if this exact payment intent
        // is already queued or running, this dispatch is a no-op.
        ProcessSuccessfulpaymentJob::dispatch(
            checkoutId:      $checkoutId,
            paymentIntentId: $paymentIntentId,
            stripeSessionId: $session->id,
        )->onQueue('payments'); // dedicated queue for payment jobs
 
        Log::info('Payment job dispatched', [
            'checkout_id'       => $checkoutId,
            'payment_intent_id' => $paymentIntentId,
        ]);
    }
}
