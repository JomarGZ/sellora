<?php

namespace App\Filament\Widgets;

use App\Models\ProductItem;
use Filament\Actions\BulkActionGroup;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

class LowStockProducts extends TableWidget
{

    protected function getTableQuery(): Builder
    {
        return ProductItem::query()
            ->where('qty_in_stock', '<', 10)
            ->orderBy('qty_in_stock', 'asc');
    }

    public function table(Table $table): Table
    {
        return $table
            ->query(fn (): Builder => ProductItem::query())
            ->columns([
                TextColumn::make('product.name')
                    ->searchable(),
                TextColumn::make('sku')
                    ->label('SKU')
                    ->searchable(),
                TextColumn::make('price')
                    ->money()
                    ->sortable(),
                TextColumn::make('qty_in_stock')
                    ->label('Stock')
                    ->badge()
                    ->color(fn ($state) => $state <= 5 ? 'danger' : 'warning'),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('deleted_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                //
            ])
            ->recordActions([
                //
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    //
                ]),
            ]);
    }
}
