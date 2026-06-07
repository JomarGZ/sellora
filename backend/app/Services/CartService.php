<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\CartExpiredException;
use App\Exceptions\CartItemNotFoundException;
use App\Exceptions\CartNotFoundException;
use App\Exceptions\CartNotModifiableException;
use App\Exceptions\InsufficientStockException;
use App\Exceptions\ProductItemNotAvailableException;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductItem;
use App\Repositories\Contracts\ICartRepository;
use App\Repositories\Contracts\IProductItemRepository;

final class CartService
{
    public function __construct(
        private readonly ICartRepository $cartRepository,
        private readonly IProductItemRepository $productItemRepository,
    ) {}

    public function getOrCreateCart(int $userId): Cart
    {
        $cart = $this->cartRepository->findOrCreateActiveCart($userId);
 
        return $cart->load([
            'items',
            'items.productItem.product',
            'items.productItem.attributeValues',
            'items.productItem.images',
            'items.productItem' => fn ($q) => $q->where('status', 'active'),
        ]);
    }
 

     public function addItem(int $userId, int $productItemId, int $quantity): Cart
    {
        $cart = $this->cartRepository->findOrCreateActiveCart($userId);
 
        $this->assertCartIsModifiable($cart);
 
        $product = $this->loadAndValidateProduct($productItemId);
 
        $existingItem = $this->cartRepository->findItemByProduct($cart->id, $productItemId);
 
        if ($existingItem) {
            $newQuantity = $existingItem->quantity + $quantity;
            $this->assertSufficientStock($product, $newQuantity);
            $this->cartRepository->updateItemQuantity($existingItem, $newQuantity);
        } else {
            $this->assertSufficientStock($product, $quantity);
            // Capture the price at the moment the item is added.
            // Price changes after this point do not affect the cart item.
            $this->cartRepository->addItem(
                $cart,
                $productItemId,
                $quantity,
                (string) $product->price
            );
        }
 
        // Refresh expiry on every mutation so actively used carts
        // never expire. A cart only times out during inactivity.
        $this->refreshExpiry($cart);
 
        return $this->cartRepository->findForUserWithItems($cart->id, $userId);
    }

    public function updateItem(
        int $userId,
        int $cartId,
        int $itemId,
        int    $quantity
    ): Cart {
        $cart = $this->findCartOrFail($cartId, $userId);
        $this->assertCartIsModifiable($cart);
 
        $item = $this->findItemOrFail($cartId, $itemId);
 
        if ($quantity === 0) {
            $this->cartRepository->removeItem($item);
        } else {
            // Re-validate stock for the new quantity. Stock may have been
            // reserved by other users since this item was first added.
            $product = $this->loadAndValidateProduct($item->product_item_id);
            $this->assertSufficientStock($product, $quantity);
            $this->cartRepository->updateItemQuantity($item, $quantity);
        }
 
        $this->refreshExpiry($cart);
 
        return $this->cartRepository->findForUserWithItems($cartId, $userId);
    }

    public function removeItem(int $userId, int $cartId, int $itemId): Cart
    {
        $cart = $this->findCartOrFail($cartId, $userId);
        $this->assertCartIsModifiable($cart);
 
        $item = $this->findItemOrFail($cartId, $itemId);
 
        $this->cartRepository->removeItem($item);
 
        $this->refreshExpiry($cart);
 
        return $this->cartRepository->findForUserWithItems($cartId, $userId);
    }

    public function clearCart(int $userId, int $cartId): Cart
    {
        $cart = $this->findCartOrFail($cartId, $userId);
        $this->assertCartIsModifiable($cart);
 
        $this->cartRepository->clearItems($cart);
 
        $this->refreshExpiry($cart);
 
        return $cart->fresh()->load('items');
    }

    private function findCartOrFail(int $cartId, int $userId): Cart
    {
        $cart = $this->cartRepository->findForUser($cartId, $userId);
 
        if (!$cart) {
            throw new CartNotFoundException($cartId);
        }
 
        return $cart;
    }
 
