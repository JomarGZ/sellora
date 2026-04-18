<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\DTOs\CreateReviewDTO;
use App\Http\Controllers\Api\ApiController;
use App\Http\Resources\V1\ProductItemReviewResource;
use App\Services\ProductItemReviewService;
use Illuminate\Http\Request;

final class ProductItemReviewController extends ApiController
{
    public function __construct(private ProductItemReviewService $itemReviewService) {}

    public function store(Request $request)
    {
        $request->validate([
            'order_item_id' => ['required', 'integer'],
            'product_item_id' => ['required', 'integer'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string'],
        ]);

        $review = $this->itemReviewService->createReview(new CreateReviewDTO(
            userId: $request->user()->id,
            orderItemId: $request->order_item_id,
            productItemId: $request->product_item_id,
            rating: $request->rating,
            comment: $request->comment
        ));

        return $this->created(
            data: new ProductItemReviewResource($review),
            message: 'Review submitted successfully.'
        );
    }
}
