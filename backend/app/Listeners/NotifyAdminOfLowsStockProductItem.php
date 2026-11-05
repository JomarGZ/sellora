<?php

namespace App\Listeners;

use App\Events\OrderPlaced;
use App\Models\User;
use Filament\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class NotifyAdminOfLowsStockProductItem implements ShouldQueue
{
    use InteractsWithQueue;

    private const LOW_STOCK_THRESHOLD = 5;
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(OrderPlaced $event): void
    {
        $order = $event->order->load(['user', 'items', 'items.productItem']);
        $admins = User::where('is_admin', true)->get();

        foreach($order->items as $item) {
            $productItem = $item->productItem;

            if ($productItem->qty <= self::LOW_STOCK_THRESHOLD) {
                Notification::make()
                    ->title('Low Stock Alert')
                    ->icon('heroicon-o-exclamation-circle')
                    ->body(
                        "The product item '{$productItem->sku}' for product '{$productItem->product->name}' is low on stock. Current quantity: {$productItem->qty}."
                    )
                    ->sendToDatabase($admins);
            }
        }
    }
}
