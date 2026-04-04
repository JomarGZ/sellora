<?php

declare(strict_types=1);

namespace App\Filament\Resources\Products\RelationManagers;

use App\Models\Attribute;
use App\Models\AttributeValue;
use App\Models\ProductItem;
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
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;
use Illuminate\Support\Str;

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
                            ->label('SKU')
                            ->placeholder('Auto-generated from product name + attributes')
                            ->disabled()
                            ->dehydrated(false)
                            ->visibleOn('edit'),

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
                        Repeater::make('productItemAttributeValues')
                            ->relationship()
                            ->label('Attributes')
                            ->schema([
                                Select::make('attribute_id')
                                    ->label('Attribute')
                                    ->options(Attribute::query()->pluck('name', 'id'))
                                    ->live()
                                    ->distinct()
                                    ->disableOptionsWhenSelectedInSiblingRepeaterItems()
                                    ->required()
                                    ->dehydrated(false)
                                    ->afterStateUpdated(fn (Set $set): mixed => $set('attribute_value_id', null)),

                                Select::make('attribute_value_id')
                                    ->label('Value')
                                    ->options(function (Get $get) {
                                        $attributeId = $get('attribute_id');
                                        if (! $attributeId) {
                                            return [];
                                        }

                                        return AttributeValue::query()->where('attribute_id', $attributeId)
                                            ->pluck('value', 'id')
                                            ->toArray();
                                    })
                                    ->required(),
                            ])
                            ->columns(2)
                            ->addActionLabel('Add Attribute')
                            ->minItems(1)
                            ->dehydrated(false),
                    ]),

                Section::make('Variant Images')
                    ->schema([
                        Repeater::make('itemImages')
                            ->relationship('itemImages')
                            ->schema([
                                FileUpload::make('image_path')
                                    ->label('Variant Image')
                                    ->image()
                                    ->directory('product-items'),
                            ])
                            ->addActionLabel('Add Variant Image')
                            ->maxItems(5)
                            ->minItems(1),
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
