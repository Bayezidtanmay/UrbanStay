<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ApartmentController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ContactMessageController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/apartments', [ApartmentController::class, 'index']);
Route::get('/apartments/{id}', [ApartmentController::class, 'show']);
Route::get('/apartments/{id}/reviews', [ReviewController::class, 'index']);
Route::post('/apartments/{id}/contact', [ContactMessageController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/bookings', [BookingController::class, 'index']);
    Route::get('/bookings/{id}', [BookingController::class, 'show']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::patch('/bookings/{id}/cancel', [BookingController::class, 'cancel']);

    Route::post('/apartments/{id}/reviews', [ReviewController::class, 'store']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);

    Route::middleware('admin')->group(function () {
        Route::post('/apartments', [ApartmentController::class, 'store']);
        Route::put('/apartments/{id}', [ApartmentController::class, 'update']);
        Route::delete('/apartments/{id}', [ApartmentController::class, 'destroy']);

        Route::patch('/bookings/{id}/status', [BookingController::class, 'updateStatus']);

        Route::get('/contact-messages', [ContactMessageController::class, 'index']);
        Route::get('/contact-messages/{id}', [ContactMessageController::class, 'show']);
        Route::delete('/contact-messages/{id}', [ContactMessageController::class, 'destroy']);
    });
});
