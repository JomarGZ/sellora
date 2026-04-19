<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\CreateReviewDTO;
use App\Repositories\ProductItemReviewRepository;
use Exception;

final class ProductItemReviewService
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        private ProductItemReviewRepository $productItemReviewRepo
    ) {}

    public function createReview(CreateReviewDTO $dto)
    {
        $existing = $this->productItemReviewRepo->findByUserAndOrderItem($dto->userId, $dto->orderItemId);

        if ($existing) {
            throw new Exception('You already review this item.');
        }

        return $this->productItemReviewRepo->create([
            'user_id' => $dto->userId,
            'order_item_id' => $dto->orderItemId,
            'product_item_id' => $dto->productItemId,
            'rating' => $dto->rating,
            'comment' => $dto->comment,
        ]);
    }

    public function getReviewByProductSlug(string $slug, int $perPage = 10)
    {
        return $this->productItemReviewRepo->getByProductSlug($slug, $perPage);
    }
}
