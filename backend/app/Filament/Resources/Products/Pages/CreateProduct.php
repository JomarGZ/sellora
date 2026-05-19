<?php

declare(strict_types=1);

namespace App\Filament\Resources\Products\Pages;

use App\Filament\Resources\Products\ProductResource;
use App\Models\Product;
use Filament\Resources\Pages\CreateRecord;

final class CreateProduct extends CreateRecord
{
    protected static string $resource = ProductResource::class;

    protected function afterCreate(): void
    {
        $this->storeProductImages($this->record);
    }

    protected function storeProductImages(Product $product): void
    {
        $paths = $this->data['product_images'] ?? [];
 
        if (empty($paths)) {
            return;
        }
 
        $paths = array_slice(array_values($paths), 0, 5);
 
        foreach ($paths as $index => $path) {
            $product->images()->create([
                'image_path' => $path,
                'is_primary' => $index === 0,
                'sort_order' => $index,
            ]);
        }
    }
}
