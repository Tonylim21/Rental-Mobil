<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
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
    public function update(Request $request, User $user) {
        // Cek User = Customer
        if ($user->role !== 'customer') {
            return response()->json(['message' => 'User is not a customer'], 403);
        }

        // Validasi Input
        $validator =  Validator::make($request->all(), [
            'username' => 'sometimes|required|string|unique:users,username,' . $user->id,
            'password' => 'sometimes|nullable|string|min:6',
            'phone' => 'sometimes|required|string',
            'address' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user->username = $request->username ?? $user->username;
        $user->phone = $request->phone ?? $user->phone;
        $user->address = $request->address ?? $user->address;
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'message' => 'Customer Updated Successfully',
            'user' => $user
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
