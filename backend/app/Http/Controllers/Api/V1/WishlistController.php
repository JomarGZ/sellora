<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\Request;

class WishlistController extends ApiController
{
    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
        ]);

        $user->wishlistItems()->syncWithoutDetaching($validated['product_id']);

        return $this->success(
            message: "Product added to wishlist successfully."
        );
    }

    public function destroy(Request $request, int $productId)
    {
        $user = $request->user();

        $user->wishlistItems()->detach($productId);

        return $this->success(
            message: "Product removed from wishlist successfully."
        );

    }
}
