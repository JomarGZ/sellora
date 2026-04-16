<?php

namespace App\Jobs;

use App\Enums\PaymentStatus;
use App\Services\PaymentService;
use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcessStripeWebhookJob implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels, Dispatchable;

    public int $tries   = 5;
    public int $backoff = 30;

    public function __construct(
        private readonly object $session,
        private readonly string $stripeEventId,
    ) {}

    public function handle(PaymentService $paymentService): void
    {
        DB::transaction(function () use ($paymentService) {
            $payment = Payment::where('stripe_session_id', $this->session->id)
                ->lockForUpdate()
                ->firstOrFail();

            // ✅ GOOD: enum identity comparison — no string literals
            if ($payment->status === PaymentStatus::Paid) {
                $this->markEventProcessed();
                return;
            }

            // ✅ GOOD: reject nonsensical states — guard against weird retries
            if ($payment->status->isTerminal()) {
                Log::warning('Webhook received for terminal payment', [
                    'payment_id' => $payment->id,
                    'status'     => $payment->status->value,
                    'event_id'   => $this->stripeEventId,
                ]);
                $this->markEventProcessed();
                return;
            }

            $paymentService->markPaid($payment, $this->session, $this->stripeEventId);
            $this->markEventProcessed();
        });
    }

    private function markEventProcessed(): void
    {
        DB::table('stripe_webhook_events')
            ->where('stripe_event_id', $this->stripeEventId)
            ->update(['processed' => true, 'processed_at' => now()]);
    }

    public function failed(\Throwable $e): void
    {
        Log::critical('Webhook job permanently failed', [
            'event_id' => $this->stripeEventId,
            'error'    => $e->getMessage(),
        ]);
    }
}