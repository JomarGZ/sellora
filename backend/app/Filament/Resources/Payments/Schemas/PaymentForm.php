<?php

declare(strict_types=1);

namespace App\Filament\Resources\Payments\Schemas;

use App\Enums\PaymentStatus;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

final class PaymentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('order_id')
                    ->relationship('order', 'id')
                    ->required(),
                TextInput::make('stripe_session_id'),
                TextInput::make('stripe_payment_intent_id'),
                Textarea::make('stripe_checkout_url')
                    ->columnSpanFull(),
                TextInput::make('payment_method'),
                TextInput::make('amount')
                    ->required()
                    ->numeric(),
                TextInput::make('stripe_event_id'),
                Select::make('status')
                    ->options(PaymentStatus::class)
                    ->required(),
                TextInput::make('payment_provider')
                    ->required(),
            ]);
    }
}
