<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\V1\AttributeGroupDTO;
use App\DTOs\V1\ProductFilterDTO;
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

    /**
     * @return SupportCollection<int, AttributeGroupDTO>
     */
    public function resolveAttributes(Product $product): SupportCollection
    {
        return $product->productItems
            ->flatMap(fn ($item) => $item->attributeValues)
            ->groupBy(fn ($value) => $value->attribute->id)
            ->map(function ($values): AttributeGroupDTO {
                $first = $values->firstOrFail();

                return new AttributeGroupDTO(
                    id: $first->attribute->id,
                    name: $first->attribute->name,
                    values: $values->unique('id')->values()->all(),
                );
            })
            ->values();
    }
}
