<?php

namespace App\Listeners;

use App\Events\OrderPlaced;
use App\Models\User;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class NotifyAdminsNewOrder implements ShouldQueue
{
    use InteractsWithQueue, SerializesModels;
    /**
     * Handle the event.
     */
    public function handle(OrderPlaced $event): void
    {
        $order = $event->order->load('user');

        $admins = User::where('is_admin', true)->get();

        if($admins->isNotEmpty()) {
            Notification::make()
                ->title('🛒 New Order Received')
                ->icon('heroicon-o-shopping-cart')
                ->body(
                    "Order #{$order->id} placed by {$order->user->first_name}" . "({$order->user->email})"
                )
                ->sendToDatabase($admins);
        }
    }
}
