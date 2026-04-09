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
        $name = $this->faker->unique()->words(3, true);

        return [
            'brand_id' => Brand::factory(),
            'product_category_id' => ProductCategory::factory(),
            'name' => $name,
            'description' => fake()->paragraph(),
        ];
    }

    public function forBrand(Brand $brand): static
    {
        return $this->state(fn () => [
            'brand_id' => $brand->id,
        ]);
    }

    public function forCategory(ProductCategory $category): static
    {
        return $this->state(fn () => [
            'product_category_id' => $category->id,
        ]);
    }
}
