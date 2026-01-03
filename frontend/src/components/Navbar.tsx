"use client";

import { useState, useEffect, useRef } from "react";
import { ThemeToggle } from "./ui/ThemeToggle";
import { Logo } from "./ui/Logo";
import { useTranslation } from "@/lib/translations";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/components/LanguageProvider";
import { motion, AnimatePresence } from "framer-motion";

import { CartButton } from "./ui/CartButton";
import { SignOutButton } from "./ui/SignOutButton";

interface PriceData {
    gold: string;
    silver: string;
}

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { language, toggleLanguage } = useLanguage();
    const [prices, setPrices] = useState<PriceData>({
        gold: "...",
        silver: "...",
    });

    const t = useTranslation(language);
    const { theme } = useTheme();
    const { logout, user } = useAuth();

    const handleSignOut = async () => {
        await logout();
        setIsMenuOpen(false); // Close menu on logout
    };

    useEffect(() => {
        // Use fallback values by default to avoid API errors
        // If you have a valid goldapi.io API key, set it in NEXT_PUBLIC_GOLD_API_KEY
        const apiKey = process.env.NEXT_PUBLIC_GOLD_API_KEY;
        
        const fetchPrices = async () => {
            // Only try to fetch if API key is provided
            if (!apiKey) {
                setPrices({
                    gold: "$80.50/g",
                    silver: "$1.13/g",
                });
                return;
            }

            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

                const response = await fetch("https://www.goldapi.io/api/XAU/USD", {
                    headers: {
                        "x-access-token": apiKey,
                    },
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`API returned ${response.status}`);
                }

                const data = await response.json();

                if (data?.price_gram_24k) {
                    setPrices({
                        gold: `$${data.price_gram_24k.toFixed(2)}/g`,
                        silver: `$${(data.price_gram_24k * 0.014).toFixed(2)}/g`,
                    });
                } else {
                    throw new Error('Invalid data format');
                }
            } catch (error: any) {
                // Silently fail to fallback values to avoid console noise
                // Only log if it's not an abort error
                if (error.name !== 'AbortError') {
                    // Use fallback values without logging to console
                }
                setPrices({
                    gold: "$80.50/g",
                    silver: "$1.13/g",
                });
            }
        };

        fetchPrices();
        // Only set interval if API key exists
        if (apiKey) {
            const interval = setInterval(fetchPrices, 300000); // 5 minutes
            return () => clearInterval(interval);
        }
    }, []);

    return (
        <header className="fixed top-0 z-[90] w-full border-b border-[var(--border-color)] bg-[var(--bg-primary)] transition-colors">
            {/* Top Bar - Theme Aware (Hidden on mobile to save space) */}
            <div className={`hidden md:block border-b border-[var(--border-color)] px-4 py-1.5 transition-colors ${theme === "dark"
                ? "bg-black/40"
                : "bg-gradient-to-r from-[var(--gold-accent)] to-[var(--gold-primary)]"
                }`}>
                <div className="mx-auto flex max-w-7xl items-center justify-between text-[0.65rem]">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                            <span className={`h-1.5 w-1.5 rounded-full shadow-sm ${theme === "dark" ? "bg-yellow-500" : "bg-yellow-300 shadow-yellow-300"
                                }`} />
                            <span className={theme === "dark" ? "text-white/60" : "font-medium text-black/70"}>{t.gold}:</span>
                            <span className={theme === "dark" ? "font-medium text-white" : "font-bold text-black"}>{prices.gold}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className={`h-1.5 w-1.5 rounded-full shadow-sm ${theme === "dark" ? "bg-gray-400" : "bg-gray-300 shadow-gray-300"
                                }`} />
                            <span className={theme === "dark" ? "text-white/60" : "font-medium text-black/70"}>{t.silver}:</span>
                            <span className={theme === "dark" ? "font-medium text-white" : "font-bold text-black"}>{prices.silver}</span>
                        </div>
                    </div>
                    <div className={`flex items-center gap-2 ${theme === "dark" ? "text-white/60" : "font-medium text-black/70"}`}>
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className={theme === "dark" ? "text-white" : "text-black"}>000 000 777 367+</span>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="px-4 py-3 md:px-6 md:py-4">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    {/* Logo with Greeting */}
                    <div className="flex items-center gap-4">
                        <Logo className="h-10 w-10 md:h-16 md:w-16" />
                        {user && (
                            <div className="hidden md:block">
                                <p className="text-lg md:text-xl font-serif text-[var(--text-primary)]">
                                    {user.name && (
                                        <span className="text-[var(--gold-primary)]">Hello, {user.name}</span>
                                    )}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Desktop & Mobile Actions */}
                    <div className="flex items-center gap-3 md:gap-4">
                        {/* Always Visible: Cart & Theme */}
                        <CartButton />
                        <ThemeToggle />

                        {/* Desktop Only: Language & SignOut */}
                        <div className="hidden md:flex items-center gap-4">
                            <motion.button
                                onClick={toggleLanguage}
                                className="group relative flex h-10 items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--glass-bg)] px-4 backdrop-blur-md"
                                whileHover={{ scale: 1.05, borderColor: "var(--gold-primary)" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className={`${language === "en" ? "text-[var(--gold-primary)] font-bold" : "text-[var(--text-secondary)]"} text-xs transition-all`}>EN</span>
                                <span className="text-[var(--border-color)]">/</span>
                                <span className={`${language === "ar" ? "text-[var(--gold-primary)] font-bold" : "text-[var(--text-secondary)]"} text-xs transition-all`}>AR</span>
                            </motion.button>

                            <SignOutButton onClick={handleSignOut} title={t.signOut} />
                        </div>

                        {/* Mobile Menu Button (Shows when md:hidden) */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-[var(--border-color)] bg-[var(--glass-bg)] md:hidden"
                            aria-label="Menu"
                        >
                            <motion.span
                                animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 6 : 0 }}
                                className="h-0.5 w-5 bg-[var(--gold-primary)] origin-center"
                            />
                            <motion.span
                                animate={{ opacity: isMenuOpen ? 0 : 1 }}
                                className="h-0.5 w-5 bg-[var(--gold-primary)]"
                            />
                            <motion.span
                                animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -6 : 0 }}
                                className="h-0.5 w-5 bg-[var(--gold-primary)] origin-center"
                            />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-[var(--border-color)] bg-[var(--bg-primary)] md:hidden"
                        >
                            <div className="flex flex-col gap-4 px-6 py-6">
                                {/* Language Toggle in Menu */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-[var(--text-primary)]">{language === 'ar' ? 'اللغة' : 'Language'}</span>
                                    <button
                                        onClick={toggleLanguage}
                                        className="flex h-8 items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--glass-bg)] px-4"
                                    >
                                        <span className={`${language === "en" ? "text-[var(--gold-primary)] font-bold" : "text-[var(--text-secondary)]"} text-xs`}>EN</span>
                                        <span className="text-[var(--border-color)]">/</span>
                                        <span className={`${language === "ar" ? "text-[var(--gold-primary)] font-bold" : "text-[var(--text-secondary)]"} text-xs`}>AR</span>
                                    </button>
                                </div>

                                {/* User Info if hidden in top bar */}
                                {user && (
                                    <div className="text-sm text-[var(--text-secondary)]">
                                        {language === 'ar' ? 'مرحباً' : 'Signed in as'} <span className="text-[var(--gold-primary)]">{user.name}</span>
                                    </div>
                                )}

                                <div className="flex justify-center pt-2 border-t border-[var(--border-color)] mt-2">
                                    <SignOutButton onClick={handleSignOut} title={t.signOut} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
}
