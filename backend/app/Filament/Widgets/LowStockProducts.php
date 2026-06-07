<?php

declare(strict_types=1);

namespace App\Filament\Widgets;

use App\Models\ProductItem;
use Filament\Actions\BulkActionGroup;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;

final class LowStockProducts extends TableWidget
{
    protected static ?int $sort = 5;

    protected int|string|array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
              ->query(
                    ProductItem::query()
                        ->with(['product', 'attributeValues'])
                        ->where('qty', '<', 10)
                        ->orderBy('qty', 'asc')
                )
            ->columns([
                TextColumn::make('product.name')
                    ->label('Product')
                    ->searchable(),
                TextColumn::make('attributes')
                    ->label('Variants')
                    ->state(function ($record) {
                        return $record->attributeValues
                            ->pluck('value')
                            ->toArray();
                    })
                    ->badge()
                    ->separator(','),
                TextColumn::make('price')
                    ->money()
                    ->sortable(),
                TextColumn::make('qty')
                    ->label('Stock')
                    ->badge()
                    ->color(fn ($state) => match (true) {
                            $state <= 10 => 'danger',
                            $state <= 30 => 'warning',
                            default => 'success'
                        }
                    ),
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
