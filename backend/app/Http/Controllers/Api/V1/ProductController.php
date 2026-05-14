<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\DTOs\V1\ProductFilterDTO;
use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\Api\V1\ProductFilterRequest;
use App\Http\Resources\V1\AttributeResource;
use App\Http\Resources\V1\ProductDetailResource;
use App\Http\Resources\V1\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class ProductController extends ApiController
{
    public function __construct(
        private readonly ProductService $service
    ) {}

    public function index(ProductFilterRequest $request): AnonymousResourceCollection
    {
        $products = $this->service->catalog(
            ProductFilterDTO::fromRequest($request)
        );

        return ProductResource::collection($products)->additional(['message' => 'Paginated products retrieved successfully.', 'success' => true]);
    }

    public function show(Product $product): JsonResponse
    {
        $product->load([
            'images:id,product_id,image_path,is_primary',
            'brand:id,name,slug,logo',
            'category:id,name,slug',
            'productItems:id,product_id,sku,price,qty_in_stock',
            'productItems.images:id,product_item_id,image_path',
            'productItems.attributeValues:id,attribute_id,value,hex_color,image',
            'productItems.attributeValues.attribute:id,name',
        ]);

        $product->loadAvg('productItemReviews as avg_rating', 'rating')
            ->loadCount('productItemReviews as reviews_count')
            ->loadMin('productItems', 'price')
            ->loadMax('productItems', 'price')
            ->loadSum('productItems', 'qty_in_stock');
        
        $ratingBreakdown = $product->productItemReviews()
            ->selectRaw('rating, COUNT(*) as total')
            ->groupBy('rating')
            ->pluck('total','rating');


        $product->rating_breakdown = collect([5,4,3,2,1])
            ->map(function($star) use ($ratingBreakdown, $product) {
                $count = $ratingBreakdown->get($star, 0);
                return [
                    'stars' => $star,
                    'count' => $count,
                    'percentage' => $product->reviews_count > 0 
                        ? round(($count / $product->reviews_count) * 100, 2)
                        : 0
                ];
            });


        $attributes = $this->service->resolveAttributes($product);

        return $this->success(
            data: (new ProductDetailResource($product))
                ->additional([
                    'attributes' => AttributeResource::collection($attributes),
                ]),
            message: 'Product retrieved successfully.'
        );
    }

    public function newArrivals(Request $request): JsonResponse
    {
        $limit = (int) $request->query('limit', 10);
        $result = $this->service->getNewArrivals(limit: $limit);

        return $this->success(
            data: ProductResource::collection($result),
            message: 'New arrivals retrieved successfully.'
        );
    }

    public function bestSellers(Request $request): JsonResponse
    {
        $limit = (int) $request->query('limit', 10);
        $result = $this->service->getBestSellers(limit: $limit);

        return $this->success(
            data: ProductResource::collection($result),
            message: 'Best sellers retrieved successfully.'
        );
    }
}
