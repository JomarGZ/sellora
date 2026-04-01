<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Attribute;
use App\Models\AttributeValue;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AttributeValue>
 */
final class AttributeValueFactory extends Factory
{
    /**
     * @var array<string, array<int, string>>
     */
    private static array $valueMap = [
        'Color' => ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow'],
        'Size' => ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        'Material' => ['Cotton', 'Polyester', 'Wool', 'Linen', 'Silk'],
        'Weight' => ['100g', '250g', '500g', '1kg', '2kg'],
        'Style' => ['Casual', 'Formal', 'Sport', 'Outdoor'],
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $attribute = Attribute::query()->inRandomOrder()->first() ?? Attribute::factory()->create();

        $values = self::$valueMap[$attribute->name] ?? [fake()->word()];

        return [
            'attribute_id' => $attribute->id,
            'value' => fake()->randomElement($values),
        ];
    }

    public function forAttribute(Attribute $attribute): static
    {
        $value = self::$valueMap[$attribute->name] ?? [fake()->word()];

        return $this->state(fn (array $attributes): array => [
            'attribute_id' => $attribute->id,
            'value' => fake()->randomElement($value),
        ]);
    }
}
