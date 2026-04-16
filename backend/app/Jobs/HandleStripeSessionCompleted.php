<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Services\StripeWebhookService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Stripe\Event;

final class HandleStripeSessionCompleted implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public Event $event) {}

    public function handle(StripeWebhookService $service): void
    {
        $service->handleSessionCompleted($this->event);
    }
}
