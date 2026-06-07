<?php

namespace App\Listeners;

use App\Events\OrderPlaced;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class SendOrderConfirmationEmail
{
    /**
     * Handle the event.
     */
    public function handle(OrderPlaced $event): void
    {
        $order = $event->order->load('user');
 
        Log::info('Sending order confirmation email', [
            'order_id' => $order->id,
            'email'    => $order->user->email,
        ]);
        
        // Mail::to($order->user->email)->send(new OrderConfirmationMail($order));
        // Implementation omitted — not in scope. The point is that this
        // listener is completely isolated from the order creation transaction.
    }
}
