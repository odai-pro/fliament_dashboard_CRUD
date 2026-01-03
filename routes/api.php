<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ClientAuthController;
use App\Http\Controllers\Api\VisitController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Apply throttling globally or per group
Route::prefix('client')->middleware(['throttle:60,1'])->group(function () {
    // Public routes
    Route::post('/register', [ClientAuthController::class, 'register']);
    Route::post('/login', [ClientAuthController::class, 'login']);
    Route::post('/otp/verify', [ClientAuthController::class, 'verifyOTP']);
    Route::post('/otp/resend', [ClientAuthController::class, 'resendOTP']);

    // Visit logging (public, but can include user if authenticated)
    Route::post('/visits/log', [VisitController::class, 'log']);
    Route::get('/visits/stats', [VisitController::class, 'stats']);

    // Products and Categories (public)
    // Higher limit for read operations
    Route::middleware('throttle:120,1')->group(function () {
        Route::get('/categories', [\App\Http\Controllers\Api\CategoryController::class, 'index']);
        Route::get('/categories/{id}', [\App\Http\Controllers\Api\CategoryController::class, 'show']);
        Route::get('/products', [\App\Http\Controllers\Api\ProductController::class, 'index']);
        Route::get('/products/{id}', [\App\Http\Controllers\Api\ProductController::class, 'show']);
    });

    // Cart Routes (Public + Protected mix handled by controller)
    Route::get('/cart', [\App\Http\Controllers\Api\CartController::class, 'index']);
    Route::post('/cart', [\App\Http\Controllers\Api\CartController::class, 'store']);
    Route::put('/cart/{itemId}', [\App\Http\Controllers\Api\CartController::class, 'update']);
    Route::delete('/cart/{itemId}', [\App\Http\Controllers\Api\CartController::class, 'destroy']);
    Route::delete('/cart', [\App\Http\Controllers\Api\CartController::class, 'clear']);
    Route::post('/cart/coupon', [\App\Http\Controllers\Api\CartController::class, 'applyCoupon']);
    Route::delete('/cart/coupon', [\App\Http\Controllers\Api\CartController::class, 'removeCoupon']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [ClientAuthController::class, 'logout']);
        Route::get('/user', function (Request $request) {
            return response()->json([
                'user' => $request->user(),
            ]);
        });

        // Orders routes
        Route::post('/orders', [\App\Http\Controllers\Api\OrderController::class, 'store']);
        Route::get('/orders', [\App\Http\Controllers\Api\OrderController::class, 'index']);
        Route::get('/orders/{id}', [\App\Http\Controllers\Api\OrderController::class, 'show']);
    });
});
