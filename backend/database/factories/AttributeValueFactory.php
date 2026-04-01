<?php

namespace Database\Factories;

use App\Models\Attribute;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AttributeValue>
 */
class AttributeValueFactory extends Factory
{

    private static array $valueMap = [
        'Color'    => ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow'],
        'Size'     => ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        'Material' => ['Cotton', 'Polyester', 'Wool', 'Linen', 'Silk'],
        'Weight'   => ['100g', '250g', '500g', '1kg', '2kg'],
        'Style'    => ['Casual', 'Formal', 'Sport', 'Outdoor'],
    ];
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'attribute_id' => Attribute::factory(),
            'value' => fake()->word(),
        ];
    }

    public function forAttribute(Attribute $attribute): static
    {
        $value = self::$valueMap[$attribute->name] ?? [fake()->word()];
        return $this->state(fn (array $attributes) => [
            'attribute_id' => $attribute->id,
            'value' => fake()->randomElement($value)
        ]);
    }
}
