<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\ProductFilterDTO;
use App\Models\Product;
use App\Repositories\Contracts\IProductRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

final readonly class ProductService
{
    public function __construct(
        private IProductRepository $repository
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

    /**
     * @return LengthAwarePaginator<int, Product>
     */
    public function catalog(ProductFilterDTO $filters): LengthAwarePaginator
    {
        return $this->repository->catalog($filters);
    }
}
