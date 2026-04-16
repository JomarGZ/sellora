<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Jobs\HandleStripeSessionCompleted;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;

final class StripeWebhookController extends ApiController
{
    public function handle(Request $request): JsonResponse
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret = config('stripe.webhook_secret');

        // ── 1. Verify the request genuinely came from Stripe ──────────────
        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $secret);
        } catch (SignatureVerificationException $e) {
            return $this->error(message: 'Invalid signature.', code: 400);
        }

        // ── 2. Route to the correct handler ───────────────────────────────
        match ($event->type) {
            'checkout.session.completed' => HandleStripeSessionCompleted::dispatch($event),
            // future events go here:
            // 'payment_intent.payment_failed' => ...
            default => null, // silently ignore unhandled events
        };

        // ── 3. Always return 200 — Stripe will retry on non-2xx ──────────
        return $this->success(message: 'Webhook received.');
    }
}
