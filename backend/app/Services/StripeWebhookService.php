<?php

namespace App\Services;

use App\Models\OrderStatus;
use App\Repositories\Contracts\IOrderRepository;
use App\Repositories\Contracts\IPaymentRepository;
use App\Repositories\Contracts\IProductItemRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\Event;

class StripeWebhookService
{
    public function __construct(
        private readonly IOrderRepository $orderRepository,
        private readonly IPaymentRepository $paymentRepository,
        private readonly IProductItemRepository $productItemRepository,
    ) {}

    public function handleSessionCompleted(Event $event): void
    {
        $session = $event->data->object; // Stripe\Checkout\Session

        $orderId   = $session->metadata->order_id ?? null;
        $paymentId = $session->metadata->payment_id ?? null;
        $eventId   = $event->id; // e.g. "evt_1ABC..."

        if (! $orderId || ! $paymentId) {
            Log::warning('Stripe webhook missing metadata.', ['event_id' => $eventId]);
            return;
        }

        // ── Idempotency: skip if we already processed this exact event ────
        // Uses the unique stripe_event_id column added in the migration
        $alreadyProcessed = $this->paymentRepository->existsByStripeEventId($eventId);

        if ($alreadyProcessed) {
            Log::info('Duplicate Stripe webhook ignored.', ['event_id' => $eventId]);
            return;
        }

        DB::transaction(function () use ($orderId, $paymentId, $eventId, $session) {
            $processingStatus = OrderStatus::where('status', 'processing')->firstOrFail();

            // ── 1. Update order status to 'processing' ────────────────────
            $this->orderRepository->updateStatus($orderId, $processingStatus->id);

            // ── 2. Update payment: mark paid, store event ID ──────────────
            $this->paymentRepository->markAsPaid(
                paymentId: $paymentId,
                transactionId: $session->payment_intent,
                stripeEventId: $eventId,
            );

            // ── 3. Deduct stock for each item in the order ────────────────
            $order = $this->orderRepository->findWithItems($orderId);

            foreach ($order->items as $item) {
                $this->productItemRepository->decrementStock(
                    productItemId: $item->product_item_id,
                    qty: $item->quantity,
                );
            }

            // ── 4. Dispatch event for email / notifications ───────────────
            // OrderPaid::dispatch($order);
        });

        Log::info('Order fulfilled via Stripe webhook.', ['order_id' => $orderId]);
    }

}
