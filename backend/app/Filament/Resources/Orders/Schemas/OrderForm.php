<?php

declare(strict_types=1);

namespace App\Filament\Resources\Orders\Schemas;

use App\Enums\CheckoutType;
use App\Enums\OrderStatus;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

final class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->relationship('user', 'id')
                    ->required(),
                Select::make('shipping_method_id')
                    ->relationship('shippingMethod', 'name')
                    ->required(),
                TextInput::make('order_total')
                    ->required()
                    ->numeric(),
                Select::make('status')
                    ->options(OrderStatus::class)
                    ->required(),
                Select::make('checkout_type')
                    ->options(CheckoutType::class)
                    ->required(),
                TextInput::make('shopping_cart_id')
                    ->numeric(),
                TextInput::make('subtotal')
                    ->required()
                    ->numeric(),
                TextInput::make('shipping_fee')
                    ->required()
                    ->numeric(),
                TextInput::make('idempotency_key'),
                TextInput::make('currency'),
            ]);
    }
}
