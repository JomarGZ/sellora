<?php

declare(strict_types=1);

namespace App\DTOs;

use Illuminate\Http\Request;

final readonly class ProductCatalogFilterDTO
{
    public function __construct(
        public readonly ?string $search,
        public readonly ?string $category,
        public readonly ?string $brand,
        public readonly ?float $minPrice,
        public readonly ?float $maxPrice,
        public readonly ?string $sort,
        public readonly int $perPage,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            search: $request->str('search')->trim()->value() ?: null,
            category: $request->input('category'),
            brand: $request->input('brand'),
            minPrice: $request->filled('min_price') ? (float) $request->input('min_price') : null,
            maxPrice: $request->filled('max_price') ? (float) $request->input('max_price') : null,
            sort: $request->input('sort'),
            perPage: min($request->integer('per_page', 15), 100),
        );
    }
}
