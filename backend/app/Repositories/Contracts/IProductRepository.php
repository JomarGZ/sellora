<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\DTOs\ProductFilterDTO;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface IProductRepository
{
    /**
     * @param  array<int, string>  $columns  Columns to select
     * @param  array<int, string>|string  $relation  Relations to eager load
     * @param  int  $limit  Number of results
     * @return Collection<int, Product>
     */
    public function getNewArrivals(array $columns = ['*'], array|string $relation = [], int $limit = 10): Collection;

    /**
     * @param  array<int, string>  $columns  Columns to select
     * @param  array<int, string>|string  $relation  Relations to eager load
     * @param  int  $limit  Number of results
     * @return Collection<int, Product>
     */
    public function getBestSellers(array $columns = ['*'], array|string $relation = [], int $limit = 10): Collection;

    /**
     * @return LengthAwarePaginator<int, Product>
     */
    public function catalog(ProductFilterDTO $filters): LengthAwarePaginator;

    public function findBySlug(string $slug): ?Product;
}
