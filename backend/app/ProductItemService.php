<?php

namespace App;

use App\Models\AttributeValue;
use App\Models\Product;
use App\Models\ProductItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class ProductItemService
{
    public function create(array $data, Product $product): ProductItem
    {
        $attributeValueIds = collect($data['attribute_values'])
            ->filter()
            ->values()
            ->all();

        $images = $data['item_images'] ?? [];
        $data['product_id'] = $product->id;


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

    public function update(array $data, ProductItem $productItem)
    {
        $attributeValueIds = collect($data['attribute_values'] ?? [])
            ->filter()
            ->values()
            ->all();
        
        $images = $data['item_images'] ?? [];
        $oldImages = $productItem->images()->pluck('image_path')->toArray();
        try {
            return DB::transaction(function () use (
                $data, 
                $productItem, 
                $images, 
                $attributeValueIds, 
                $oldImages
                ) {

                $productItem->update([
                    'price' => $data['price'],
                    'qty' => $data['qty'],
                    'sku' => $data['sku'],
                ]);
                
                $productItem->attributeValues()->sync($attributeValueIds);
                

                $productItem->images()->delete();

                foreach ($images as $index => $path) {

                    $productItem->images()->create([
                        'image_path' => $path,
                        'is_primary' => $index === 0,
                        'sort_order' => $index,
                    ]);
                }

                $deletedImages = array_diff($oldImages, $images);

                foreach($deletedImages as $path) {
                    Storage::disk('public')->delete($path);
                }

                return $productItem;

            });
        } catch (Throwable $e) {
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
