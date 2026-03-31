<?php

declare(strict_types=1);

namespace App\Filament\Resources\Brands\Schemas;

use App\Models\Brand;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

final class BrandInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('name'),
                TextEntry::make('slug'),
                TextEntry::make('logo'),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('deleted_at')
                    ->dateTime()
                    ->visible(fn (Brand $record): bool => $record->trashed()),
            ]);
    }
}
