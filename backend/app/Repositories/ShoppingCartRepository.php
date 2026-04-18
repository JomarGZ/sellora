<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\ShoppingCart;
use App\Models\ShoppingCartItem;

final class ShoppingCartRepository extends BaseRepository
{
    public function __construct(ShoppingCart $model)
    {
        parent::__construct($model);
    }

    public function getOrCreateByUserId(int $userId)
    {
        return $this->model
            ->with('items.productItem')
            ->firstOrCreate([
                'user_id' => $userId,
            ]);
    }

    public function findItemByProduct(int $cartId, int $productItemId)
    {
        return ShoppingCartItem::where('shopping_cart_id', $cartId)
            ->where('product_item_id', $productItemId)
            ->first();
    }

    public function findItemById(int $cartId, int $cartItemId)
    {
        return ShoppingCartItem::where('shopping_cart_id', $cartId)
            ->where('id', $cartItemId)
            ->first();
    }

    public function createItem(int $cartId, array $data)
    {
        return ShoppingCartItem::create([
            'shopping_cart_id' => $cartId,
            ...$data,
        ]);
    }

    public function updateItem(int $cartItemId, array $data)
    {
        $item = ShoppingCartItem::findOrFail($cartItemId);
        $item->update($data);

        return $item->fresh();
    }

    public function deleteItem(int $cartItemId)
    {
        return ShoppingCartItem::destroy($cartItemId);
    }

    public function clearCart(int $cartId)
    {
        return ShoppingCartItem::where('shopping_cart_id', $cartId)->delete();
    }
}
