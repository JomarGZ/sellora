<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\ProductItemReview;
use Illuminate\Pagination\LengthAwarePaginator;

final class ProductItemReviewRepository extends BaseRepository
{
    public function __construct(ProductItemReview $productItemReview)
    {
        parent::__construct($productItemReview);
    }

    public function findByUserAndOrderItem(int $userId, int $orderItemId)
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('order_item_id', $orderItemId)
            ->first();
    }

    public function getByProductSlug(string $slug, int $perPage = 10): LengthAwarePaginator
    {
        return $this->model->query()
            ->whereHas('productItem.product', function ($q) use ($slug) {
                $q->where('slug', $slug);
            })
            ->with([
                'user:id,first_name,last_name',
                'productItem.id,sku',
            ])
            ->latest()
            ->paginate($perPage);
    }
}
