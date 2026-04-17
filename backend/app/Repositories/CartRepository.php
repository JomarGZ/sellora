<?php

namespace App\Repositories;

use App\Models\Cart;
use App\Models\ShoppingCart;

class CartRepository extends BaseRepository
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
                'items.productItem.product'
            ])
            ->first();
    }
}
