<?php

declare(strict_types=1);

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

final class OrderInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('user.id')
                    ->label('User'),
                TextEntry::make('shippingMethod.name')
                    ->label('Shipping method'),
                TextEntry::make('order_total')
                    ->numeric(),
                TextEntry::make('status')
                    ->badge(),
                TextEntry::make('checkout_type')
                    ->badge(),
                TextEntry::make('shopping_cart_id')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('subtotal')
                    ->numeric(),
                TextEntry::make('shipping_fee')
                    ->numeric(),
                TextEntry::make('idempotency_key')
                    ->placeholder('-'),
                TextEntry::make('currency')
                    ->placeholder('-'),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
