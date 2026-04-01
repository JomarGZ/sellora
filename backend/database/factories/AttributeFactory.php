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
     * @var array<int, string>
     */
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
            'name' => $name,
        ];
    }

    public function named(string $name): static
    {
        return $this->state(fn (): array => [
            'name' => $name,
        ]);
    }
}
