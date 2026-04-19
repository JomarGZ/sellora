<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CheckoutController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\ProductFilterController;
use App\Http\Controllers\Api\V1\ProductItemReviewController;
use App\Http\Controllers\Api\V1\ProductReviewController;
use App\Http\Controllers\Api\V1\ShoppingCartController;
use App\Http\Controllers\Api\V1\StripeWebhookController;
use App\Http\Controllers\Api\V1\UserAddressController;
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
    });

    /*
    |--------------------------------------------------------------------------
    | Public Resources
    |--------------------------------------------------------------------------
    */
    Route::middleware('throttle:60,1')->group(function () {

        // Products
        Route::prefix('products')->name('products.')->group(function () {
            Route::get('/', [ProductController::class, 'index'])->name('index');
            Route::get('/filters', [ProductFilterController::class, 'index'])->name('filters');
            Route::get('/new-arrivals', [ProductController::class, 'newArrivals'])->name('new-arrivals');
            Route::get('/best-sellers', [ProductController::class, 'bestSellers'])->name('best-sellers');
            Route::get('/{slug}', [ProductController::class, 'show'])->name('show');

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
            Route::put('/{userAddress}', [UserAddressController::class, 'update'])->name('update');
            Route::delete('/{userAddress}', [UserAddressController::class, 'destroy'])->name('destroy');
            Route::put('/{userAddress}/default', [UserAddressController::class, 'setDefault'])->name('default');
        });

        /*
        |--------------------------------------------------------------------------
        | Shopping Cart
        |--------------------------------------------------------------------------
        */
        Route::prefix('shopping-cart')->name('cart.')->group(function () {
            Route::get('/', [ShoppingCartController::class, 'index'])->name('index');
            Route::post('/', [ShoppingCartController::class, 'store'])->name('store');
            Route::delete('/clear', [ShoppingCartController::class, 'clear'])->name('clear');
            Route::put('/{shoppingCartItem}', [ShoppingCartController::class, 'update'])->name('update');
            Route::delete('/{shoppingCartItem}', [ShoppingCartController::class, 'destroy'])->name('destroy');
        });

        /*
        |--------------------------------------------------------------------------
        | Checkout
        |--------------------------------------------------------------------------
        */
        Route::prefix('checkout')->name('checkout.')->group(function () {
            Route::post('/', [CheckoutController::class, 'checkout'])->name('store');
            Route::post('/preview', [CheckoutController::class, 'preview'])->name('preview');
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

    Route::post('webhooks/stripe', [StripeWebhookController::class, 'handle'])
        ->name('webhooks.stripe');

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
