<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Brand;
use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
final class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        return [
            'brand_id' => Brand::query()->inRandomOrder()->value('id') ?? Brand::factory(),
            'product_category_id' => ProductCategory::query()->inRandomOrder()->value('id') ?? ProductCategory::factory(),
            'name' => fake()->unique()->sentence(3),
            'description' => fake()->paragraph(2, true),
        ];
    }
}
