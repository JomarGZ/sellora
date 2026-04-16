<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Jobs\HandleStripeSessionCompleted;
use App\Jobs\ProcessStripeWebhookJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;

final class StripeWebhookController extends ApiController
{
    public function handle(Request $request): \Illuminate\Http\JsonResponse
    {
        // ── 1. Verify Stripe signature (must use raw body) ───────────
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');

        try {
            $event = Webhook::constructEvent(
                $payload,
                $sigHeader,
                config('stripe.webhook_secret')
            );
        } catch (SignatureVerificationException $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // ── 2. Store event ID immediately — DB-first safety ──────────
        //    If the INSERT succeeds, we own this event for processing.
        //    If it fails (duplicate key), the event was already handled.
        try {
            DB::table('stripe_webhook_events')->insertOrIgnore([
                'stripe_event_id' => $event->id,
                'type'            => $event->type,
                'processed'       => false,
                'created_at'      => now(),
            ]);

            $alreadyExists = DB::table('stripe_webhook_events')
                ->where('stripe_event_id', $event->id)
                ->where('processed', true)
                ->exists();

            if ($alreadyExists) {
                // Duplicate event — already fully processed. Return 200.
                return response()->json(['status' => 'duplicate_ignored']);
            }
        } catch (\Exception $e) {
            Log::error('Webhook event log failed', ['event' => $event->id]);
        }

        // ── 3. Dispatch job for async, retry-safe processing ─────────
        if ($event->type === 'checkout.session.completed') {
            ProcessStripeWebhookJob::dispatch($event->data->object, $event->id);
                
        }

        // Always return 200 quickly — Stripe retries on non-2xx.
        return response()->json(['status' => 'queued']);
    }
}
