<?php

namespace App\Repositories\Contracts;

use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Support\Collection;

interface ICartRepository
{
    
    public function findActiveCartWithItems(int $userId): ?Cart;
  
    public function lockCart(Cart $cart): void;
 
    public function markAsOrdered(Cart $cart): void;

    public function findForUser(int $cartId, int $userId): ?Cart;

    public function findForUserWithItems(int $cartId, int $userId): ?Cart;

    public function createForUser(int $userId): Cart;

    public function findOrCreateActiveCart(int $userId): Cart;

    public function abandonCart(Cart $cart): void;

    public function findItem(int $cartId, int $itemId): ?CartItem;

    public function findItemByProduct(int $cartId, int $productItemId): ?CartItem;

    public function addItem(
        Cart   $cart,
        int $productItemId,
        int    $quantity,
        string $unitPrice
    ): CartItem;
 
    /** Replace an item's quantity (not an increment). */
    public function updateItemQuantity(CartItem $item, int $quantity): void;
 
    /** Delete a specific cart item. */
    public function removeItem(CartItem $item): void;
 
    /** Delete all items from a cart. */
    public function clearItems(Cart $cart): void;

    public function findExpiredActiveCarts(): Collection;
    
}
