<?php

declare(strict_types=1);

namespace App\Filament\Resources\ShippingMethods\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

final class ShippingMethodForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->prefix('$'),
                TextInput::make('estimated_days')
                    ->required()
                    ->numeric(),
            ]);
    }
}
