<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    // Menampilkan Semua User 
    public function index() {
        $customers = User::where('role', 'customer')->latest()->get();

        if ($customers->isEmpty()) {
            return response()->json([
                'message' => 'No Customers Right Now',
                'data' => [],
            ]);
        }
        
        return response()->json([
            'message' => 'Here Is Our Customers',
            'data' => $customers,
        ]);
    }

    // Admin Menyimpan Customer Baru
    public function store(Request $request) {
        // Validasi Input
        $validator = Validator::make($request->all(),[
            'username' => 'required|string|unique:users,username',
            'password' => 'required|string|min:6',
            'phone' => 'required|string',
            'address' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'address' => $request->address,
            'role' => 'customer'
        ]);

        return response()->json([
            'message' => 'Customer Created Successfully',
            'user' => $user
        ], 201);
    }

    // Detail Satu User (Customer)
    public function show(User $user) {
        // Cek User = Customer
        if ($user->role !== 'customer') {
            return response()->json(['message' => 'User Is Not a Customer!'], 403);
        }

        return response()->json($user);
    }

    // Update User (Customer)
    public function updateProfile(Request $request) {
        // Ambil ID user yang sedang login
        $userId = Auth::id();
        // Ambil instance model User yang lengkap dari database
        $user = User::findOrFail($userId);

        $validatedData = $request->validate([
            'username' => 'sometimes|required|string|max:255|unique:users,username,' . $user->id,
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'password' => 'nullable|string|min:6|confirmed',
        ]);

        $user->username = $validatedData['username'] ?? $user->username;
        $user->phone = $validatedData['phone'] ?? $user->phone;
        $user->address = $validatedData['address'] ?? $user->address;

        if (!empty($validatedData['password'])) {
            $user->password = Hash::make($validatedData['password']);
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }

    // Hapus User (Customer)
    public function destroy(User $user) {
        // Cek User = Customer
        if ($user->role !== 'customer') {
            return response()->json(['message' => 'User is not a customer'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'Customer Deteled Successfully']);
    }
}
