<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\CheckoutType;
use App\Models\Order;
use App\Repositories\ShoppingCartRepository;
use Illuminate\Support\Facades\DB;

final class ShoppingCartService
{
    public function __construct(
        private ShoppingCartRepository $cartRepository
    ) {}

    public function getCart(int $userId)
    {
        return $this->cartRepository->getOrCreateByUserId($userId);
    }

    public function addItem(int $userId, int $productItemId, int $qty)
    {
        return DB::transaction(function () use ($userId, $productItemId, $qty) {

            $cart = $this->cartRepository->getOrCreateByUserId($userId);

            $item = $this->cartRepository->findItemByProduct(
                $cart->id,
                $productItemId
            );

            if ($item) {
                $item = $this->cartRepository->updateItem($item->id, [
                    'quantity' => $item->quantity + $qty,
                ]);
            } else {
                $item = $this->cartRepository->createItem($cart->id, [
                    'product_item_id' => $productItemId,
                    'quantity' => $qty,
                ]);
            }

            return $item->fresh()->load('productItem.product');

        });
    }

    public function updateItemQuantity(int $userId, int $cartItemId, int $qty)
    {

        $item = $this->cartRepository->findItemById(
            $this->cartRepository->getOrCreateByUserId($userId)->id,
            $cartItemId
        );

        if (! $item) {
            return null;
        }

        if ($qty <= 0) {
            $this->cartRepository->deleteItem($item->id);

            return null;
        }

        return $this->cartRepository->updateItem($item->id, [
            'quantity' => $qty,
        ]);
    }

    public function removeItem(int $userId, int $cartItemId)
    {
        $cart = $this->cartRepository->getOrCreateByUserId($userId);

        $item = $this->cartRepository->findItemById(
            $cart->id,
            $cartItemId
        );

        if (! $item) {
            return false;
        }

        return $this->cartRepository->deleteItem($item->id);
    }

    public function clearPurchasedItems(Order $order): void
    {
        if ($order->checkout_type !== CheckoutType::Cart || ! $order->shopping_cart_id) {
            return;
        }

        $ids = $order->items->pluck('product_item_id')->toArray();

        $this->cartRepository->clearPurchasedItems($order->shopping_cart_id, $ids);
    }
}
