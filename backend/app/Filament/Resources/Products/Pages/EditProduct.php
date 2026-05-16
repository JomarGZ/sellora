<?php

declare(strict_types=1);

namespace App\Filament\Resources\Products\Pages;

use App\Filament\Resources\Products\ProductResource;
use App\Models\Product;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

final class EditProduct extends EditRecord
{
    protected static string $resource = ProductResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $data['product_images'] = $this->record
            ->images()
            ->orderBy('sort_order')
            ->pluck('path')
            ->toArray();
 
        return $data;
    }

    protected function afterSave(): void
    {
        $this->syncProductImages($this->record);
    }

    protected function syncProductImages(Product $product): void
    {
        $paths = $this->data['product_images'] ?? [];
        $paths = array_slice(array_values(array_filter($paths)), 0, 5);
 
        // Delete images that were removed
        $product->images()
            ->whereNotIn('image_path', $paths)
            ->delete();
 
        foreach ($paths as $index => $path) {
            $product->images()->updateOrCreate(
                ['image_path' => $path],
                [
                    'is_primary' => $index === 0,
                    'sort_order' => $index,
                ]
            );
        }
    }
}
