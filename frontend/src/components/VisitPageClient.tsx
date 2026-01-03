"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { HeroSlider } from "@/components/hero/HeroSlider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useTranslation } from "@/lib/translations";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { ProductsShowcase } from "@/components/ProductsShowcase";
import { Product, Category } from "@/lib/server-api";

interface VisitPageClientProps {
  featuredProducts: Product[];
  categories: Category[];
  language: 'en' | 'ar';
}

export function VisitPageClient({ featuredProducts, categories, language }: VisitPageClientProps) {
  const { isAuthenticated } = useAuth();
  const t = useTranslation(language);

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-700">
      <Navbar />

      <main className="flex-1">
        {/* HERO SLIDER */}
        <HeroSlider />

        {/* VISITS STEPS */}
        <section className="mx-auto max-w-7xl px-6 pb-20 pt-20">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: t.card1Title,
                body: t.card1Body,
              },
              {
                title: t.card2Title,
                body: t.card2Body,
              },
              {
                title: t.card3Title,
                body: t.card3Body,
              },
            ].map((card, idx) => (
              <ScrollReveal key={card.title} delay={0.2 * idx} direction="up">
                <div className="group relative h-full rounded-3xl border border-[var(--border-color)] bg-[var(--glass-bg)] p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-[var(--gold-primary)] hover:shadow-[var(--shadow-glow)]">
                  <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-[var(--gold-primary)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-5" />
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--gold-primary)]">
                    {card.title}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                    {card.body}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* FEATURED PRODUCTS SHOWCASE */}
        <ProductsShowcase 
          featuredProducts={featuredProducts} 
          categories={categories}
          language={language}
        />

        {/* LOGIN/REGISTER CTA SECTION */}
        {!isAuthenticated && (
          <section className="mx-auto max-w-4xl px-6 pb-32">
            <ScrollReveal delay={0.6} direction="up">
              <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--glass-bg)] p-12 backdrop-blur-md text-center">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--text-primary)] mb-4">
                  {language === "ar" ? "ابدأ رحلتك معنا" : "Start Your Journey With Us"}
                </h2>
                <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
                  {language === "ar"
                    ? "سجل دخولك أو أنشئ حساباً جديداً للوصول إلى مجموعتنا الحصرية من المجوهرات الفاخرة"
                    : "Sign in or create a new account to access our exclusive collection of luxury jewelry"}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    href="/login"
                    className="px-8 py-4 bg-gradient-to-r from-[var(--gold-accent)] to-[var(--gold-primary)] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[var(--gold-primary)]/50 transition-all min-w-[200px] text-center"
                  >
                    {language === "ar" ? "تسجيل الدخول" : "Sign In"}
                  </Link>
                  <Link
                    href="/register"
                    className="px-8 py-4 border-2 border-[var(--gold-primary)] text-[var(--gold-primary)] font-semibold rounded-lg hover:bg-[var(--gold-primary)] hover:text-black transition-all min-w-[200px] text-center"
                  >
                    {language === "ar" ? "إنشاء حساب جديد" : "Create Account"}
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

