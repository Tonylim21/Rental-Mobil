<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Car;
use App\Models\Transaction;

class DashboardController extends Controller
{
    public function summary() {
        // Menghitung total pendapatan dari semua transaksi
        $totalRevenue = Transaction::sum('total_price');

        // Menghitung jumlah mobil yang sedang disewa (status not_available)
        $rentedCars = Car::where('status', 'unavailable')->count();

        // Menghitung jumlah mobil yang tersedia
        $availableCars = Car::where('status', 'available')->count();

        // Mengembalikan data dalam format JSON
        return response()->json([
            'total_revenue' => (float) $totalRevenue,
            'rented_cars' => $rentedCars,
            'available_cars' => $availableCars,
        ]);
    }
}
