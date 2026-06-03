<?php

namespace App\Jobs;

use App\DTOs\CartSnapshotDTO;
use App\Exceptions\InsufficientStockException;
use App\Models\Checkout;
use App\Models\Order;
use App\Repositories\Contracts\ICartRepository;
use App\Repositories\Contracts\ICheckoutRepository;
use App\Repositories\Contracts\IOrderRepository;
use App\Repositories\Contracts\IProductItemRepository;
use App\Services\RefundService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcessSuccessfulpaymentJob implements ShouldQueue
{
     use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
 
    /**
     * Maximum number of times the job may be attempted.
     * After 3 failures it lands in the failed_jobs table for
     * manual inspection. We do NOT retry indefinitely because
     * repeated failures usually indicate a bug, not a transient
     * network issue.
     */
    public int $tries = 3;
 
    /**
     * Delay between retries in seconds.
     * Exponential backoff reduces thundering herd if a service
     * is temporarily degraded.
     */
    public array $backoff = [10, 60, 180];
 
    /**
     * Timeout in seconds for a single job execution.
     * Order creation + stock deduction should complete in < 5s
     * under normal load. 30s leaves a wide safety margin.
     */
    public int $timeout = 30;
 
    /**
     * ShouldBeUnique: Laravel prevents two copies of this job
     * with the same uniqueId() from running simultaneously.
     * This is the application-layer idempotency guard.
     * If Stripe retries the webhook and the job is already
     * queued/running, the duplicate dispatch is silently dropped.
     */
    public function uniqueId(): string
    {
        return $this->paymentIntentId;
    }
 
    public function __construct(
        // We pass primitive values, not Eloquent models, so
        // serialization is cheap and models are fresh-loaded
        // when the job actually runs (no stale data from queue).
        public readonly string $checkoutId,
        public readonly string $paymentIntentId,
        public readonly string $stripeSessionId,
    ) {}
 
    public function handle(
        ICheckoutRepository $checkoutRepository,
        IOrderRepository    $orderRepository,
        IProductItemRepository  $productItemRepository,
        ICartRepository     $cartRepository,
        RefundService               $refundService,
    ): void {
        Log::info('Processing successful payment', [
            'checkout_id'       => $this->checkoutId,
            'payment_intent_id' => $this->paymentIntentId,
        ]);
 
        // ── Idempotency Layer 1: Order already exists? ─────────
        // This is the fast path for Stripe retries. If an order
        // already exists for this payment intent, we're done.
        $existingOrder = Order::where(
            'stripe_payment_intent_id', $this->paymentIntentId
        )->first();
 
        if ($existingOrder) {
            Log::info('Order already exists, skipping', [
                'order_id'          => $existingOrder->id,
                'payment_intent_id' => $this->paymentIntentId,
            ]);
            return; // Job completes successfully — idempotent exit.
        }
 
        // ── Load the checkout record ───────────────────────────
        $checkout = $checkoutRepository->findByPaymentIntentId($this->paymentIntentId)
            ?? $checkoutRepository->findBySessionId($this->stripeSessionId);
 
        if (!$checkout) {
            // This should not happen. If it does, we have a data integrity
            // problem. Log loudly and let the job fail so it lands in
            // failed_jobs for manual review.
            Log::critical('Checkout record not found for payment intent', [
                'payment_intent_id' => $this->paymentIntentId,
                'session_id'        => $this->stripeSessionId,
            ]);
            $this->fail(new \RuntimeException(
                "Checkout not found for payment intent: {$this->paymentIntentId}"
            ));
            return;
        }
 
        // Attach payment intent ID if not already set.
        // This happens when the checkout was found by session ID.
        if (!$checkout->stripe_payment_intent_id) {
            $checkoutRepository->attachPaymentIntentId($checkout, $this->paymentIntentId);
        }
 
        // ── Idempotency Layer 2: Checkout already completed? ───
        if ($checkout->isCompleted()) {
            Log::info('Checkout already completed, skipping', [
                'checkout_id' => $checkout->id,
            ]);
            return;
        }
 
        // ── Re-hydrate the cart snapshot ───────────────────────
        // From this point forward we work ONLY from the snapshot.
        // The live cart and its items are irrelevant — the snapshot
        // is the immutable record of what the user agreed to pay for.
        $snapshot = CartSnapshotDTO::fromArray($checkout->cart_snapshot);
 
        // ── Atomic transaction: validate stock, create order ───
        // This is the critical section. Everything inside this
        // transaction is wrapped in a single database unit of work.
        // If any step fails, the entire transaction rolls back.
        //
        // Transaction boundary rationale:
        // - SELECT FOR UPDATE: prevents concurrent workers from
        //   reading the same stock value simultaneously.
        // - Order creation: must be atomic with stock deduction.
        //   A committed order with un-deducted stock is worse than
        //   a rolled-back transaction.
        // - Cart status update: tied to the same transaction so
        //   the cart can't be marked 'ordered' without a real order.
        try {
            $order = DB::transaction(function () use (
                $checkout,
                $snapshot,
                $checkoutRepository,
                $orderRepository,
                $productItemRepository,
            $cartRepository,
            ) {
                // ── Stock validation with pessimistic locks ────
                foreach ($snapshot->items as $snapshotItem) {
                    // lockForUpdate() emits SELECT ... FOR UPDATE.
                    // Any other transaction trying to lock the same
                    // product row will WAIT here until we release.
                    $productItem = $productItemRepository->findAndLockById($snapshotItem->productItemId);
 
                    if (!$productItem) {
                        throw new InsufficientStockException(
                            $snapshotItem->productItemId,
                            $snapshotItem->productName,
                            $snapshotItem->quantity,
                            0
                        );
                    }
 
                    // availableQty() = qty - reserved_qty.
                    // At this point the reservation should be in place
                    // from checkout initiation, so available = qty - reserved.
                    if ($productItem->availableQty() < $snapshotItem->quantity) {
                        throw new InsufficientStockException(
                            $productItem->id,
                            $productItem->name,
                            $snapshotItem->quantity,
                            $productItem->availableQty()
                        );
                    }
                }
 
                // ── All stock validated — create the order ─────
                // Idempotency Layer 3: if two workers somehow both
                // pass the checks above, only one INSERT succeeds
                // because of the UNIQUE constraint on
                // stripe_payment_intent_id. The second gets a
                // QueryException and the transaction rolls back.
                $order = $orderRepository->createFromSnapshot(
                    checkoutId:      $checkout->id,
                    userId:          $checkout->user_id,
                    paymentIntentId: $this->paymentIntentId,
                    snapshot:        $snapshot,
                );
 
                // ── Deduct stock for each item ─────────────────
                foreach ($snapshot->items as $snapshotItem) {
                    $productItemRepository->deductStockAndClearReservation(
                        $snapshotItem->productItemId,
                        $snapshotItem->quantity
                    );
                }
 
                // ── Mark checkout as completed ─────────────────
                $checkoutRepository->markCompleted($checkout);
 
                // ── Mark cart as ordered ───────────────────────
                // Load the cart model fresh so we have the object.
                $cart = $checkout->cart;
                if ($cart) {
                    $cartRepository->markAsOrdered($cart);
                }
 
                return $order;
            });
 
            // ── Post-commit: fire events outside the transaction ─
            // Emails, analytics, inventory sync webhooks — these
            // must NOT be inside the transaction. A failed email
            // should never roll back a committed order.
            event(new \App\Events\OrderPlaced($order));
 
            Log::info('Order created successfully', [
                'order_id'          => $order->id,
                'checkout_id'       => $checkout->id,
                'payment_intent_id' => $this->paymentIntentId,
            ]);
        } catch (InsufficientStockException $e) {
            // ── Stock unavailable after payment succeeded ──────
            // The transaction has already rolled back (the exception
            // propagated out of DB::transaction()). No order was
            // created, no stock was deducted. We must refund.
            Log::warning('Stock unavailable during order creation — refunding', [
                'checkout_id'       => $checkout->id,
                'payment_intent_id' => $this->paymentIntentId,
                'product_item_id'        => $e->productItemId,
                'reason'            => $e->getMessage(),
            ]);
 
            $refundService->refundPayment(
                $checkout,
                $this->paymentIntentId,
                $e->getMessage()
            );
 
            // Release the soft reservation since we're not completing this order.
            foreach ($snapshot->items as $snapshotItem) {
                $productItemRepository->decrementReservedQty(
                    $snapshotItem->productItemId,
                    $snapshotItem->quantity
                );
            }
 
            // Do NOT rethrow — we handled the failure gracefully.
            // The job should complete successfully (not be retried).
            // Retrying would trigger another refund attempt.
        } catch (\Illuminate\Database\QueryException $e) {
            // Unique constraint violation on stripe_payment_intent_id.
            // Another worker created the order first. This is fine.
            if ($e->errorInfo[1] === 1062) { // MySQL duplicate entry error code
                Log::info('Duplicate order creation prevented by DB constraint', [
                    'payment_intent_id' => $this->paymentIntentId,
                ]);
                return;
            }
 
            // Any other DB exception: rethrow for retry.
            throw $e;
        }
    }
 
    /**
     * Called when all retry attempts are exhausted.
     * At this point the job is permanently failed and must be
     * investigated manually. We mark the checkout as failed
     * so it doesn't appear as "pending" in admin dashboards.
     */
    public function failed(\Throwable $exception): void
    {
        Log::critical('ProcessSuccessfulPaymentJob permanently failed', [
            'checkout_id'       => $this->checkoutId,
            'payment_intent_id' => $this->paymentIntentId,
            'error'             => $exception->getMessage(),
        ]);
 
        // Best-effort checkout status update.
        try {
            $checkout = Checkout::find($this->checkoutId);
            if ($checkout && $checkout->isPending()) {
                $checkout->update([
                    'status'         => Checkout::STATUS_FAILED,
                    'failure_reason' => 'Max retries exceeded: ' . $exception->getMessage(),
                ]);
            }
        } catch (\Throwable $e) {
            Log::error('Could not mark checkout as failed', ['error' => $e->getMessage()]);
        }
    }
}
