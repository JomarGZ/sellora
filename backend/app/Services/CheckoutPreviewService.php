<?php

namespace App\Services;

use App\DTOs\CartSnapshotItemDTO;
use App\DTOs\CheckoutPreviewDTO;
use App\Exceptions\CartEmptyException;
use App\Exceptions\CartOwnershipException;
use App\Repositories\Contracts\ICartRepository;

class CheckoutPreviewService
{
     // Shipping fee logic lives here for now.
    // In production this could delegate to a ShippingCalculatorService
    // that calls a shipping API. Keeping it simple per the constraints.
    private const FREE_SHIPPING_THRESHOLD = '100.00';
    private const FLAT_SHIPPING_FEE       = '9.99';
 
    public function __construct(
        private readonly ICartRepository $cartRepository,
    ) {}
 
    public function preview(int $userId): CheckoutPreviewDTO
    {
        // 1. Assert user has an active cart.
        $cart = $this->cartRepository->findActiveCartWithItems($userId);
 
        if (!$cart) {
            throw new CartOwnershipException($userId);
        }
 
        // 2. Assert cart is not empty.
        if ($cart->items->isEmpty()) {
            throw new CartEmptyException();
        }
 
        // 3. Build preview line items and validate stock.
        //    We do NOT lock anything here. This is a read-only check.
        //    The user sees a warning if something is low, but no write occurs.
        $previewItems    = [];
        $allItemsInStock = true;
 
        foreach ($cart->items as $item) {
            // Deactivated product — treat as out of stock.
            if (!$item->productItem) {
                $allItemsInStock = false;
                continue;
            }
 
            if ($item->productItem->availableQty() < $item->quantity) {
                $allItemsInStock = false;
            }
 
            $previewItems[] = CartSnapshotItemDTO::fromCartItem($item);
        }
 
        // 4. Calculate totals using bcmath to avoid float precision errors.
        $subtotal = array_reduce(
            $previewItems,
            fn (string $carry, CartSnapshotItemDTO $item) => bcadd($carry, $item->lineTotal, 2),
            '0.00'
        );
 
        $shippingFee = $this->calculateShippingFee($subtotal);
        $total       = bcadd($subtotal, $shippingFee, 2);
 
        return new CheckoutPreviewDTO(
            cartId:          $cart->id,
            items:           $previewItems,
            subtotal:        $subtotal,
            shippingFee:     $shippingFee,
            total:           $total,
            currency:        'usd',
            allItemsInStock: $allItemsInStock,
        );
    }
 
    private function calculateShippingFee(string $subtotal): string
    {
        // Free shipping over threshold; otherwise flat rate.
        if (bccomp($subtotal, self::FREE_SHIPPING_THRESHOLD, 2) >= 0) {
            return '0.00';
        }
 
        return self::FLAT_SHIPPING_FEE;
    }
}
