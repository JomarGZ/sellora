<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Http\Resources\V1\ProductItemReviewResource;
use App\Services\ProductItemReviewService;
use Illuminate\Http\Request;

final class ProductReviewController extends ApiController
{
    public function __construct(private ProductItemReviewService $itemReviewService) {}

    public function index(Request $request, string $slug)
    {
        $reviews = $this->itemReviewService->getReviewByProductSlug(
            slug: $slug,
            perPage: $request->integer('per_page', 10)
        );

        return ProductItemReviewResource::collection($reviews)->additional([
            'message' => 'Paginated product reviews retrieved successfully',
            'success' => true,
        ]);
    }
}
