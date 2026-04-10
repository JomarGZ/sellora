<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\AttributeGroupDTO;
use App\DTOs\ProductFilterDTO;
use App\Models\Product;
use App\Repositories\Contracts\IProductRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection as SupportCollection;

final readonly class ProductService
{
    public function __construct(
        private IProductRepository $repository
    ) {}

    public function findBySlug(string $slug): ?Product
    {
        return $this->repository->findBySlug($slug);
    }

    /**
     * @param  array<int, string>  $columns
     * @param  array<int, string>|string  $relations
     * @return Collection<int, Product>
     */
    public function getNewArrivals(array $columns = ['*'], array|string $relations = [], int $limit = 10): Collection
    {
        return $this->repository->getNewArrivals($columns, $relations, $limit);
    }

    /**
     * @param  array<int, string>  $columns
     * @param  array<int, string>|string  $relations
     * @return Collection<int, Product>
     */
    public function getBestSellers(array $columns = ['*'], array|string $relations = [], int $limit = 10): Collection
    {
        return $this->repository->getBestSellers($columns, $relations, $limit);
    }

    /**
     * @return LengthAwarePaginator<int, Product>
     */
    public function catalog(ProductFilterDTO $filters): LengthAwarePaginator
    {
        return $this->repository->catalog($filters);
    }

    public function resolveAttributes(Product $product): SupportCollection
    {
        return $product->productItems
            ->flatMap(fn ($item) => $item->attributeValues)
            ->groupBy(fn ($value) => $value->attribute->id)
            ->map(fn ($values) => new AttributeGroupDTO(
                id: $values->first()->attribute->id,
                name: $values->first()->attribute->name,
                values: $values->unique('id')->values()->all(),
            ))
            ->values();
    }
}
