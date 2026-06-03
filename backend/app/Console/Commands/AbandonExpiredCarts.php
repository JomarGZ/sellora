<?php

namespace App\Console\Commands;

use App\Repositories\Contracts\ICartRepository;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class AbandonExpiredCarts extends Command
{
    protected $signature   = 'carts:abandon-expired';
    protected $description = 'Mark expired active carts as abandoned';
 
    public function handle(ICartRepository $cartRepository): void
    {
        $expiredCarts = $cartRepository->findExpiredActiveCarts();
 
        if ($expiredCarts->isEmpty()) {
            $this->info('No expired carts found.');
            return;
        }
 
        $this->info("Found {$expiredCarts->count()} expired cart(s). Processing...");
 
        $abandoned = 0;
        $failed    = 0;
 
        foreach ($expiredCarts as $cart) {
            try {
                $cartRepository->abandonCart($cart);
                $abandoned++;
 
                Log::info('Cart abandoned (expired)', [
                    'cart_id'    => $cart->id,
                    'user_id'    => $cart->user_id,
                    'expired_at' => $cart->expires_at?->toIso8601String(),
                    'items'      => $cart->items->count(),
                ]);
            } catch (\Throwable $e) {
                $failed++;
 
                Log::error('Failed to abandon expired cart', [
                    'cart_id' => $cart->id,
                    'error'   => $e->getMessage(),
                ]);
                // Continue processing remaining carts even if one fails.
            }
        }
 
        $this->info("Done. Abandoned: {$abandoned}, Failed: {$failed}.");
    }
}
