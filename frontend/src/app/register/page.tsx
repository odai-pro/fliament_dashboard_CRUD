"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [language, setLanguage] = useState<"en" | "ar">("en");
    const [darkMode, setDarkMode] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const { theme } = useTheme();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (password !== passwordConfirm) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setLoading(true);

        try {
            await register({
                name,
                email,
                password,
                password_confirmation: passwordConfirm,
                preferred_locale: language,
                prefers_dark_mode: darkMode,
            });
        } catch (err: any) {
            setError(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="font-serif text-4xl font-bold text-[var(--gold-primary)] mb-2">
                        AUVÉA
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)]">Create Your Account</p>
                </div>

                {/* Register Card */}
                <div className="bg-[var(--glass-bg)] backdrop-blur-lg border border-[var(--border-color)] rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">
                        Register
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-primary)] transition-all"
                                placeholder="John Doe"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-primary)] transition-all"
                                placeholder="your@email.com"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-primary)] transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="password_confirm" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Confirm Password
                            </label>
                            <input
                                id="password_confirm"
                                type="password"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-primary)] transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Language Preference */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Preferred Language
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        value="en"
                                        checked={language === "en"}
                                        onChange={(e) => setLanguage(e.target.value as "en" | "ar")}
                                        className="h-4 w-4 text-[var(--gold-primary)] border-[var(--border-color)] focus:ring-[var(--gold-primary)]"
                                    />
                                    <span className="ml-2 text-sm text-[var(--text-secondary)]">English</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        value="ar"
                                        checked={language === "ar"}
                                        onChange={(e) => setLanguage(e.target.value as "en" | "ar")}
                                        className="h-4 w-4 text-[var(--gold-primary)] border-[var(--border-color)] focus:ring-[var(--gold-primary)]"
                                    />
                                    <span className="ml-2 text-sm text-[var(--text-secondary)]">العربية</span>
                                </label>
                            </div>
                        </div>

                        {/* Dark Mode Preference */}
                        <div className="flex items-center">
                            <input
                                id="dark_mode"
                                type="checkbox"
                                checked={darkMode}
                                onChange={(e) => setDarkMode(e.target.checked)}
                                className="h-4 w-4 text-[var(--gold-primary)] border-[var(--border-color)] rounded focus:ring-[var(--gold-primary)]"
                            />
                            <label htmlFor="dark_mode" className="ml-2 text-sm text-[var(--text-secondary)]">
                                Prefer dark mode
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-[var(--gold-accent)] to-[var(--gold-primary)] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[var(--gold-primary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--gold-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-[var(--text-secondary)]">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-[var(--gold-primary)] hover:underline font-medium"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-6 text-center">
                    <Link
                        href="/"
                        className="text-sm text-[var(--text-tertiary)] hover:text-[var(--gold-primary)] transition-colors"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
