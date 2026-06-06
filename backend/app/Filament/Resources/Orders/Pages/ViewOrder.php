<?php

declare(strict_types=1);

namespace App\Filament\Resources\Orders\Pages;

use App\Enums\RefundReasonType;
use App\Filament\Resources\Orders\OrderResource;
use App\Models\Order;
use App\Services\RefundService;
use Filament\Actions\Action;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ViewRecord;

final class ViewOrder extends ViewRecord
{
    protected static string $resource = OrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('refund')
            ->label('Refund')
            ->icon('heroicon-o-arrow-uturn-left')
            ->color('danger')
            ->visible(fn (Order $record) =>
                $record->status !== Order::STATUS_REFUNDED &&
                $record->status !== Order::STATUS_CANCELLED
            )
            ->requiresConfirmation()
            ->form([
                Textarea::make('reason')
                    ->required()
                    ->label('Reason for refund'),
            ])
            ->action(function (Order $record, array $data) {

                $checkout = $record->checkout;

                if (! $checkout) {
                    throw new \Exception('Checkout not found for this order.');
                }

                app(RefundService::class)->refundPayment(
                    checkout: $checkout,
                    paymentIntentId: $record->stripe_payment_intent_id,
                    reasonType: RefundReasonType::CUSTOMER_REQUEST,
                );

                $record->update([
                    'status' => Order::STATUS_REFUNDED,
                ]);


                Notification::make()
                    ->title('Refund successful')
                    ->body("Order #{$record->id} has been refunded.")
                    ->success()
                    ->send();
            }),
        ];
    }
}
