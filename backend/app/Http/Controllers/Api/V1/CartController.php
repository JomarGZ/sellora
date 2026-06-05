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
 
        return $this->success(
            data: new CartResource($cart),
            message: 'Cart retrieved successfully.'
        );
    }

     public function addItem(AddCartItemRequest $request): JsonResponse
    {
        try {
            $cart = $this->cartService->addItem(
                userId:    $request->user()->id,
                productItemId: $request->validated('product_item_id'),
                quantity:  $request->validated('quantity'),
            );
 
            return $this->success(
                data: new CartResource($cart),
                message: 'Item added to cart.'
            );
 
        } catch (CartExpiredException $e) {
            return $this->error(
                message: $e->getMessage(),
                code: 410,
                errors: [
                    'code' => 'CART_EXPIRED',
                ]
            );
 
        } catch (ProductItemNotAvailableException $e) {
            return $this->error(
                message: $e->getMessage(),
                code: 422,
                errors: [
                    'code' => 'PRODUCT_UNAVAILABLE',
                ]
            );
 
        } catch (InsufficientStockException $e) {
            return $this->error(
                message: 'Insufficient stock for the requested quantity.',
                code: 409,
                errors: [
                    'detail' => [
                        'product_item_id'   => $e->productItemId,
                        'product_name' => $e->productName,
                        'requested'    => $e->requested,
                        'available'    => $e->available,
                    ]
                ]
            );
 
        } catch (CartNotModifiableException $e) {
            return $this->error(
                message: $e->getMessage(),
                code: 409,
                errors: [
                    'code' => 'CART_NOT_MODIFIABLE',
                ]
            );
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
 
            return $this->success(
                message: 'Cart item updated.',
                data: new CartResource($cart));
 
        } catch (CartNotFoundException | CartItemNotFoundException $e) {
            return $this->notFound(message: $e->getMessage());
 
        } catch (CartExpiredException $e) {
            return $this->error(
                message: $e->getMessage(),
                code: 410,
            );
 
        } catch (InsufficientStockException $e) {
            return $this->error(
                message: 'Insufficient stock for the requested quantity.',
                code: 409,
                errors: [
                    'detail' => [
                        'product_item_id'   => $e->productItemId,
                        'product_name' => $e->productName,
                        'requested'    => $e->requested,
                        'available'    => $e->available,
                    ]
                ]
            );
        } catch (CartNotModifiableException $e) {
            return $this->error(
                message: $e->getMessage(),
                code: 409,
                errors: [
                    'code' => 'CART_NOT_MODIFIABLE',
                ]
            );
 
        } catch (ProductItemNotAvailableException $e) {
            // Product deactivated after being added to the cart.
            return $this->error(
                message: $e->getMessage(),
                code: 422,
                errors: [
                    'code' => 'PRODUCT_UNAVAILABLE',
                ]
            );
        }
    }
}
