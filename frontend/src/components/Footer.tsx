"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/translations";

export function Footer() {
    const [email, setEmail] = useState("");
    const [language, setLanguage] = useState<"en" | "ar">("en");
    const t = useTranslation(language);

    useEffect(() => {
        const saved = localStorage.getItem("language") as "en" | "ar" | null;
        if (saved) setLanguage(saved);

        const handleStorageChange = () => {
            const newLang = localStorage.getItem("language") as "en" | "ar" | null;
            if (newLang) setLanguage(newLang);
        };

        window.addEventListener("storage", handleStorageChange);
        const interval = setInterval(handleStorageChange, 100);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Newsletter signup:", email);
    };

    return (
        <footer className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-colors duration-700">
            {/* Main Footer Content */}
            <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
                {/* Description */}
                <div className="mb-8 md:mb-12 text-center">
                    <p className="mx-auto max-w-4xl text-xs md:text-sm leading-relaxed text-[var(--text-secondary)]">
                        {t.footerDesc}
                    </p>
                </div>

                {/* Footer Columns - Mobile: Single col, Desktop: 4 cols */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center md:text-start">
                    {/* Support */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold-primary)]">
                            {t.footerSupport}
                        </h3>
                        <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
                            <li className="py-1">
                                <a href="#" className="hover:text-[var(--text-primary)] transition-colors px-2">{t.footerFAQ}</a>
                            </li>
                            <li className="py-1">
                                <a href="#" className="hover:text-[var(--text-primary)] transition-colors px-2">{t.footerShipping}</a>
                            </li>
                            <li className="py-1">
                                <a href="#" className="hover:text-[var(--text-primary)] transition-colors px-2">{t.footerReturns}</a>
                            </li>
                            <li className="py-1">
                                <a href="#" className="hover:text-[var(--text-primary)] transition-colors px-2">{t.footerWarranty}</a>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold-primary)]">
                            {t.footerServices}
                        </h3>
                        <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                            <li>
                                <a href="#" className="hover:text-[var(--text-primary)] transition-colors">{t.footerCustomDesign}</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-[var(--text-primary)] transition-colors">{t.footerAppraisal}</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-[var(--text-primary)] transition-colors">{t.footerRepair}</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-[var(--text-primary)] transition-colors">{t.footerConsultation}</a>
                            </li>
                        </ul>
                    </div>

                    {/* About */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold-primary)]">
                            {t.footerAbout}
                        </h3>
                        <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                            <li>
                                <a href="#" className="hover:text-[var(--text-primary)] transition-colors">{t.visits}</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-[var(--text-primary)] transition-colors">{t.showcase}</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-[var(--text-primary)] transition-colors">{t.bespoke}</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-[var(--text-primary)] transition-colors">{t.contact}</a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold-primary)]">
                            {t.footerNewsletter}
                        </h3>
                        <p className="mb-4 text-xs text-[var(--text-secondary)] leading-relaxed">
                            {t.footerNewsletterDesc}
                        </p>
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t.footerEmailPlaceholder}
                                className="flex-1 rounded-md border border-[var(--border-color)] bg-[var(--glass-bg)] px-3 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--gold-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-primary)] transition-colors"
                            />
                            <button
                                type="submit"
                                className="rounded-md bg-[var(--gold-primary)] px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-[var(--gold-secondary)]"
                            >
                                {t.footerSubscribe}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[var(--border-color)] bg-[var(--bg-primary)]/60 px-6 py-6 transition-colors duration-700">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
                    {/* Copyright */}
                    <div className="text-xs text-[var(--text-secondary)]">
                        {t.footerCopyright}
                    </div>

                    {/* Social Media */}
                    <div className="flex items-center gap-4">
                        <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--gold-primary)] transition-colors">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                            </svg>
                        </a>
                        <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--gold-primary)] transition-colors">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </a>
                        <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--gold-primary)] transition-colors">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </a>
                    </div>

                    {/* Back to Top */}
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="rounded-full border border-[var(--border-color)] p-2 text-[var(--text-secondary)] hover:border-[var(--gold-primary)] hover:text-[var(--gold-primary)] transition-colors"
                        aria-label={t.footerBackToTop}
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                    </button>
                </div>
            </div>
        </footer>
    );
}
