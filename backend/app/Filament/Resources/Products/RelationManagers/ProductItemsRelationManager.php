<?php

namespace App\Filament\Resources\Products\RelationManagers;

use Filament\Actions\AssociateAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\DissociateAction;
use Filament\Actions\DissociateBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ProductItemsRelationManager extends RelationManager
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
                            ->required()
                    ])->columns(3),
                Section::make('Attributes')
                    ->schema([
                        Repeater::make('attributeValues')
                            ->label('Attributes')
                            ->relationship('attributeValues')
                            ->schema([
                                Select::make('attribute_id')
                                    ->label('Attribute')
                                    ->options(function () {
                                        return \App\Models\Attribute::pluck('name', 'id');
                                    })
                                    ->live()
                                    ->required(),

                                Select::make('attribute_value_id')
                                ->label('Value')
                                ->options(function (Get $get) {
                                    $attributeId = $get('attribute_id');
                                    if (! $attributeId) return [];

                                    return \App\Models\AttributeValue::where('attribute_id', $attributeId)
                                        ->pluck('value', 'id');
                                })
                                ->required(),
                            ])
                            ->columns(2)
                            ->addActionLabel('Add Attribute')

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
            ->recordTitleAttribute('name')
            ->columns([
                TextColumn::make('sku'),
                TextColumn::make('price')->money('USD', true),
                TextColumn::make('qty_in_stock')->label('Stock'),
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
