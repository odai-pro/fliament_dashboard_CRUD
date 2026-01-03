"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function OTPPage() {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [email, setEmail] = useState("");

    const { verifyOTP, resendOTP } = useAuth();
    const router = useRouter();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Check if coming from login/register
        const pendingUserId = sessionStorage.getItem('pending_user_id');
        const storedEmail = sessionStorage.getItem('pending_email') || "your email";

        if (!pendingUserId) {
            router.push('/login');
            return;
        }

        setEmail(storedEmail);

        // Focus first input
        inputRefs.current[0]?.focus();
    }, [router]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return; // Only single digit
        if (!/^\d*$/.test(value)) return; // Only numbers

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all filled
        if (newCode.every((digit) => digit !== "") && value) {
            handleSubmit(newCode.join(""));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6);

        if (!/^\d+$/.test(pastedData)) return;

        const newCode = pastedData.split("").concat(Array(6 - pastedData.length).fill("")).slice(0, 6);
        setCode(newCode);

        // Focus last filled input
        const lastIndex = Math.min(pastedData.length, 5);
        inputRefs.current[lastIndex]?.focus();

        // Auto-submit if complete
        if (pastedData.length === 6) {
            handleSubmit(pastedData);
        }
    };

    const handleSubmit = async (otpCode?: string) => {
        const codeToVerify = otpCode || code.join("");

        if (codeToVerify.length !== 6) {
            setError("Please enter all 6 digits");
            return;
        }

        setError("");
        setLoading(true);

        try {
            await verifyOTP({ code: codeToVerify });
        } catch (err: any) {
            setError(err.message || "Invalid OTP code");
            setCode(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0) return;

        setResending(true);
        try {
            await resendOTP();
            setCountdown(60);
            setError("");
        } catch (err: any) {
            setError(err.message || "Failed to resend OTP");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="font-serif text-4xl font-bold text-[var(--gold-primary)] mb-2">
                        AUVÉA
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)]">Email Verification</p>
                </div>

                {/* OTP Card */}
                <div className="bg-[var(--glass-bg)] backdrop-blur-lg border border-[var(--border-color)] rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--gold-primary)]/10 rounded-full mb-4">
                            <svg className="w-8 h-8 text-[var(--gold-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
                            Check your email
                        </h2>
                        <p className="text-sm text-[var(--text-secondary)]">
                            We've sent a 6-digit code to<br />
                            <span className="font-medium text-[var(--gold-primary)]">{email}</span>
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* OTP Inputs */}
                    <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-14 text-center text-2xl font-semibold bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-primary)] focus:ring-2 focus:ring-[var(--gold-primary)]/20 transition-all"
                                disabled={loading}
                            />
                        ))}
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={() => handleSubmit()}
                        disabled={loading || code.some((d) => !d)}
                        className="w-full py-3 px-4 bg-gradient-to-r from-[var(--gold-accent)] to-[var(--gold-primary)] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[var(--gold-primary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--gold-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                    >
                        {loading ? "Verifying..." : "Verify Email"}
                    </button>

                    {/* Resend */}
                    <div className="text-center">
                        <p className="text-sm text-[var(--text-secondary)]">
                            Didn't receive the code?{" "}
                            <button
                                onClick={handleResend}
                                disabled={countdown > 0 || resending}
                                className="text-[var(--gold-primary)] hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
                            >
                                {resending ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Resend"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
