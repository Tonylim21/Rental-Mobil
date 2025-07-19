<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\Car;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;;

class TransactionController extends Controller
{
    // ADMIN: Lihat semua transaksi
    public function index() {
        $user = Auth::user();
        $query = Transaction::with(['car', 'user'])->latest();

        // Jika user adalah admin, tampilkan semua transaksi
        if ($user->role === 'admin') {
            $transactions = $query->get();
        } else { // Jika customer, tampilkan hanya transaksinya sendiri
            $transactions = $query->where('user_id', $user->id)->get();
        }

        return response()->json($transactions);
    }

    // USER: Buat transaksi rental mobil
    public function store(Request $request) {
        $request->validate([
            'car_id' => 'required|exists:cars,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $car = Car::findOrFail($request->car_id);

        // Cek Ketersedian Mobil
        if ($car->status !== 'available') {
            return response()->json(['message' => 'Car Is Unavailable For Rent!'], 409);
        }

        // Hitung Total Harga
        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);
        $days = $endDate->diffInDays($startDate) + 1; 
        $totalPrice = $days * $car->price_per_day;

        $transaction = null;
        DB::transaction(function() use($request, $car, $startDate, $endDate, $totalPrice, &$transaction) {
            // 1. Record Transaksi
            $transaction = Transaction::create([
                'user_id' => Auth::id(),
                'car_id' => $car->id,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'total_price' => $totalPrice,
                'status' => 'ongoing',
            ]);

            // 2. Ubah Status Mobil
            $car->update(['status' => 'unavailable']);
        });

        return response()->json([
            'message' => 'Transaksi Created Successfully',
            'transaction' => $transaction
        ], 201);
    }

    // Detail Transaksi
    public function show(Transaction $transaction) {
        $user = Auth::user();

        // 1. Jika user adalah admin, langsung izinkan.
        // 2. Jika user adalah customer, cek apakah dia pemilik transaksi ini.
        // 3. Jika bukan keduanya, tolak akses.
        if ($user->role === 'admin' || $transaction->user_id === $user->id) {
            // Jika user adalah admin ATAU pemilik transaksi,
            // load relasi dan kirim data.
            $transaction->load(['car', 'user']);
            return response()->json($transaction);
        }
        
        // Load relasi car dan user jika belum ter-load
        return response()->json(['message' => 'Unauthorized to view this transaction'], 403);
    }

    // ADMIN: Hapus transaksi
    public function destroy($id) {
        // Otorisasi Role User
        if (Auth::user()->role !== 'admin') {
            return response()->json(['Unauthorized'], 403);
        }

        $transaction = Transaction::findOrFail($id);
        $transaction->delete();
        return response()->json(['message' => 'Transaksi Deleted Successfully'], 200);
    }
}