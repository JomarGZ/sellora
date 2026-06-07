<?php

declare(strict_types=1);

namespace App\Repositories;

use App\DTOs\V1\ProductFilterDTO;
use App\Models\Order;
use App\Models\Product;
use App\Repositories\Contracts\IProductRepository;
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
    public function getNewArrivals(array $columns = ['*'], int $limit = 10): Collection
    {
         $days = config('store.new_product_days', 14);
        return $this->model->query()
            ->select($columns)
            ->isActive()
            ->with(['primaryImage', 'brand', 'category'])
            ->withAvg('productItemReviews as avg_rating', 'rating')
            ->withCount('productItemReviews as reviews_count')
            ->where('created_at', '>=',  now()->subDays($days))
            ->withCount([
                'orderItems as sold_count' => function ($query) {
                    $query->whereHas('order', function ($q) {
                        $q->whereIn('status', Order::saleStatus());
                    });
                },
            ])
            ->withMin('productItems', 'price')
            ->latest()
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
            ->isActive()
            ->with(['primaryImage', 'brand', 'category'])
            ->withAvg('productItemReviews as avg_rating', 'rating')
            ->withCount('productItemReviews as reviews_count')
            ->withCount([
                'orderItems as sold_count' => function ($query) {
                    $query->whereHas('order', function ($q) {
                        $q->whereIn('status', Order::saleStatus());
                    });
                },
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
            ->isActive()
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
                        $q->whereIn('status', Order::saleStatus());
                    });
                },
            ])
            ->orderByDesc('sold_count')
            ->paginate($filters->perPage);
    }
}
