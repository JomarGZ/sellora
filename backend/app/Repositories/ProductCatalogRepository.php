<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Product;
use App\Repositories\Contracts\IProductCatalogRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * @extends BaseRepository<Product>
 */
final class ProductCatalogRepository extends BaseRepository implements IProductCatalogRepository
{
    public function __construct(Product $product)
    {
        parent::__construct($product);
    }

    /**
     * @param  array<int, string>  $columns  Columns
     * @param  array<int, string>|string  $relations  Relations to eager load, e.g. ['brand', 'images']
     * @param  int  $limit  Number of results to return
     * @return Collection<int, Product>
     */
    public function getNewArrivals(array $columns = ['*'], array|string $relations = [], int $limit = 10): Collection
    {
        return $this->model
            ->select($columns)
            ->with($relations)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * @param  array<int, string>  $columns  Columns
     * @param  array<int, string>|string  $relations  Relations to eager load, e.g. ['brand', 'images']
     * @param  int  $limit  Number of results to return
     * @return Collection<int, Product>
     */
    public function getBestSellers(array $columns = ['*'], array|string $relations = [], int $limit = 10): Collection
    {
        return $this->model
            ->select($columns)
            ->with($relations)
            // ->withCount('orders') // Assuming there's an 'orders' relationship
            // ->orderBy('orders_count', 'desc')
            ->limit($limit)
            ->get();
    }
}
