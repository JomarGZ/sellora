<?php

declare(strict_types=1);

namespace App\DTOs\V1;

use App\Models\AttributeValue;

final class AttributeGroupDTO
{
    /**
     * @param  array<int, AttributeValue>  $values
     */
    public function __construct(
        public int $id,
        public string $name,
        public array $values
    ) {}
}
