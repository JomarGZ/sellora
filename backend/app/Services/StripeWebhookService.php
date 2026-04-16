<?php

declare(strict_types=1);

namespace App\Services;

use App\Events\OrderPaid;
use App\Models\OrderStatus;
use App\Repositories\Contracts\IOrderRepository;
use App\Repositories\Contracts\IPaymentRepository;
use App\Repositories\Contracts\IProductItemRepository;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\Event;

final class StripeWebhookService
{
    public function __construct(
        private readonly IOrderRepository $orderRepository,
        private readonly IPaymentRepository $paymentRepository,
        private readonly IProductItemRepository $productItemRepository,
    ) {}

    public function handleSessionCompleted(Event $event): void
    {
        $session = $event->data->object; // Stripe\Checkout\Session
        $orderId = $session->metadata->order_id ?? null;
        $paymentId = $session->metadata->payment_id ?? null;
        $eventId = $event->id;

        if (! $orderId || ! $paymentId) {
            Log::warning('Stripe webhook missing metadata.', [
                'event_id' => $eventId,
            ]);

            return;
        }

        // Optional safety check (extra layer)
        if (($session->payment_status ?? null) !== 'paid') {
            Log::info('Stripe session not paid yet.', [
                'event_id' => $eventId,
            ]);

            return;
        }

        DB::transaction(function () use ($orderId, $paymentId, $eventId, $session) {

            // Load order once
            $order = $this->orderRepository->findWithItems($orderId);

            if (! $order) {
                Log::warning('Order not found.', ['order_id' => $orderId]);

                return;
            }
            $order->loadMissing('status');
            // ✅ Order-level idempotency (state machine guard)
            if ($order->status->status !== 'pending') {
                Log::info('Order already processed.', [
                    'order_id' => $orderId,
                    'status' => $order->status->status,
                ]);

                return;
            }

            // Get processing status (better: cache or constant)
            $processingStatus = OrderStatus::where('status', 'processing')->firstOrFail();

            try {
                // ─────────────────────────────────────────────
                // 1. Update order status
                // ─────────────────────────────────────────────
                $this->orderRepository->updateStatus(
                    $orderId,
                    $processingStatus->id
                );

                // ─────────────────────────────────────────────
                // 2. Mark payment as paid (DB-level idempotency happens here)
                // ─────────────────────────────────────────────
                $this->paymentRepository->markAsPaid(
                    paymentId: $paymentId,
                    paymentIntent: $session->payment_intent,
                    stripeEventId: $eventId,
                );

            } catch (QueryException $e) {
                // Handles duplicate stripe_event_id (race-safe idempotency)
                Log::info('Duplicate Stripe event ignored (DB constraint).', [
                    'event_id' => $eventId,
                ]);

                return;
            }

            // ─────────────────────────────────────────────
            // 3. Deduct stock
            // ─────────────────────────────────────────────
            foreach ($order->items as $item) {
                $this->productItemRepository->decrementStock(
                    productItemId: $item->product_item_id,
                    qty: $item->quantity,
                );
            }

            // ─────────────────────────────────────────────
            // 4. Dispatch domain event (optional)
            // ─────────────────────────────────────────────
            OrderPaid::dispatch($order);
        });

        Log::info('Order processed via Stripe webhook.', [
            'order_id' => $orderId,
            'event_id' => $eventId,
        ]);
    }
}
