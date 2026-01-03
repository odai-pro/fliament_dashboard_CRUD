<?php

namespace App\Services\Otp;

use App\Mail\OtpCodeMail;
use App\Models\User;
use App\Models\UserOtp;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class OtpService
{
    public function __construct(
        private readonly int $ttlSeconds = 60
    ) {
    }

    public function generate(User $user, string $purpose = 'login'): UserOtp
    {
        UserOtp::where('user_id', $user->id)
            ->where('purpose', $purpose)
            ->where('status', UserOtp::STATUS_PENDING)
            ->update(['status' => UserOtp::STATUS_EXPIRED]);

        $code = $this->generateNumericCode();

        $otp = UserOtp::create([
            'user_id' => $user->id,
            'code' => $code,
            'purpose' => $purpose,
            'status' => UserOtp::STATUS_PENDING,
            'expires_at' => now()->addSeconds($this->ttlSeconds),
        ]);

        Mail::to($user->email)->send(
            new OtpCodeMail(
                code: $code,
                purpose: $purpose,
                recipientName: $user->name ?? $user->email,
                expiresInSeconds: $this->ttlSeconds,
            )
        );

        return $otp;
    }

    public function verify(User $user, string $code, string $purpose = 'login'): bool
    {
        $otp = UserOtp::where('user_id', $user->id)
            ->where('purpose', $purpose)
            ->orderByDesc('id')
            ->first();

        if (! $otp) {
            return false;
        }

        if ($otp->isExpired()) {
            $otp->update(['status' => UserOtp::STATUS_EXPIRED]);

            return false;
        }

        if (hash_equals($otp->code, $code)) {
            $otp->update([
                'status' => UserOtp::STATUS_VERIFIED,
                'used_at' => now(),
            ]);

            return true;
        }

        return false;
    }

    private function generateNumericCode(): string
    {
        return str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }
}