    private function findItemOrFail(int $cartId, int $itemId): CartItem
    {
        $item = $this->cartRepository->findItem($cartId, $itemId);
 
        if (!$item) {
            throw new CartItemNotFoundException($itemId);
        }
 
        return $item;
    }
 
    /**
     * Assert that a cart is in a state that allows modification.
     *
     * Two conditions block modification:
     *
     * 1. Expiry — checked first. An active cart past its expires_at is
     *    treated as expired even if the cleanup command hasn't run yet.
     *    The user gets a clear "cart expired" message rather than silently
     *    operating on a stale cart. This check is belt-and-suspenders:
     *    the repository already excludes expired carts from find queries,
     *    but a cart fetched just before expiry could be mutated just after.
     *
     * 2. Non-active status — locked (Stripe session open), ordered
     *    (payment confirmed), or abandoned carts cannot be modified.
     */
    private function assertCartIsModifiable(Cart $cart): void
    {
        if ($cart->isExpired()) {
            throw new CartExpiredException($cart->id);
        }
 
        if (!$cart->isActive()) {
            throw new CartNotModifiableException($cart->status);
        }
    }
 
    private function loadAndValidateProduct(int $productItemId): ProductItem
    {
        $productItem = $this->productItemRepository->findAvailableById($productItemId);
 
        if (!$productItem) {
            throw new ProductItemNotAvailableException($productItemId);
        }
 
        return $productItem;
    }
 
    private function assertSufficientStock(ProductItem $productItem, int $quantity): void
    {
        if ($productItem->availableQty() < $quantity) {
            throw new InsufficientStockException(
                productItemId:   $productItem->id,
                productName: $productItem->product->name,
                requested:   $quantity,
                available:   $productItem->availableQty(),
            );
        }
    }
 
    /**
     * Push the cart's expiry forward by TTL_DAYS from now.
     *
     * Called on every successful mutation — never on reads. This means
     * an actively used cart is never abandoned mid-session. Only
     * inactivity for TTL_DAYS days causes expiry.
     *
     * WHY not refresh on reads: every GET /cart would cause an UPDATE,
     * which is wasteful. Only user-initiated mutations signal intent.
     */
    private function refreshExpiry(Cart $cart): void
    {
        $cart->update([
            'expires_at' => now()->addDays(Cart::TTL_DAYS),
        ]);
    }
 

    // public function updateItemQuantity(int $userId, int $cartItemId, int $qty)
    // {

    //     $item = $this->cartItemRepository->findById(
    //         $this->cartRepository->findOrCreateActiveCart($userId)->id,
    //         $cartItemId
    //     );

    //     if (! $item) {
    //         return null;
    //     }

    //     if ($qty <= 0) {
    //         $this->cartItemRepository->delete($item->id);

    //         return null;
    //     }

    //     return $this->cartItemRepository->update($item->id, [
    //         'quantity' => $qty,
    //     ]);
    // }


    // public function clearPurchasedItems(Order $order): void
    // {
    //     if ($order->checkout_type !== CheckoutType::Cart || ! $order->shopping_cart_id) {
    //         return;
    //     }

    //     $ids = $order->items->pluck('product_item_id')->toArray();

    //     $this->cartItemRepository->clearPurchased($order->shopping_cart_id, $ids);
    // }

    // public function buyNow(int $userId, int $productItemId, int $qty)
    // {
    //     $cart = $this->cartRepository->findOrCreateActiveCart($userId);

    //     $item = $this->cartItemRepository->findByProduct(
    //         $cart->id,
    //         $productItemId
    //     );

    //     if ($item) {
    //         $item = $this->cartItemRepository->update($item->id, [
    //             'quantity' => $item->quantity + $qty,
    //             'priority_at' => now()
    //         ]);
    //     } else {
    //         $item = $this->cartItemRepository->create([
    //             'shopping_cart_id' => $cart->id,
    //             'product_item_id' => $productItemId,
    //             'quantity' => $qty,
    //             'priority_at' => now()
    //         ]);
    //     }

    //     return $item->load('productItem');
    // }
}
