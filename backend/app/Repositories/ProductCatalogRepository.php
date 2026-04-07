<?php

declare(strict_types=1);

namespace App\Repositories;

use App\DTOs\ProductCatalogFilterDTO;
use App\Models\Product;
use App\Repositories\Contracts\IProductCatalogRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

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
        return $this->query()
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
        return $this->query()
            ->select($columns)
            ->with($relations)
            // ->withCount('orders') // Assuming there's an 'orders' relationship
            // ->orderBy('orders_count', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * @return LengthAwarePaginator<int, Product>
     */
    public function catalog(ProductCatalogFilterDTO $filters): LengthAwarePaginator
    {
        return $this->query()
            ->select([
                'id',
                'brand_id',
                'product_category_id',
                'name',
                'slug',
                'description',
                'created_at',
            ])
            ->with(['brand', 'category', 'primaryImage'])
            ->search($filters->search)
            ->filterByCategory($filters->category)
            ->filterByBrand($filters->brand)
            ->filterByPriceRange($filters->minPrice, $filters->maxPrice)
            ->sortBy($filters->sort)
            ->paginate($filters->perPage);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Builder<Product>
     */
    private function query(): \Illuminate\Database\Eloquent\Builder
    {
        return $this->model->newQuery(); // @phpstan-ignore-line
    }
}
