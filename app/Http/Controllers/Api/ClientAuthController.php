<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Otp\OtpService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class ClientAuthController extends Controller
{
    public function __construct(
        private readonly OtpService $otpService
    ) {
    }

    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'preferred_locale' => ['required', 'in:en,ar'],
            'prefers_dark_mode' => ['nullable', 'boolean'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'preferred_locale' => $validated['preferred_locale'],
            'prefers_dark_mode' => (bool) ($validated['prefers_dark_mode'] ?? false),
            'email_verified_at' => null, // Will be set after OTP verification
        ]);

        // Generate and send OTP
        $this->otpService->generate($user, 'registration');

        // Create token for API authentication
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => __('auth.otp_sent'),
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'preferred_locale' => $user->preferred_locale,
                'prefers_dark_mode' => $user->prefers_dark_mode,
            ],
            'token' => $token,
            'requires_otp' => true,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'remember' => ['nullable', 'boolean'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => [__('auth.failed')],
            ]);
        }

        // If user is already verified, log them in directly
        if ($user->email_verified_at !== null) {
            $token = $user->createToken('auth-token')->plainTextToken;
            $user->forceFill(['last_login_at' => now()])->save();

            return response()->json([
                'message' => __('auth.login_success'),
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at,
                    'preferred_locale' => $user->preferred_locale,
                    'prefers_dark_mode' => $user->prefers_dark_mode,
                ],
                'token' => $token,
                'requires_otp' => false,
            ]);
        }

        // Send OTP for unverified users
        $this->otpService->generate($user, 'login');

        // Create token for API authentication (will be used after OTP verification)
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => __('auth.otp_sent'),
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'preferred_locale' => $user->preferred_locale,
                'prefers_dark_mode' => $user->prefers_dark_mode,
            ],
            'token' => $token,
            'requires_otp' => true,
        ]);
    }

    public function verifyOTP(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'digits:6'],
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'context' => ['required', 'in:registration,login'],
        ]);

        $user = User::findOrFail($validated['user_id']);
        $purpose = $validated['context'] === 'registration' ? 'registration' : 'login';

        if (!$this->otpService->verify($user, $validated['code'], $purpose)) {
            return response()->json([
                'message' => __('auth.invalid_otp'),
            ], 422);
        }

        // Mark email as verified after successful OTP
        if ($validated['context'] === 'registration') {
            $user->forceFill([
                'email_verified_at' => now(),
                'otp_verified_at' => now(),
            ])->save();
        } else {
            // For login, also mark as verified if not already
            if ($user->email_verified_at === null) {
                $user->forceFill(['email_verified_at' => now()])->save();
            }
        }

        $user->forceFill(['last_login_at' => now()])->save();

        // Create or refresh token
        $user->tokens()->delete(); // Remove old tokens
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => __('auth.welcome_back'),
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'preferred_locale' => $user->preferred_locale,
                'prefers_dark_mode' => $user->prefers_dark_mode,
            ],
            'token' => $token,
        ]);
    }

    public function resendOTP(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'context' => ['required', 'in:registration,login'],
        ]);

        $user = User::findOrFail($validated['user_id']);
        $purpose = $validated['context'] === 'registration' ? 'registration' : 'login';

        $this->otpService->generate($user, $purpose);

        return response()->json([
            'message' => __('auth.otp_sent'),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        // Revoke the token that was used to authenticate the current request
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => __('auth.logout_success'),
        ]);
    }
}
