<?php

declare(strict_types=1);

namespace App\Filament\Resources\Products\Schemas;

use App\Models\Product;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

final class ProductInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([

                Section::make('Product Information')
                    ->columns(2)
                    ->schema([
                        Group::make([
                            TextEntry::make('name')
                                ->label('Product Name')
                                ->weight('bold')
                                ->size('lg'),

                            TextEntry::make('slug')
                                ->copyable()
                                ->color('gray'),
                        ]),

                        Group::make([
                            TextEntry::make('brand.name')
                                ->badge()
                                ->color('primary'),

                            TextEntry::make('category.name')
                                ->badge()
                                ->color('success'),
                        ]),
                  
                        TextEntry::make('description')
                            ->markdown()
                            ->prose()
                            ->columnSpanFull(),
                    ]),

                Section::make('Product Images')
                    ->collapsible()
                    ->schema([
                        ImageEntry::make('images.image_path')
                            ->disk('public')
                            ->imageHeight(140)
                            ->stacked(),
                    ]),

                Section::make('Status')
                    ->schema([
                        TextEntry::make('deleted_at')
                            ->dateTime()
                            ->badge()
                            ->color('danger')
                            ->visible(fn (Product $record) => $record->trashed()),
                    ])
                    ->visible(fn (Product $record) => $record->trashed()),
            ]);
    }
}