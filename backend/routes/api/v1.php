<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ProductCatalogController;
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
    Route::get('product-catalog/new-arrivals', [ProductCatalogController::class, 'newArrivals'])->name('api.v1.product-catalog.new-arrivals');
    Route::get('product-catalog/best-sellers', [ProductCatalogController::class, 'bestSellers'])->name('api.v1.product-catalog.best-sellers');
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
});

// Password reset routes (public with rate limiting)
Route::middleware('throttle:6,1')->group(function (): void {
    Route::post('forgot-password', [AuthController::class, 'forgotPassword'])
        ->name('password.email');
    Route::post('reset-password', [AuthController::class, 'resetPassword'])
        ->name('password.reset');
});
