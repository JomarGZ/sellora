<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attribute>
 */
class AttributeFactory extends Factory
{
    private static array $attributes = ['Color', 'Size', 'Material', 'Weight', 'Style'];
    private static int $index = 0;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = self::$attributes[self::$index % count(self::$attributes)];
        self::$index++;
    
        return [
            'name' => $name
        ];
    }

    public function named(string $name): static
    {
        return $this->state(fn() => [
            'name' => $name
        ]);
    }
}
