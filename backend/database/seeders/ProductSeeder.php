<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Attribute;
use App\Models\AttributeValue;
use App\Models\Product;
use App\Models\ProductItem;
use Illuminate\Database\Seeder;

final class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create attributes with values
        $color = Attribute::factory()->named('Color')->create();
        $size = Attribute::factory()->named('Size')->create();

        $colors = AttributeValue::factory()
            ->count(4)
            ->forAttribute($color)
            ->create();

        $sizes = AttributeValue::factory()
            ->count(4)
            ->forAttribute($size)
            ->create();

        // 2. Create 10 products
        Product::factory()
            ->count(10)
            ->create()
            ->each(function (Product $product) use ($colors, $sizes): void {

                // Product-level images (1 primary + 1 extra)
                $product->images()->createMany([
                    ['image_path' => 'https://placehold.co/800x600', 'is_primary' => true],
                    ['image_path' => 'https://placehold.co/800x600', 'is_primary' => false],
                ]);

                // 3. Create SKUs (one per color+size combo)
                foreach ($colors->random(2) as $color) {
                    foreach ($sizes->random(2) as $size) {

                        /** @var ProductItem $item */
                        $item = ProductItem::factory()->create([
                            'product_id' => $product->id,
                            'sku' => mb_strtoupper($product->slug.'-'.$color->value.'-'.$size->value),
                        ]);

                        // Attach attribute values to the SKU
                        $item->attributeValues()->attach([
                            $color->id,
                            $size->id,
                        ]);

                        // SKU-specific image
                        $item->images()->create([
                            'image_path' => 'https://placehold.co/800x600',
                        ]);
                    }
                }
            });
    }
}
