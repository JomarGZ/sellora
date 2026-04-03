<?php

declare(strict_types=1);

namespace App\Filament\Resources\Products\RelationManagers;

use App\Models\AttributeValue;
use App\Models\ProductItem;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Components\Section;
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
                        Select::make('attributeValues')
                            ->label('Attributes')
                            ->relationship('attributeValues', 'value')
                            ->multiple()
                            ->preload()
                            ->searchable()
                            ->getOptionLabelFromRecordUsing(
                                fn (AttributeValue $record): string =>
                                    ($record->attribute->name ?? 'Unknown') . ': ' . ($record->value ?? 'N/A')
                            ),
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
                CreateAction::make()
                    ->after(fn (ProductItem $record) => $this->generateSku($record)),
            ])
            ->recordActions([
                EditAction::make()
                    ->after(fn (ProductItem $record) => $this->generateSku($record)),
                DeleteAction::make(),
                ForceDeleteAction::make(),
                RestoreAction::make(),
            ]);
    }

    private function generateSku(ProductItem $productItem): void
    {
        $productItem->loadMissing('product', 'attributeValues');

        $productName = Str::upper(
            Str::slug($productItem->product->name, '-')
        );

        $attributes = $productItem->attributeValues
            ->sortBy('attribute_id')
            ->map(fn (AttributeValue $av) => Str::upper(Str::slug($av->value, '-')))
            ->join('-');

        $base = $attributes
            ? "{$productName}-{$attributes}"
            : $productName;

        // Ensure uniqueness — append -1, -2 if collision
        $sku = $base;
        $i   = 1;

        while (
            ProductItem::where('sku', $sku)
                ->where('id', '!=', $productItem->id)
                ->exists()
        ) {
            $sku = "{$base}-{$i}";
            $i++;
        }

        ProductItem::withoutEvents(
            fn () => $productItem->update(['sku' => $sku])
        );
    }
}