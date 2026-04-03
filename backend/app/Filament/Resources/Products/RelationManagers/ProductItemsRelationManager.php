<?php

declare(strict_types=1);

namespace App\Filament\Resources\Products\RelationManagers;

use App\Models\AttributeValue;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;

final class ProductItemsRelationManager extends RelationManager
{
    protected static string $relationship = 'productItems';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('SKU Details')
                    ->schema([
                        TextInput::make('sku')
                            ->required()
                            ->unique(ignoreRecord: true),

                        TextInput::make('price')
                            ->required()
                            ->prefix('$')
                            ->numeric(),

                        TextInput::make('qty_in_stock')
                            ->numeric()
                            ->default(0)
                            ->required(),
                    ])->columns(3),

                Section::make('Attributes')
                    ->schema([
                        Select::make('attributeValues')
                            ->label('Attributes')
                            ->relationship('attributeValues', 'value')
                            ->multiple()
                            ->preload()
                            ->searchable()
                            ->getOptionLabelFromRecordUsing(fn (AttributeValue $record): string => ($record->attribute->name ?? 'Unkown').': '.($record->value ?? 'N/A')),
                    ]),

                Section::make('Variant Images')
                    ->schema([
                        Repeater::make('itemImages')
                            ->relationship('itemImages')
                            ->schema([
                                FileUpload::make('image_path')
                                    ->image()
                                    ->directory('product-items'),
                            ])
                            ->addActionLabel('Add Variant Image'),
                    ]),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('sku'),

                TextColumn::make('price')
                    ->money('USD'),

                TextColumn::make('qty_in_stock')
                    ->label('Stock'),

                TextColumn::make('attributeValues.value')
                    ->label('Attributes')
                    ->badge(),
            ])
            ->filters([
                TrashedFilter::make(),
            ])
            ->headerActions([
                CreateAction::make(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
                ForceDeleteAction::make(),
                RestoreAction::make(),
            ]);
    }
}
