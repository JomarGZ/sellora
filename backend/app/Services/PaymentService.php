<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Events\OrderPaid;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;

final class PaymentService
{
    public function __construct(
        private InventoryService $inventory,
        private ShoppingCartService $cartService
    ) {}

    public function markPaid(Payment $payment, object $session, string $eventId): void
    {
        if ($payment->status === PaymentStatus::Paid) {
            return;
        }

        $payment->transitionTo(PaymentStatus::Paid);

        $payment->update([
            'stripe_event_id' => $eventId,
            'stripe_payment_intent_id' => $session->payment_intent,
            'payment_method' => $session->payment_method_types,
        ]);

        $order = $payment->order;

        if ($order->status === OrderStatus::Pending) {
            $order->transitionTo(OrderStatus::Processing);
        }

        if ($order->status === OrderStatus::Processing) {
            $order->transitionTo(OrderStatus::Paid);
        }

        $items = $order->items->map(fn ($i) => [
            'product_item_id' => $i->product_item_id,
            'quantity' => $i->quantity,
        ])->toArray();

        $this->inventory->deductStock($items);

        $this->cartService->clearPurchasedItems($order);
        event(new OrderPaid($order));
    }

    public function markFailed(Payment $payment, string $reason = ''): void
    {
        $payment->transitionTo(PaymentStatus::Failed);

        $order = $payment->order;

        if (! $order->status->isTerminal()) {
            $order->transitionTo(OrderStatus::Failed);
        }

        Log::warning('Payment marked failed', [
            'payment_id' => $payment->id,
            'order_id' => $order->id,
            'reason' => $reason,
        ]);
    }

    public function markRefunded(Payment $payment): void
    {
        $payment->transitionTo(PaymentStatus::Refunded);
    }
}
