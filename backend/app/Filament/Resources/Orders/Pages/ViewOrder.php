<?php

declare(strict_types=1);

namespace App\Filament\Resources\Orders\Pages;

use App\Filament\Resources\Orders\OrderResource;
use App\Models\Order;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ViewRecord;

final class ViewOrder extends ViewRecord
{
    protected static string $resource = OrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('approveCancel')
                ->label('Approve Cancel')
                ->color('danger')
                ->requiresConfirmation()
                ->visible(fn (Order $record) => $record->canApproveCancel())
                ->action(function (Order $record) {
                    $order = app(\App\Services\OrderService::class)
                        ->approveCancellation($record);

                    Notification::make()
                        ->title('Cancellation approved')
                        ->body("Order #{$order->id} has been cancelled and refunded.")
                        ->success()
                        ->send();

                    return $order;
                }),
       
            Action::make('rejectCancel')
                ->label('Reject Cancel')
                ->color('danger')
                ->requiresConfirmation()
                ->visible(fn (Order $record) => $record->canRejectCancellation())
                ->action(function (Order $record) {
                    $order = app(\App\Services\OrderService::class)
                        ->rejectCancellation($record);

                    Notification::make()
                        ->title('Cancellation Rejected')
                        ->body("Order #{$order->id} cancellation has been rejected.")
                        ->success()
                        ->send();

                    return $order;
                }),
       
        ];
    }
}
