<?php

namespace App;

use App\Models\AttributeValue;
use App\Models\Product;
use App\Models\ProductItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Throwable;

class ProductItemService
{
    public function create(array $data, Product $product): ProductItem
    {
        $attributeValueIds = collect($data['attribute_values'])
            ->filter()
            ->values()
            ->all();
        
        $attributePart = AttributeValue::whereIn('id', $attributeValueIds)
            ->orderBy('attribute_id')
            ->pluck('value')
            ->map(fn ($v) => Str::slug($v))
            ->implode('-');

        $images = $data['item_images'] ?? [];
        $data['product_id'] = $product->id;

        $baseSku = Str::slug($product->name);
        $sku = trim("{$baseSku}-{$attributePart}", '-');

        if (ProductItem::where('sku',$sku)->exists()) {
            throw ValidationException::withMessages([
                'attribute_values' => 'This product variant already exists.',
            ]);
        }
        $data['sku'] = Str::upper($sku);
        unset($data['attribute_values'], $data['item_images']);

        $uploadedFiles = $images;

        try {
            return DB::transaction(function () use ($data, $attributeValueIds, $images) {
                $productItem = ProductItem::create($data);    
                $productItem->attributeValues()->sync($attributeValueIds);

                    foreach ($images as $index => $path) {
                        $productItem->images()->create([
                            'image_path'       => $path,
                            'is_primary' => $index === 0,
                            'sort_order' => $index,
                        ]);
                    }
                return $productItem;
            });
        } catch (Throwable $e) {
            foreach ($uploadedFiles as $path) {
                Storage::disk('public')->delete($path);
            }
            throw $e;
        }

    }

    public function generateSku(Product $product, array $data)
    {
        $attributeValueIds = collect($data['attribute_values'] ?? [])
            ->filter()
            ->values()
            ->all();
        
        $attributePart = AttributeValue::whereIn('id', $attributeValueIds)
            ->orderBy('attribute_id')
            ->pluck('value')
            ->map(fn ($v) => Str::slug($v))
            ->implode('-');   
        
        $baseSku = Str::slug($product->name);
        $sku = trim("{$baseSku}-{$attributePart}", '-');

        return Str::upper($sku);
    }
}
