<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Http\Resources\BrandResource;
use App\Http\Resources\CategoryResource;
use App\Services\ProductFilterService;
use Illuminate\Http\JsonResponse;

final class ProductFilterController extends ApiController
{
    public function __construct(
        private readonly ProductFilterService $service
    ) {}

    public function index(): JsonResponse
    {
        return $this->success(data: [
            'categories' => CategoryResource::collection(
                $this->service->getCategories()
            ),
            'brands' => BrandResource::collection(
                $this->service->getBrands()
            ),
        ]);
    }
}
