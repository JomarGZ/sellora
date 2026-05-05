<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Http\Resources\V1\ShoppingCartItemResource;
use App\Http\Resources\V1\ShoppingCartResource;
use App\Models\ShoppingCartItem;
use App\Services\ShoppingCartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

final class ShoppingCartController extends ApiController
{
    public function __construct(
        private ShoppingCartService $cartService
    ) {}

    public function index(Request $request)
    {
        $cart = $this->cartService->getCart($request->user()->id);
        Gate::authorize('view', $cart);

        return $this->success(
            data: ShoppingCartResource::make($cart),
            message: 'Retrieved cart successfully.'
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_item_id' => ['required', 'integer', 'exists:product_items,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $record = $this->cartService->addItem(
            $request->user()->id,
            $request->product_item_id,
            $request->quantity
        );

        return $this->created(
            data: new ShoppingCartItemResource($record),
            message: 'Add to cart successfully.'
        );
    }

    public function update(Request $request, ShoppingCartItem $shoppingCartItem)
    {
        $request->validate([
            'quantity' => ['required', 'integer', 'min:0'],
        ]);
        $shoppingCartItem->load('cart');
        Gate::authorize('update', $shoppingCartItem);

        $record = $this->cartService->updateItemQuantity(
            $request->user()->id,
            $shoppingCartItem->id,
            $request->quantity
        );

        return $this->success(
            data: new ShoppingCartResource($record),
            message: 'Cart updated successfully.'
        );
    }

    public function buyNow(Request $request)
    {
        $request->validate([
            'product_item_id' => ['required', 'integer', 'exists:product_items,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $record = $this->cartService->buyNow(
            $request->user()->id,
            $request->product_item_id,
            $request->quantity
        );

        return $this->created(
            data: new ShoppingCartResource($record),
            message: 'Add to cart successfully.'
        );
    }

    public function destroy(Request $request, ShoppingCartItem $shoppingCartItem)
    {
        Gate::authorize('delete', $shoppingCartItem);

        $this->cartService->removeItem(
            $request->user()->id,
            $shoppingCartItem->id
        );

        return $this->success(data: null, message: 'Cart item deleted successfully.');
    }
}
