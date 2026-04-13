<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Http\Resources\V1\BrandResource;
use App\Http\Resources\V1\CategoryResource;
use App\Repositories\Contracts\IProductFilterRepository;
use Illuminate\Http\JsonResponse;

final class ProductFilterController extends ApiController
{
    public function __construct(
        private readonly IProductFilterRepository $repository
    ) {}

    public function index(): JsonResponse
    {
        return $this->success(data: [
            'categories' => CategoryResource::collection(
                $this->repository->getCategories()
            ),
            'brands' => BrandResource::collection(
                $this->repository->getBrands()
            ),
        ]);
    }
}
