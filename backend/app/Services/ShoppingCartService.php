<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\CheckoutType;
use App\Models\Order;
use App\Repositories\ShoppingCartItemRepository;
use App\Repositories\ShoppingCartRepository;
use Illuminate\Support\Facades\DB;

final class ShoppingCartService
{
    public function __construct(
        private ShoppingCartRepository $cartRepository,
        private ShoppingCartItemRepository $cartItemRepository
    ) {}

    public function getCart(int $userId)
    {
        return $this->cartRepository->getOrCreateByUserId($userId);
    }

    public function addItem(int $userId, int $productItemId, int $qty)
    {
        return DB::transaction(function () use ($userId, $productItemId, $qty) {

            $cart = $this->cartRepository->getOrCreateByUserId($userId);

            $item = $this->cartItemRepository->findByProduct(
                $cart->id,
                $productItemId
            );

            if ($item) {
                $item = $this->cartItemRepository->update($item->id, [
                    'quantity' => $item->quantity + $qty,
                ]);
            } else {
                $item = $this->cartItemRepository->create([
                    'shopping_cart_id' => $cart->id,
                    'product_item_id' => $productItemId,
                    'quantity' => $qty,
                ]);
            }

            return $item->fresh()->load('productItem.product');

        });
    }

    public function updateItemQuantity(int $userId, int $cartItemId, int $qty)
    {

        $item = $this->cartItemRepository->findById(
            $this->cartRepository->getOrCreateByUserId($userId)->id,
            $cartItemId
        );

        if (! $item) {
            return null;
        }

        if ($qty <= 0) {
            $this->cartItemRepository->delete($item->id);

            return null;
        }

        return $this->cartItemRepository->update($item->id, [
            'quantity' => $qty,
        ]);
    }

    public function removeItem(int $userId, int $cartItemId)
    {
        $cart = $this->cartRepository->getOrCreateByUserId($userId);

        $item = $this->cartItemRepository->findById(
            $cart->id,
            $cartItemId
        );

        if (! $item) {
            return false;
        }

        return $this->cartItemRepository->delete($item->id);
    }

    public function clearPurchasedItems(Order $order): void
    {
        if ($order->checkout_type !== CheckoutType::Cart || ! $order->shopping_cart_id) {
            return;
        }

        $ids = $order->items->pluck('product_item_id')->toArray();

        $this->cartItemRepository->clearPurchased($order->shopping_cart_id, $ids);
    }

    public function buyNow(int $userId, int $productItemId, int $qty)
    {
        $cart = $this->cartRepository->getOrCreateByUserId($userId);

        $item = $this->cartItemRepository->findByProduct(
            $cart->id,
            $productItemId
        );

        if ($item) {
            $item = $this->cartItemRepository->update($item->id, [
                'quantity' => $item->quantity + $qty,
            ]);
        } else {
            $item = $this->cartItemRepository->create([
                'shopping_cart_id' => $cart->id,
                'product_item_id' => $productItemId,
                'quantity' => $qty,
            ]);
        }

        return $cart->fresh()->load('items.productItem.product');
    }
}
