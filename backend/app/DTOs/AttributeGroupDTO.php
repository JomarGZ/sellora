<?php

declare(strict_types=1);

namespace App\DTOs;

final class AttributeGroupDTO
{
    public function __construct(
        public int $id,
        public string $name,
        public array $values
    ) {}
}
