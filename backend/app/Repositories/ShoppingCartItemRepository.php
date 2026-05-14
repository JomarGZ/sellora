<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\ShoppingCartItem;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ShoppingCartItemRepository extends BaseRepository
{
    public function __construct(ShoppingCartItem $model)
    {
        parent::__construct($model);
    }

    public function paginateByCartId(int $cartId, int $perPage = 5): LengthAwarePaginator
    {
        return $this->model
            ->where('shopping_cart_id', $cartId)
            ->with([
                'productItem',
                'productItem.product',
                'productItem.attributeValues.attribute',
                'productItem.images',
            ])
            ->orderByDesc('priority_at')
            ->latest()
            ->paginate($perPage);
    }

    public function findByProduct(int $cartId, int $productItemId)
    {
        return $this->model
            ->where('shopping_cart_id', $cartId)
            ->where('product_item_id', $productItemId)
            ->lockForUpdate()
            ->first();
    }

    public function findById(int $cartId, int $cartItemId)
    {
        return $this->model
            ->where('shopping_cart_id', $cartId)
            ->where('id', $cartItemId)
            ->first();
    }

    public function clearPurchased(int $cartId, array $productItemIds)
    {
        return $this->model
            ->where('shopping_cart_id', $cartId)
            ->whereIn('product_item_id', $productItemIds)
            ->delete();
    }

    public function getByIdsAndCartId(int $cartId, array $ids)
    {
        return $this->model
            ->where('shopping_cart_id', $cartId)
            ->whereIn('id', $ids)
            ->with('productItem')
            ->get();
    }
}
