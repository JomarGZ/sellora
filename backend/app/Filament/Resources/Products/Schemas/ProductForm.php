<?php

declare(strict_types=1);

namespace App\Filament\Resources\Products\Schemas;

use Closure;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

final class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Basic Information')
                    ->schema([
                        Select::make('brand_id')
                            ->label('Brand')
                            ->relationship(name: 'brand', titleAttribute: 'name')
                            ->searchable()
                            ->preload()
                            ->required(),
                        Select::make('product_category_id')
                            ->label('Category')
                            ->relationship(name: 'category', titleAttribute: 'name')
                            ->searchable()
                            ->preload()
                            ->required(),
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        Select::make('attributes')
                            ->relationship('attributes', 'name')
                            ->multiple()
                            ->dehydrated(fn ($record) => ! $record?->productItems()->exists())
                            ->disabled(fn ($record) => $record?->productItems()->exists())
                            ->helperText(fn ($record) => $record?->productItems()->exists() ? 'Attributes cannot be modified once variants exist.' : null)
                            ->preload()
                            ->searchable(),
                        RichEditor::make('description')
                            ->columnSpanFull(),

                    ])
                    ->columns(2),

                Section::make('Product Images')
                    ->description('Upload up to 5 images. Toggle the primary image below.')
                    ->schema([
                        FileUpload::make('product_images')
                            ->label('Images')
                            ->image()
                            ->multiple()
                            ->maxFiles(5)
                            ->directory('product-images')
                            ->disk('public')
                            ->reorderable()
                            ->appendFiles()
                            ->dehydrated(false)   // handled in afterCreate / afterSave
                            ->helperText('Max 5 images. The first image is used as the primary.'),
                ]),
            ]);
    }
}
