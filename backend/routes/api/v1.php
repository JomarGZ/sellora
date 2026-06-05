<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CheckoutController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\ProductFilterController;
use App\Http\Controllers\Api\V1\ProductItemReviewController;
use App\Http\Controllers\Api\V1\ProductReviewController;
use App\Http\Controllers\Api\V1\ShippingOptionController;
use App\Http\Controllers\Api\V1\CartController;
use App\Http\Controllers\Api\V1\SocialAuthController;
use App\Http\Controllers\Api\V1\UserAddressController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API V1 Routes
|--------------------------------------------------------------------------
*/

Route::name('api.v1.')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Auth (Public - strict throttle)
    |--------------------------------------------------------------------------
    */
    Route::middleware('throttle:auth')->group(function () {
        Route::post('register', [AuthController::class, 'register'])->name('register');
        Route::post('login', [AuthController::class, 'login'])->name('login');
        Route::get('auth/google/callback', [SocialAuthController::class, 'callback'])->name('auth.google.callback');
        Route::get('auth/google/redirect', [SocialAuthController::class, 'redirect'])->name('auth.google.redirect');
    });

    Route::post('webhooks/stripe', [WebhookController::class, 'handle'])->name('webhooks.stripe')->withoutMiddleware(['auth:sanctum', 'throttle']);

    /*
    |--------------------------------------------------------------------------
    | Public Resources
    |--------------------------------------------------------------------------
    */
    Route::middleware('throttle:60,1')->group(function () {

        // Products
        Route::prefix('products')->name('products.')->group(function () {
            Route::get('/', [ProductController::class, 'index'])->name('index');
            Route::get('/filters', [ProductFilterController::class, 'getFilterOptions'])->name('filters');
            Route::get('/new-arrivals', [ProductController::class, 'newArrivals'])->name('new-arrivals');
            Route::get('/best-sellers', [ProductController::class, 'bestSellers'])->name('best-sellers');
            Route::get('/{product:slug}', [ProductController::class, 'show'])->name('show');

            // Reviews (read)
            Route::get('/{slug}/reviews', [ProductReviewController::class, 'index'])
                ->name('reviews.index');
        });
    });

    /*
    |--------------------------------------------------------------------------
    | Protected (Authenticated Users)
    |--------------------------------------------------------------------------
    */
    Route::middleware(['auth:sanctum', 'throttle:authenticated', 'customer'])->group(function () {
        Route::put('me/change-password', [AuthController::class, 'changePassword'])->name('me.password.change');
        Route::get('me', [UserController::class, 'me'])->name('me.show');
        Route::post('me/avatar', [UserController::class, 'updateAvatar'])->name('me.avatar.update');
        Route::put('me/profile', [UserController::class, 'update'])->name('me.update');
    
        
        /*
        |--------------------------------------------------------------------------
        | Auth Actions
        |--------------------------------------------------------------------------
        */
        Route::post('refresh-token', [AuthController::class, 'refresh'])->name('refresh.token');
        Route::post('logout', [AuthController::class, 'logout'])->name('logout');

        /*
        |--------------------------------------------------------------------------
        | Email Verification
        |--------------------------------------------------------------------------
        */
        Route::post('email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
            ->middleware('signed')
            ->name('verification.verify');

        Route::post('email/resend', [AuthController::class, 'resendVerificationEmail'])
            ->middleware('throttle:6,1')
            ->name('verification.send');

        /*
        |--------------------------------------------------------------------------
        | User Address
    |--------------------------------------------------------------------------
        */
        Route::prefix('user/address')->name('user.address.')->group(function () {
            Route::get('/', [UserAddressController::class, 'index'])->name('index');
            Route::post('/', [UserAddressController::class, 'store'])->name('store');
            Route::get('/default', [UserAddressController::class, 'default'])->name('default');
            Route::put('/{userAddress}', [UserAddressController::class, 'update'])->name('update');
            Route::get('/{userAddress}', [UserAddressController::class, 'show'])->name('show');
            Route::delete('/{userAddress}', [UserAddressController::class, 'destroy'])->name('destroy');
            Route::put('/{userAddress}/default', [UserAddressController::class, 'setDefault'])->name('set.default');
        });


        /*
        |--------------------------------------------------------------------------
        | Shopping Cart
        |--------------------------------------------------------------------------
        */
        Route::prefix('cart')->name('cart.')->group(function () {
            // GET /api/cart
            // Returns the user's active cart. Creates a new empty one if
            // none exists. Always 200 — "no cart" is an empty cart.
            Route::get('/', [CartController::class, 'show']);
        
            // POST /api/cart/items
            // Add a product. Merges quantity if product already in cart.
            Route::post('/items', [CartController::class, 'addItem']);
        
            // PATCH /api/cart/{cart}/items/{item}
            // Update quantity. Send quantity=0 to remove the item.
            Route::patch('/{cart}/items/{item}', [CartController::class, 'updateItem']);
        
            // DELETE /api/cart/{cart}/items/{item}
            // Remove a specific item.
            Route::delete('/{cart}/items/{item}', [CartController::class, 'removeItem']);
        
            // DELETE /api/cart/{cart}
            // Clear all items. Cart record is kept with same ID.
            Route::delete('/{cart}', [CartController::class, 'clear']);
        });


        Route::prefix('shipping-option')->name('shipping.')->group(function () {
            Route::get('/default', [ShippingOptionController::class, 'default'])->name('default');
        });

        /*
        |--------------------------------------------------------------------------
        | order
        |--------------------------------------------------------------------------
        */

        Route::prefix('orders')->name('order.')->group(function () {
            Route::get('/', [OrderController::class, 'index'])->name('index');
            Route::get('/{order}', [OrderController::class, 'show'])->name('show');
            Route::patch('/{order}/status', [OrderController::class, 'updateStatus'])->name('updateStatus');
        });


        /*
        |--------------------------------------------------------------------------
        | Checkout
        |--------------------------------------------------------------------------
        */
        Route::prefix('checkout')->name('checkout.')->group(function () {
            Route::get('/preview',  [CheckoutController::class, 'preview'])->name('preview');
            Route::post('/initiate', [CheckoutController::class, 'initiate'])->name('initiate');
        });

        /*
        |--------------------------------------------------------------------------
        | Reviews (Write)
        |--------------------------------------------------------------------------
        */
        Route::prefix('reviews')->name('reviews.')->group(function () {
            Route::post('/', [ProductItemReviewController::class, 'store'])->name('store');
        });
    });

    /*
    |--------------------------------------------------------------------------
    | External / Webhooks / Public Callbacks
    |--------------------------------------------------------------------------
    */
    Route::prefix('checkout')->name('checkout.')->group(function () {
        Route::get('/verify', [CheckoutController::class, 'verifySession'])->name('verify');
        Route::get('/cancel', [CheckoutController::class, 'cancel'])->name('cancel');
    });

    /*
    |--------------------------------------------------------------------------
    | Password Reset
    |--------------------------------------------------------------------------
    */
    Route::middleware('throttle:6,1')->group(function () {
        Route::post('forgot-password', [AuthController::class, 'forgotPassword'])
            ->name('password.email');

        Route::post('reset-password', [AuthController::class, 'resetPassword'])
            ->name('password.reset');
    });

});
