<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
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
            data: new ShoppingCartResource($record),
            message: 'Add to cart successfully.'
        );
    }

    public function update(Request $request, ShoppingCartItem $item)
    {
        $request->validate([
            'quantity' => ['required', 'integer', 'min:0'],
        ]);

        Gate::authorize('update', $item);

        $record = $this->cartService->updateItemQuantity(
            $request->user()->id,
            $item->id,
            $request->quantity
        );

        return $this->success(
            data: new ShoppingCartResource($record),
            message: 'Cart updated successfully.'
        );
    }

    public function destroy(Request $request, ShoppingCartItem $item)
    {
        Gate::authorize('delete', $item);

        $this->cartService->removeItem(
            $request->user()->id,
            $item->id
        );

        return $this->success(data: null, message: 'Cart item deleted successfully.');
    }

    public function clear(Request $request)
    {
        $cart = $this->cartService->getCart($request->user()->id);

        Gate::authorize('clear', $cart);

        $this->cartService->clearCart($request->user()->id);

        return $this->success(
            data: null,
            message: 'Cart items deleted successfully.'
        );
    }
}
