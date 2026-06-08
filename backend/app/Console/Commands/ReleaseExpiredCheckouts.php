<?php

namespace App\Console\Commands;

use App\DTOs\CartSnapshotDTO;
use App\Models\Checkout;
use App\Repositories\Contracts\ICheckoutRepository;
use App\Repositories\Contracts\IProductItemRepository;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ReleaseExpiredCheckouts extends Command
{
    protected $signature   = 'checkouts:release-expired';
    protected $description = 'Release reserved stock from expired Stripe checkout sessions';
 
    public function handle(
        ICheckoutRepository $checkoutRepository,
        IProductItemRepository  $productItemRepository,
    ): void {
        $expiredCheckouts = $checkoutRepository->findExpiredPendingCheckouts();
        $this->info("Found {$expiredCheckouts->count()} expired checkouts to process.");
 
        foreach ($expiredCheckouts as $checkout) {
            try {
                $snapshot = CartSnapshotDTO::fromArray($checkout->cart_snapshot);
 
                // Release the soft reservation for each item.
                foreach ($snapshot->items as $item) {
                    $productItemRepository->decrementReservedQty(
                        $item->productItemId,
                        $item->quantity
                    );
                }
                $checkout->update(['status' => Checkout::STATUS_EXPIRED]);
 
                Log::info('Released expired checkout reservation', [
                    'checkout_id' => $checkout->id,
                    'items'       => count($snapshot->items),
                ]);
            } catch (\Throwable $e) {
                Log::error('Failed to release expired checkout', [
                    'checkout_id' => $checkout->id,
                    'error'       => $e->getMessage(),
                ]);
                // Continue processing other checkouts even if one fails.
            }
        }
 
        $this->info('Done.');
    }
}
