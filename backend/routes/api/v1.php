<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CheckoutController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\ProductFilterController;
use App\Http\Controllers\Api\V1\StripeWebhookController;
use App\Http\Controllers\Api\V1\UserAddressController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API V1 Routes
|--------------------------------------------------------------------------
|
| Routes for API version 1.
|
*/

// Public routes with auth rate limiter (5/min - brute force protection)
Route::middleware('throttle:auth')->group(function (): void {
    Route::post('register', [AuthController::class, 'register'])->name('api.v1.register');
    Route::post('login', [AuthController::class, 'login'])->name('api.v1.login');
});

// public routes (60 requests/min)
Route::middleware('throttle:60,1')->group(function (): void {
    Route::get('products/new-arrivals', [ProductController::class, 'newArrivals'])->name('api.v1.products.new-arrivals');
    Route::get('products/best-sellers', [ProductController::class, 'bestSellers'])->name('api.v1.products.best-sellers');
    Route::get('products', [ProductController::class, 'index'])->name('api.v1.products');
    Route::get('products/filters', [ProductFilterController::class, 'index'])->name('api.v1.products.filters');
    Route::get('products/{slug}', [ProductController::class, 'show'])->name('api.v1.products.show');
});

// Protected routes with authenticated rate limiter (120/min)
Route::middleware(['auth:sanctum', 'throttle:authenticated', 'customer'])->group(function (): void {
    Route::post('refresh-token', [AuthController::class, 'refresh'])->name('api.v1.refresh.token');
    Route::post('logout', [AuthController::class, 'logout'])->name('api.v1.logout');

    // Email verification
    Route::post('email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
        ->middleware('signed')
        ->name('verification.verify');
    Route::post('email/resend', [AuthController::class, 'resendVerificationEmail'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('user/address', [UserAddressController::class, 'index'])->name('api.v1.user.address.index');
    Route::post('user/address', [UserAddressController::class, 'store'])->name('api.v1.user.address.store');
    Route::put('user/address/{userAddress}', [UserAddressController::class, 'update'])->name('api.v1.user.address.update');
    Route::delete('user/address/{userAddress}', [UserAddressController::class, 'destroy'])->name('api.v1.user.address.destroy');
    Route::put('user/address/{userAddress}/default', [UserAddressController::class, 'setDefault'])->name('api.v1.user.address.default');

    Route::post('/checkout', [CheckoutController::class, 'checkout'])->name('api.v1.checkout');
    Route::get('/checkout/verifySession', [CheckoutController::class, 'verifySession'])->name('api.v1.checkout.verifySession');
    Route::get('/checkout/cancel', [CheckoutController::class, 'cancel'])->name('api.v1.checkout.cancel');
    Route::post('checkout/preview', [CheckoutController::class, 'preview'])->name('api.v1.checkout.preview');
});

Route::get('/checkout/verify', [CheckoutController::class, 'verifySession'])->name('api.v1.checkout.verify');
Route::get('/checkout/cancel', [CheckoutController::class, 'cancel'])->name('api.v1.checkout.cancel');
Route::post('webhooks/stripe', [StripeWebhookController::class, 'handle'])->name('api.v1.webhooks.stripe');
// Password reset routes (public with rate limiting)
Route::middleware('throttle:6,1')->group(function (): void {
    Route::post('forgot-password', [AuthController::class, 'forgotPassword'])
        ->name('password.email');
    Route::post('reset-password', [AuthController::class, 'resetPassword'])
        ->name('password.reset');
});
