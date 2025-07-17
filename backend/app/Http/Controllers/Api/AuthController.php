<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    // Login
    public function login(Request $request): JsonResponse {
        // Validasi Input
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // Otentikasi User
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            // Token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
                'access_token' => $token,
            ]);
        }

        // Jika Otentikasi Gagal
        return response()->json(['message' => 'Invalid Credentails'], 401);
    }

    // Logout
    public function logout(Request $request): JsonResponse {
        // Hapus Token
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout successful']);
    }
}
