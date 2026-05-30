<?php

namespace App\Services;

use App\DTOs\CreateOrderDTO;
use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\ShippingMethod;
use App\Models\ShoppingCartItem;
use App\Models\User;
use App\Repositories\OrderRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderPreviewService
{
 
    public function __construct(protected OrderRepository $orderRepository){}

       public function preview(User $user, array $selectedCartItemIds): Order
    {
        return DB::transaction(function () use (
            $user,
            $selectedCartItemIds
        ) {

            /*
            |--------------------------------------------------------------------------
            | LOAD CART ITEMS
            |--------------------------------------------------------------------------
            */

            $cartItems = ShoppingCartItem::query()
                ->whereIn('id', $selectedCartItemIds)
                ->whereHas('cart', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->with([
                    'productItem.product',
                    'cart',
                ])
                ->get();

            /*
            |--------------------------------------------------------------------------
            | VALIDATE OWNERSHIP
            |--------------------------------------------------------------------------
            */

            if ($cartItems->count() !== count($selectedCartItemIds)) {

                throw ValidationException::withMessages([
                    'ids' => 'Some cart items are invalid.',
                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | VALIDATE EMPTY
            |--------------------------------------------------------------------------
            */

            if ($cartItems->isEmpty()) {

                throw ValidationException::withMessages([
                    'ids' => 'No cart items selected.',
                ]);
            }

                    /*
            |--------------------------------------------------------------------------
            | SHIPPING
            |--------------------------------------------------------------------------
            */

            $shippingMethod = ShippingMethod::first();
            
            if (! $shippingMethod) {

                throw ValidationException::withMessages([
                    'shipping_method' => 'No shipping method available.',
                ]);
            }

            $shippingFee = $shippingMethod->price;

            /*
            |--------------------------------------------------------------------------
            | CALCULATE TOTALS
            |--------------------------------------------------------------------------
            */

            $subtotal = 0;

            foreach ($cartItems as $cartItem) {

                $productItem = $cartItem->productItem;

                /*
                |--------------------------------------------------------------------------
                | STOCK VALIDATION
                |--------------------------------------------------------------------------
                */

                if ($cartItem->quantity > $productItem->qty_in_stock) {

                    throw ValidationException::withMessages([
                        'stock' => "{$productItem->product->name} has insufficient stock.",
                    ]);
                }

                $subtotal += (
                    $productItem->price
                    * $cartItem->quantity
                );
            }

    

            /*
            |--------------------------------------------------------------------------
            | TOTAL
            |--------------------------------------------------------------------------
            */

            $orderTotal = $subtotal + $shippingFee;

            /*
            |--------------------------------------------------------------------------
            | FIND REUSABLE PENDING ORDER
            |--------------------------------------------------------------------------
            */

            $order = Order::query()
                ->where('user_id', $user->id)
                ->where('status', OrderStatus::Pending)
                ->latest()
                ->first();

            /*
            |--------------------------------------------------------------------------
            | CREATE IF NOT EXISTS
            |--------------------------------------------------------------------------
            */

            if (!$order) {

                $dto = new CreateOrderDTO(
                    userId: $user->id,
                    shippingMethodId: $shippingMethod->id,
                    shoppingCartId: $cartItems->first()->shopping_cart_id,
                    subtotal: $subtotal,
                    shippingFee: $shippingFee,
                    orderTotal: $orderTotal,
                    currency: 'USD',
                    idempotencyKey: Str::uuid()->toString(),
                    status: OrderStatus::Pending,
                    checkoutType: 'cart',
                );

                $order = $this->orderRepository
                    ->create($dto->toArray());
            }

            /*
            |--------------------------------------------------------------------------
            | UPDATE EXISTING PENDING ORDER
            |--------------------------------------------------------------------------
            */

            else {

                $order->update([
                    'shipping_method_id' => $shippingMethod->id,
                    'subtotal' => $subtotal,
                    'shipping_fee' => $shippingFee,
                    'order_total' => $orderTotal,
                ]);

                $order->items()->delete();
            }

            /*
            |--------------------------------------------------------------------------
            | CREATE ORDER ITEM SNAPSHOTS
            |--------------------------------------------------------------------------
            */

            foreach ($cartItems as $cartItem) {

                $productItem = $cartItem->productItem;

                $order->items()->create([
                    'product_item_id' => $productItem->id,
                    'price' => $productItem->price,
                    'product_name' => $productItem->product->name,
                    'quantity' => $cartItem->quantity,
                    'sku' => $productItem->sku
                ]);
            }

            return $order->fresh('items');
        });
    }
}
