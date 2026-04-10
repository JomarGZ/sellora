<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\DTOs\ProductFilterDTO;
use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\ProductFilterRequest;
use App\Http\Resources\ProductResource;
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
