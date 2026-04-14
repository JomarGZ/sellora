<?php

declare(strict_types=1);

namespace App\Filament\Resources\OrderStatuses\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

final class OrderStatusForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('status')
                    ->required(),
            ]);
    }
}
