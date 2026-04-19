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
use Filament\Notifications\Notification;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

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
                            ->saved(),

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
                            ->afterStateUpdated(function (Get $get, Set $set) {
                                $product = $this->getOwnerRecord();
                                $baseSku = Str::slug($product->name);

                                $items = $get('productItemAttributeValues') ?? [];

                                $ids = collect($items)
                                    ->pluck('attribute_value_id')
                                    ->filter()
                                    ->all();

                                $attributePart = AttributeValue::whereIn('id', $ids)->orderBy('attribute_id')->pluck('value')->implode('-');

                                $sku = Str::upper($baseSku.'-'.$attributePart);
                                $set('sku', $sku);

                            })
                            ->schema([
                                Select::make('attribute_id')
                                    ->label('Attribute')
                                    ->options(Attribute::query()->pluck('name', 'id'))
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
                            ->live()
                            ->dehydrated(false),
                    ]),

                Section::make('Variant Images')
                    ->schema([
                        Repeater::make('images')
                            ->relationship('images')
                            ->schema([
                                FileUpload::make('image_path')
                                    ->label('Variant Image')
                                    ->image()
                                    ->disk('public')
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
                CreateAction::make()
                    ->mutateDataUsing(function (array $data): array {
                        $exists = ProductItem::where('sku', $data['sku'])->exists();

                        if ($exists) {
                            Notification::make()
                                ->title('Variant already exists')
                                ->danger()
                                ->send();

                            throw ValidationException::withMessages([
                                'sku' => 'This combination of attributes already exists.',
                            ]);
                        }

                        return $data;
                    }),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
                ForceDeleteAction::make(),
                RestoreAction::make(),
            ]);
    }
}
