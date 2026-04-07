<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Http\Resources\ProductResource;
use App\Services\ProductCatalogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class ProductCatalogController extends ApiController
{
    public function __construct(
        private readonly ProductCatalogService $service
    ) {}

    // public function index(Request $request)
    // {
    // filters:
    // search (product name)
    // By category
    // By Brand
    // Price range
    // sort by price low to high, price high to low, newest, rating. default is sort by random
    // }

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
