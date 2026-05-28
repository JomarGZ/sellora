<?php

declare(strict_types=1);

namespace App\Filament\Resources\Brands\Schemas;

use App\Models\Brand;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

final class BrandInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Brand Information')
                    ->description('View brand details and metadata.')
                    ->icon('heroicon-o-tag')
                    ->schema([
                        Grid::make([
                            'default' => 1,
                            'md' => 3,
                        ])
                            ->schema([
                                ImageEntry::make('logo')
                                    ->label('')
                                    ->disk('public')
                                    ->height(180)
                                    ->width(180)
                                    ->defaultImageUrl(
                                        'https://placehold.co/300x300?text=No+Logo'
                                    )
                                    ->extraImgAttributes([
                                        'class' => 'rounded-xl object-contain bg-white p-4 border',
                                    ]),

                                Grid::make(1)
                                    ->columnSpan(2)
                                    ->schema([
                                        TextEntry::make('name')
                                            ->label('Brand Name')
                                            ->weight('bold')
                                            ->copyable()
                                            ->icon('heroicon-m-building-storefront'),

                                        TextEntry::make('slug')
                                            ->badge()
                                            ->color('gray')
                                            ->copyable()
                                    ]),
                            ]),
                    ]),

                Section::make('Timestamps')
                    ->icon('heroicon-o-clock')
                    ->collapsible()
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextEntry::make('created_at')
                                    ->label('Created')
                                    ->dateTime('M d, Y h:i A')
                                    ->placeholder('-')
                                    ->icon('heroicon-m-calendar'),

                                TextEntry::make('updated_at')
                                    ->label('Last Updated')
                                    ->dateTime('M d, Y h:i A')
                                    ->placeholder('-')
                                    ->icon('heroicon-m-pencil-square'),

                                TextEntry::make('deleted_at')
                                    ->label('Deleted At')
                                    ->dateTime('M d, Y h:i A')
                                    ->placeholder('-')
                                    ->color('danger')
                                    ->icon('heroicon-m-trash')
                                    ->visible(
                                        fn (Brand $record): bool => $record->trashed()
                                    ),
                            ]),
                    ]),
            ]);
    }
}