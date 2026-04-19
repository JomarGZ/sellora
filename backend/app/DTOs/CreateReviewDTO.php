<?php

declare(strict_types=1);

namespace App\DTOs;

final class CreateReviewDTO
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        public int $userId,
        public int $orderItemId,
        public int $productItemId,
        public int $rating,
        public ?string $comment
    ) {}
}
