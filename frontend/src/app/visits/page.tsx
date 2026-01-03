"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function VisitsPage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [greeting, setGreeting] = useState({ ar: "", en: "" });

    // Redirect if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    // Set greeting based on time
    useEffect(() => {
        const updateGreeting = () => {
            const hour = new Date().getHours();

            if (hour >= 5 && hour < 12) {
                setGreeting({
                    ar: "صباح الخير",
                    en: "Good Morning",
                });
            } else if (hour >= 12 && hour < 18) {
                setGreeting({
                    ar: "مساء الخير",
                    en: "Good Afternoon",
                });
            } else {
                setGreeting({
                    ar: "مساء الخير",
                    en: "Good Evening",
                });
            }
        };

        updateGreeting();
        // Update every minute
        const interval = setInterval(updateGreeting, 60000);
        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[var(--gold-primary)] border-r-transparent mb-4" />
                    <p className="text-[var(--text-secondary)]">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return null;
    }

    const userLang = user?.preferred_locale || 'en';

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <Navbar />

            <main className="container mx-auto px-4 py-12 max-w-6xl">
                {/* Greeting Section */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--text-primary)] mb-2">
                        {greeting[userLang]}, <span className="text-[var(--gold-primary)]">{user.name}</span>
                    </h1>
                    <p className="text-lg text-[var(--text-secondary)]">
                        {userLang === 'ar'
                            ? 'مرحباً بك في AUVÉA - التصاميم الفاخرة للمجوهرات'
                            : 'Welcome to AUVÉA - Luxury Jewelry Designs'
                        }
                    </p>
                </div>

                {/* Visit Booking Section */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* Book a Visit Card */}
                    <div className="bg-[var(--glass-bg)] backdrop-blur-lg border border-[var(--border-color)] rounded-2xl p-8 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-12 h-12 bg-[var(--gold-primary)]/10 rounded-full">
                                <svg className="w-6 h-6 text-[var(--gold-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
                                {userLang === 'ar' ? 'احجز زيارتك' : 'Book a Visit'}
                            </h2>
                        </div>

                        <p className="text-[var(--text-secondary)] mb-6">
                            {userLang === 'ar'
                                ? 'احجز موعداً لزيارة صالة العرض الخاصة بنا واستكشف مجموعتنا الحصرية من المجوهرات الفاخرة.'
                                : 'Schedule an appointment to visit our showroom and explore our exclusive collection of luxury jewelry.'
                            }
                        </p>

                        <button className="w-full py-3 px-6 bg-gradient-to-r from-[var(--gold-accent)] to-[var(--gold-primary)] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[var(--gold-primary)]/50 transition-all">
                            {userLang === 'ar' ? 'احجز الآن' : 'Book Now'}
                        </button>
                    </div>

                    {/* Virtual Showcase Card */}
                    <div className="bg-[var(--glass-bg)] backdrop-blur-lg border border-[var(--border-color)] rounded-2xl p-8 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-12 h-12 bg-[var(--gold-primary)]/10 rounded-full">
                                <svg className="w-6 h-6 text-[var(--gold-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
                                {userLang === 'ar' ? 'معرض افتراضي' : 'Virtual Showcase'}
                            </h2>
                        </div>

                        <p className="text-[var(--text-secondary)] mb-6">
                            {userLang === 'ar'
                                ? 'تصفح مجموعتنا الكاملة عبر الإنترنت مع جولات 360 درجة وتفاصيل عالية الدقة.'
                                : 'Browse our full collection online with 360° tours and high-resolution details.'
                            }
                        </p>

                        <button className="w-full py-3 px-6 border-2 border-[var(--gold-primary)] text-[var(--gold-primary)] font-semibold rounded-lg hover:bg-[var(--gold-primary)] hover:text-black transition-all">
                            {userLang === 'ar' ? 'استكشف المجموعة' : 'Explore Collection'}
                        </button>
                    </div>
                </div>

                {/* Upcoming Visits */}
                <div className="bg-[var(--glass-bg)] backdrop-blur-lg border border-[var(--border-color)] rounded-2xl p-8 shadow-xl">
                    <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">
                        {userLang === 'ar' ? 'زياراتك القادمة' : 'Your Upcoming Visits'}
                    </h2>

                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--gold-primary)]/10 rounded-full mb-4">
                            <svg className="w-8 h-8 text-[var(--gold-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-[var(--text-secondary)]">
                            {userLang === 'ar' ? 'لا توجد زيارات مجدولة حالياً' : 'No visits scheduled yet'}
                        </p>
                        <p className="text-sm text-[var(--text-tertiary)] mt-2">
                            {userLang === 'ar' ? 'احجز زيارتك الأولى لتبدأ' : 'Book your first visit to get started'}
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
