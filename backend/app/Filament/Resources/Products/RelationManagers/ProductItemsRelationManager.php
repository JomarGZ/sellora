<?php

declare(strict_types=1);

namespace App\Filament\Resources\Products\RelationManagers;

use App\Models\Attribute;
use App\Models\AttributeValue;
use App\Models\ProductItem;
use App\ProductItemService;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Infolists\Components\TextEntry;
use Filament\Notifications\Notification;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
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
                        TextInput::make('price')
                            ->required()
                            ->prefix('$')
                            ->numeric(),

                        TextInput::make('qty_in_stock')
                            ->numeric()
                            ->default(1)
                            ->required(),
                    ])->columns(3),

                Section::make('Attributes')
                    ->description('Select values for each attribute assigned to this product.')
                    ->schema(fn () => $this->buildAttributeFields()),

                Section::make('Item Images')
                    ->description('Up to 5 images for this specific variant.')
                    ->schema([
                        FileUpload::make('item_images')
                            ->label('Images')
                            ->image()
                            ->multiple()
                            ->maxFiles(5)
                            ->directory('product-item-images')
                            ->disk('public')
                            ->reorderable()
                            ->appendFiles()
                            ->helperText('Max 5 images. First image becomes the default.'),
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
                ImageColumn::make('primaryImage.image_path')
                    ->label('Image')
                    ->disk('public')
                    ->circular(false)
                    ->imageSize(48),
            ])
            ->filters([
                TrashedFilter::make(),
            ])
            ->headerActions([
                CreateAction::make()
                    ->using(function(array $data, string $model) {
                        $product = $this->getOwnerRecord();

                        $sku = app(ProductItemService::class)->generateSku($product, $data);

                        if (ProductItem::where('sku', $sku)->exists()) {
                            if (ProductItem::where('sku', $sku)->exists()) {

                                Notification::make()
                                    ->title('This variant already exists')
                                    ->danger()
                                    ->send();

                                throw ValidationException::withMessages(['sku' => 'This variant already exists']);
                            }
                        }
                        return app(ProductItemService::class)->create($data, $product);
                    })
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
                ForceDeleteAction::make(),
                RestoreAction::make(),
            ]);
    }


    protected function buildAttributeFields(): array
    {
        /** @var \App\Models\Product $product */
        $product = $this->getOwnerRecord();
 
        // Load attributes assigned to this product with pivot data
        $attributePivots = $product
            ->attributes()                    // belongsToMany via attribute_product
            ->withPivot('is_required')
            ->get();
 
        if ($attributePivots->isEmpty()) {
            return [
                TextEntry::make('no_attributes')
                    ->label('')
                    ->content('No attributes are assigned to this product yet.'),
            ];
        }
 
        return $attributePivots->map(function ($attribute) {
            $isRequired = (bool) $attribute->pivot->is_required;
 
            $field = Select::make("attribute_values.{$attribute->id}")
                ->label($attribute->name)
                ->options(
                    AttributeValue::where('attribute_id', $attribute->id)
                        ->get()
                        ->mapWithKeys(fn ($av) => [
                            $av->id => $this->formatAttributeValueLabel($av),
                        ])
                )
                ->searchable()
                ->preload()
                ->placeholder("Select {$attribute->name}")
                ->required($isRequired)
                ->helperText($isRequired ? 'Required' : 'Optional');
 
            return $field;
        })->values()->toArray();
    }

    protected function formatAttributeValueLabel(AttributeValue $av): string
    {
        $parts = [$av->value];
        if ($av->hex_color) {
            $parts[] = "(#{$av->hex_color})";
        }
        return implode(' ', $parts);
    }

}
