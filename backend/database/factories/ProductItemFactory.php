<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductItem;
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
            'sku' => fake()->unique()->bothify('SKU-####-???'),
            'price' => fake()->randomFloat(2, 10, 10000),
            'qty_in_stock' => fake()->numberBetween(0, 200),
        ];
    }

    public function forProduct(Product $product): static
    {
        return $this->state(fn () => [
            'product_id' => $product->id,
        ]);
    }

    public function outOfStock(): static
    {
        return $this->state(fn () => [
            'qty_in_stock' => 0,
        ]);
    }

    public function withPrice(float $price): static
    {
        return $this->state(fn () => [
            'price' => $price,
        ]);
    }
}
