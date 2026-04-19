<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\ShoppingCart;

final class CartRepository extends BaseRepository
{
    /**
     * Create a new class instance.
     */
    public function __construct(ShoppingCart $cart)
    {
        parent::__construct($cart);
    }

    public function getUserCartWithItems(int $userId)
    {
        return $this->model->query()
            ->where('user_id', $userId)
            ->with([
                'items.productItem.product',
            ])
            ->first();
    }
}
