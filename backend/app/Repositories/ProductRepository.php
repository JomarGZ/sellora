<?php

declare(strict_types=1);

namespace App\Repositories;

use App\DTOs\V1\ProductFilterDTO;
use App\Models\Product;
use App\Repositories\Contracts\IProductRepository;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * @extends BaseRepository<Product>
 */
final class ProductRepository extends BaseRepository implements IProductRepository
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
    public function catalog(ProductFilterDTO $filters): LengthAwarePaginator
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

    public function findBySlug(string $slug): ?Product
    {
        return $this->query()
            ->select([
                'id',
                'brand_id',
                'product_category_id',
                'name',
                'slug',
                'description',
            ])
            ->with([
                'images:id,product_id,image_path,is_primary',
                'brand:id,name,slug,logo',
                'category:id,name,slug',
                'productItems:id,product_id,sku,price,qty_in_stock',
                'productItems.images:id,product_item_id,image_path',
                'productItems.attributeValues:id,attribute_id,value,hex_color,image',
                'productItems.attributeValues.attribute:id,name',
            ])
            ->withMin('productItems', 'price')
            ->withMax('productItems', 'price')
            ->withSum('productItems', 'qty_in_stock')
            ->where('slug', $slug)
            ->first();
    }

    /**
     * @return Builder<Product>
     */
    private function query(): Builder
    {
        return $this->model->newQuery();
    }
}
