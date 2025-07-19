<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CarController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\DashboardController;

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
    Route::get('/cars/{car}', [CarController::class, 'show']);

    // Endpoitn Lihat Transaksi
    Route::get('/transactions', [TransactionController::class, 'index']);
    
    // Role Admin
    Route::middleware('role:admin')->group(function () {
        // Endpoint Tambah Mobil (Admin)
        Route::post('/cars', [CarController::class, 'store']);
        Route::post('/cars/{car}', [CarController::class, 'update']);
        Route::delete('/cars/{car}', [CarController::class, 'destroy']);
        
        // Endpoint Transaksi
        Route::put('/transactions/{transaction}/complete', [TransactionController::class, 'complete']);
        Route::delete('/transactions/{id}', [TransactionController::class, 'destroy']);
        
        // Endpoint CRUD User
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);

        // Endpoint Dashboard
        Route::get('/dashboard-summary', [DashboardController::class, 'summary']);
    });
    
    // Role Customer
    Route::middleware('role:customer')->group(function () {
        // Endpoint Detail User (Customer)
        Route::get('/users/{user}', [UserController::class, 'show']);
        // Endpoint Update User (Customer)
        Route::put('/profile', [UserController::class, 'updateProfile']);
        // Endpoint User Transaksi
        Route::post('/transactions', [TransactionController::class, 'store']);
    });
    
    // Endpoint History Transaksi
    Route::get('/transaction/{transaction}', [TransactionController::class, 'show']);
});