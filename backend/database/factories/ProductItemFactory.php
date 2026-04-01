<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\ProductItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductItem>
 */
final class ProductItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'sku' => mb_strtoupper(fake()->unique()->bothify('SKU-####-????')),
            'price' => fake()->randomFloat(2, 99, 9999),
            'qty_in_stock' => fake()->numberBetween(0, 500),
        ];
    }

    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes): array => [
            'qty_in_stock' => 0,
        ]);
    }

    public function lowStock(): static
    {
        return $this->state(fn (array $attributes): array => [
            'qty_in_stock' => fake()->numberBetween(1, 5),
        ]);
    }
}
