<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Services\ProductCatalogService;

final class ProductCatalogController extends ApiController
{
    public function __construct(
        private readonly ProductCatalogService $service
    ) {}

    public function newArrivals()
    {
        return $this->success(data: $this->service->getNewArrivals(), message: 'New arrivals retrieved successfully.');
    }

    public function bestSellers()
    {
        return $this->success(data: $this->service->getBestSellers(), message: 'Best sellers retrieved successfully.');
    }
}
