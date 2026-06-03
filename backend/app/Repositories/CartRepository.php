<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Cart;
use App\Models\CartItem;
use App\Repositories\Contracts\ICartRepository;
use Illuminate\Support\Collection;

final class CartRepository extends BaseRepository implements ICartRepository
{
    /**
     * Create a new class instance.
     */
    public function __construct(Cart $cart)
    {
        parent::__construct($cart);
    }

    public function findActiveCartWithItems(int $userId): ?Cart
    {
        return Cart::query()
            ->where('user_id', $userId)
            ->where('status', Cart::STATUS_ACTIVE)
            // Exclude expired carts — an expired active cart should
            // not be usable for checkout. The cleanup command will
            // formally abandon it on its next run, but we must not
            // serve it in the meantime.
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->with([
                'items',
                'items.product' => fn ($q) => $q->where('status', 'active'),
            ])
            ->latest()
            ->first();
    }
 
    public function lockCart(Cart $cart): void
    {
        $cart->update(['status' => Cart::STATUS_LOCKED]);
    }
 
    public function markAsOrdered(Cart $cart): void
    {
        $cart->update(['status' => Cart::STATUS_ORDERED]);
    }
 
    // =========================================================
    // Cart management methods
    // =========================================================
 
    public function findForUser(int $cartId, int $userId): ?Cart
    {
        return Cart::query()
            ->where('id', $cartId)
            ->where('user_id', $userId)
            ->first();
    }
 
    public function findForUserWithItems(int $cartId, int $userId): ?Cart
    {
        return Cart::query()
            ->where('id', $cartId)
            ->where('user_id', $userId)
            ->with([
                'items',
                'items.productItem' => fn ($q) => $q->where('status', 'active'),
            ])
            ->first();
    }
 
    public function createForUser(int $userId): Cart
    {
        return Cart::create([
            'user_id'    => $userId,
            'status'     => Cart::STATUS_ACTIVE,
            // Set expiry on creation so every cart has a TTL from birth.
            // The AbandonExpiredCarts command uses this to clean up stale carts.
            'expires_at' => now()->addDays(Cart::TTL_DAYS),
        ]);
    }
 
    public function findOrCreateActiveCart(int $userId): Cart
    {
        // Find the most recent non-expired active cart.
        // If the user's only active cart is expired, we fall through
        // and create a fresh one. The expired cart will be formally
        // abandoned by the scheduled command on its next run.
        $existing = Cart::query()
            ->where('user_id', $userId)
            ->where('status', Cart::STATUS_ACTIVE)
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->latest()
            ->first();
 
        return $existing ?? $this->createForUser($userId);
    }
 
    public function abandonCart(Cart $cart): void
    {
        $cart->update(['status' => Cart::STATUS_ABANDONED]);
    }
 
    // =========================================================
    // Cart item methods
    // =========================================================
 
    public function findItem(int $cartId, int $itemId): ?CartItem
    {
        return CartItem::query()
            ->where('id', $itemId)
            ->where('cart_id', $cartId)
            ->with('productItem')
            ->first();
    }
 
    public function findItemByProduct(int $cartId, int $productItemId): ?CartItem
    {
        return CartItem::query()
            ->where('cart_id', $cartId)
            ->where('product_item_id', $productItemId)
            ->first();
    }
 
    public function addItem(
        Cart   $cart,
        int $productItemId,
        int    $quantity,
        string $unitPrice
    ): CartItem {
        return CartItem::create([
            'cart_id'    => $cart->id,
            'product_item_id' => $productItemId,
            'quantity'   => $quantity,
            'unit_price' => $unitPrice,
        ]);
    }
 
    public function updateItemQuantity(CartItem $item, int $quantity): void
    {
        $item->update(['quantity' => $quantity]);
    }
 
    public function removeItem(CartItem $item): void
    {
        $item->delete();
    }
 
    public function clearItems(Cart $cart): void
    {
        $cart->items()->delete();
    }
 
    // =========================================================
    // Cleanup methods
    // =========================================================
 
    public function findExpiredActiveCarts(): Collection
    {
        // scopeExpiredActive() is defined on the Cart model:
        //   status = active AND expires_at IS NOT NULL AND expires_at < now()
        return Cart::query()
            ->expiredActive()
            ->with('items')
            ->get();
    }
}
