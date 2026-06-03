<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Exceptions\CartExpiredException;
use App\Exceptions\CartItemNotFoundException;
use App\Exceptions\CartNotFoundException;
use App\Exceptions\CartNotModifiableException;
use App\Exceptions\InsufficientStockException;
use App\Exceptions\ProductItemNotAvailableException;
use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\Api\V1\AddCartItemRequest;
use App\Http\Requests\Api\V1\UpdateCartItemRequest;
use App\Http\Resources\V1\CartResource;
use App\Repositories\ShoppingCartItemRepository;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class CartController extends ApiController
{
    public function __construct(
        private CartService $cartService,
    ) {}

    public function show(Request $request): JsonResponse
    {
        $cart = $this->cartService->getOrCreateCart($request->user()->id);
 
        return response()->json([
            'success' => true,
            'data'    => new CartResource($cart),
        ]);
    }

     public function addItem(AddCartItemRequest $request): JsonResponse
    {
        try {
            $cart = $this->cartService->addItem(
                userId:    $request->user()->id,
                productItemId: $request->validated('product_item_id'),
                quantity:  $request->validated('quantity'),
            );
 
            return response()->json([
                'success' => true,
                'message' => 'Item added to cart.',
                'data'    => new CartResource($cart),
            ], 201);
 
        } catch (CartExpiredException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'code'    => 'CART_EXPIRED',
            ], 410); // 410 Gone — the resource existed but is no longer available
 
        } catch (ProductItemNotAvailableException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'code'    => 'PRODUCT_UNAVAILABLE',
            ], 422);
 
        } catch (InsufficientStockException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient stock for the requested quantity.',
                'code'    => 'INSUFFICIENT_STOCK',
                'details' => [
                    'product_item_id'   => $e->productItemId,
                    'product_name' => $e->productName,
                    'requested'    => $e->requested,
                    'available'    => $e->available,
                ],
            ], 409);
 
        } catch (CartNotModifiableException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'code'    => 'CART_NOT_MODIFIABLE',
            ], 409);
        }
    }

     public function updateItem(
        UpdateCartItemRequest $request,
        int                $cartId,
        int                $itemId
    ): JsonResponse {
        try {
            $cart = $this->cartService->updateItem(
                userId:   $request->user()->id,
                cartId:   $cartId,
                itemId:   $itemId,
                quantity: $request->validated('quantity'),
            );
 
            return response()->json([
                'success' => true,
                'message' => 'Cart item updated.',
                'data'    => new CartResource($cart),
            ]);
 
        } catch (CartNotFoundException | CartItemNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 404);
 
        } catch (CartExpiredException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'code'    => 'CART_EXPIRED',
            ], 410);
 
        } catch (InsufficientStockException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient stock for the requested quantity.',
                'code'    => 'INSUFFICIENT_STOCK',
                'details' => [
                    'product_item_id'   => $e->productItemId,
                    'product_name' => $e->productName,
                    'requested'    => $e->requested,
                    'available'    => $e->available,
                ],
            ], 409);
 
        } catch (CartNotModifiableException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'code'    => 'CART_NOT_MODIFIABLE',
            ], 409);
 
        } catch (ProductItemNotAvailableException $e) {
            // Product deactivated after being added to the cart.
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'code'    => 'PRODUCT_UNAVAILABLE',
            ], 422);
        }
    }
}
