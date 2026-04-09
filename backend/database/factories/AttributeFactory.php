<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Attribute;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Attribute>
 */
final class AttributeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        return [
            'name' => $this->faker->unique()->randomElement([
                'Color', 'Size', 'Material', 'Pattern',
                'Fit', 'Colorway', 'Width', 'Closure',
            ]),
        ];
    }

    public function named(string $name): static
    {
        return $this->state(fn (): array => [
            'name' => $name,
        ]);
    }
}
