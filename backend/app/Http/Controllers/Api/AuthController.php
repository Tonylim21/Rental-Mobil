<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;


class AuthController extends Controller
{
    // Create Account
    public function register(Request $request) {
        // Validasi Input
        $validated = $request->validate([
            'username' => 'required|string|max:255|unique:users,username',
            'password' => 'required|string|min:6',
            'phone' => 'required|string|max:20',
            'address' => 'nullable|string|max:255',
        ]);

        $admin = User::create([
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'role' => 'admin',
        ]);

        return response()->json([
            'message' => 'Admin Created Successfully',
            'admin' => $admin
        ], 201);
    }

    // Login
    public function login(Request $request) {
        // Validasi Input
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // Cek Credential
        if (!Auth::attempt($request->only('username', 'password'))) {
            // Jika Gagal
            return response()->json(['message' => 'Invalid Login Details'], 401);
        }

        // Ambil User yang Login
        $user = User::where('username', $request['username'])->firstOrFail();

        // Token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Response
        return response()->json([
            'message' => ' Login Successful',
            'user' => $user,
            'access_token' => $token,
        ]);
    }

    // Logout
    public function logout(Request $request) {
        // Hapus Token
        $request->user()->currentAccessToken()->delete();

        // Response
        return response()->json(['message' => 'Logout Successful']);
    }
}