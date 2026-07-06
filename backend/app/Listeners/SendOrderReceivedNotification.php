<?php

namespace App\Listeners;

use App\Events\OrderMarkedAsReceived;
use App\Models\User;
use Filament\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendOrderReceivedNotification implements ShouldQueue
{
    use InteractsWithQueue, SerializesModels;
    /**
     * Handle the event.
     */
    public function handle(OrderMarkedAsReceived $event): void
    {
        $admins = User::where('is_admin', true)->get();

        if ($admins->isNotEmpty()) {
            $order = $event->order->load('user');

            Notification::make()
                ->title('📦 Order Marked as Received')
                ->icon('heroicon-o-check-circle')
                ->body(
                    "Invoice {$order->invoice->invoice_number} for {$order->customer->first_name} has been marked as received."
                )
                ->sendToDatabase($admins);
        }
    }
}
