<?php

declare(strict_types=1);

namespace App\Repositories;

use App\DTOs\V1\ProductFilterDTO;
use App\Enums\OrderStatus;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * @extends BaseRepository<Product>
 */
final class ProductRepository extends BaseRepository
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
    public function getNewArrivals(array $columns = ['*'], int $limit = 10): Collection
    {
        return $this->model->query()
            ->select($columns)
            ->with(['primaryImage', 'brand', 'category'])
            ->withAvg('productItemReviews as avg_rating', 'rating')
            ->withCount('productItemReviews as reviews_count')
            ->withCount([
                'orderItems as sold_count' => function ($query) {
                    $query->whereHas('order', function ($q) {
                        $q->where('status', OrderStatus::Completed);
                    });
                }
            ])
            ->withMin('productItems', 'price')
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
    public function getBestSellers(array $columns = ['*'], int $limit = 10): Collection
    {
        return $this->model->query()
            ->select($columns)
            ->with(['primaryImage', 'brand', 'category'])
            ->withAvg('productItemReviews as avg_rating', 'rating')
            ->withCount('productItemReviews as reviews_count')
            ->withCount([
                'orderItems as sold_count' => function ($query) {
                    $query->whereHas('order', function ($q) {
                        $q->where('status', OrderStatus::Completed);
                    });
                }
            ])
            ->having('sold_count', '>=', config('shop.best_seller_min_sales'))
            ->orderByDesc('sold_count')
            ->withMin('productItems', 'price')
            ->limit($limit)
            ->get();
    }

    /**
     * @return LengthAwarePaginator<int, Product>
     */
    public function catalog(ProductFilterDTO $filters): LengthAwarePaginator
    {
        return $this->model->query()
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
            ->filterByCategory($filters->categories)
            ->filterByBrand($filters->brands)
            ->filterByPriceRange($filters->minPrice, $filters->maxPrice)
            ->sortBy($filters->sort)
            ->withMin('productItems', 'price')
            ->withAvg('productItemReviews as avg_rating', 'rating')
            ->withCount('productItemReviews as reviews_count')
            ->withCount([
                'orderItems as sold_count' => function ($query) {
                    $query->whereHas('order', function ($q) {
                        $q->where('status', OrderStatus::Completed);
                    });
                }
            ])
            ->orderByDesc('sold_count')
            ->paginate(1);
    }

    public function findBySlug(string $slug): ?Product
    {
        return $this->model->query()
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
            ->withAvg('productItemReviews as avg_rating', 'rating')
            ->withCount('productItemReviews as reviews_count')
            ->withMin('productItems', 'price')
            ->withMax('productItems', 'price')
            ->withSum('productItems', 'qty_in_stock')
            ->where('slug', $slug)
            ->first();
    }
}
