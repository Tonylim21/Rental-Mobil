<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CarController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\TransactionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Endpoint Buat Akun (Dev)
Route::post('/register', [AuthController::class, 'register']);

// Endpoint Otentikasi
Route::post('/login', [AuthController::class, 'login']);

// Semua User
Route::middleware('auth:sanctum')->group(function () {
    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Endpoint Lihat Mobil
    Route::get('/cars', [CarController::class, 'index']);
    Route::get('/car/{car}', [CarController::class, 'index']);

    Route::middleware('role:admin')->group(function () {
        // Endpoint Tambah Mobil (Admin)
        Route::post('/cars', [CarController::class, 'store']);
        Route::put('/cars/{car}', [CarController::class, 'update']);
        Route::delete('/cars/{car}', [CarController::class, 'destroy']);

        // Endpoint Lihat dan Hapus Transaksi
        Route::get('/transactions', [TransactionController::class, 'index']);
        Route::delete('/transaction/{id}', [TransactionController::class, 'destroy']);

        // Endpoint CRUD User
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/user/{user}', [UserController::class, 'show']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/user/{user}', [UserController::class, 'update']);
        Route::delete('/user/{user}', [UserController::class, 'destroy']);
    });

    // Endpoint User Transaksi
    Route::middleware('role:customer')->group(function () {
        Route::post('/transactions', [TransactionController::class, 'store']);
    });

    // Endpoint History Transaksi
    Route::get('/transaction/history', [TransactionController::class, 'show']);
});