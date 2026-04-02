<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\ProductItemImage;
use App\Models\ProductItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductItemImage>
 */
final class ProductItemImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_item_id' => ProductItem::factory(),
            'image_path' => 'https://placehold.co/800x600',
        ];
    }
}
