<?php

declare(strict_types=1);

namespace App\Filament\Resources\Orders\Tables;

use App\Models\Order;
use App\Services\OrderService;
use Filament\Actions\Action;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\Select;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

final class OrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.fullName')
                    ->label('Customer')
                    ->searchable(),
                 TextColumn::make('status')
                    ->badge()
                    ->formatStateUsing(
                        fn (string $state): string => Order::STATUS_OPTIONS[$state] ?? $state
                    )
                    ->color(fn (string $state): string => match ($state) {
                        Order::STATUS_CONFIRMED => 'info',
                        Order::STATUS_PROCESSING => 'warning',
                        Order::STATUS_SHIPPED => 'primary',
                        Order::STATUS_DELIVERED => 'success',
                        Order::STATUS_REFUNDED => 'gray',
                        Order::STATUS_CANCELLED => 'danger',
                        default => 'gray',
                    }),
                TextColumn::make('subtotal')
                    ->money()
                    ->sortable(),
                TextColumn::make('shipping_fee')
                    ->money()
                    ->sortable(),
                TextColumn::make('total')
                    ->money()
                    ->sortable(),
                TextColumn::make('currency')
                    ->searchable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options(Order::STATUS_OPTIONS),
            ])
            ->recordActions([
                ViewAction::make(),
                Action::make('updateStatus')
                    ->label('Status')
                    ->icon('heroicon-o-arrow-path')
                    ->form([
                        Select::make('status')
                            ->label('New Status')
                            ->options(fn (Order $record) => collect($record->allowedTransitions())
                                ->mapWithKeys(fn ($status) => [
                                    $status => Order::STATUS_OPTIONS[$status] ?? $status
                                ])
                                ->toArray()
                            )
                            ->required(),
                    ])
                    ->action(function (Order $record, array $data) {

                        if (! $record->canTransitionTo($data['status'])) {
                            throw new \Exception('Invalid status transition.');
                        }

                        app(OrderService::class)->updateStatus(
                            orderId: $record->id,
                            newStatus: $data['status'],
                        );
                    })
                    ->requiresConfirmation()
                    ->color('warning'), 
            ])
            ->toolbarActions([
            ]);
    }
}
