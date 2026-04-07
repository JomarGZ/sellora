<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\DTOs\ProductCatalogFilterDTO;
use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\ProductCatalogRequest;
use App\Http\Resources\ProductResource;
use App\Services\ProductCatalogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class ProductCatalogController extends ApiController
{
    public function __construct(
        private readonly ProductCatalogService $service
    ) {}

    public function index(ProductCatalogRequest $request): AnonymousResourceCollection
    {
        $products = $this->service->catalog(
            ProductCatalogFilterDTO::fromRequest($request)
        );

        return ProductResource::collection($products);
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
