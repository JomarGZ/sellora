<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Product;
use App\Repositories\Contracts\IProductCatalogRepository;
use Illuminate\Database\Eloquent\Collection;

final readonly class ProductCatalogService
{
    public function __construct(
        private IProductCatalogRepository $repository
    ) {}

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
}
