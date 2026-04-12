<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Api\V1\ProductFilterRequest;

final readonly class ProductFilterDTO
{
    public function __construct(
        public ?string $search,
        public ?string $category,
        public ?string $brand,
        public ?float $minPrice,
        public ?float $maxPrice,
        public ?string $sort,
        public int $perPage,
    ) {}

    public static function fromRequest(ProductFilterRequest $request): self
    {
        return new self(
            search: $request->str('search')->trim()->value() ?: null,
            category: $request->string('category')->value() ?: null,
            brand: $request->string('brand')->value() ?: null,
            minPrice: $request->filled('min_price') ? (float) $request->string('min_price')->value() : null,
            maxPrice: $request->filled('max_price') ? (float) $request->string('max_price')->value() : null,
            sort: $request->string('sort')->value() ?: null,
            perPage: min($request->integer('per_page', 15), 100),
        );
    }
}
