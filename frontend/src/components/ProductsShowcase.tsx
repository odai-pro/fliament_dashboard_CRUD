"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import Link from "next/link";
import Image from "next/image";
import { Product, Category } from "@/lib/server-api";
import { useAuth } from "@/contexts/AuthContext";

interface ProductsShowcaseProps {
  featuredProducts: Product[];
  categories: Category[];
  language: 'en' | 'ar';
}

export function ProductsShowcase({ featuredProducts, categories, language }: ProductsShowcaseProps) {
  const { isAuthenticated } = useAuth();

  return (
    <section id="showcase" className="mx-auto max-w-7xl px-6 pb-20">
      <ScrollReveal delay={0.1} direction="up">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--text-primary)] mb-4">
            {language === "ar" ? "المجموعات المميزة" : "Featured Collections"}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
            {language === "ar"
              ? "اكتشف مجموعتنا الحصرية من المجوهرات الفاخرة المصممة بعناية"
              : "Discover our exclusive collection of carefully crafted luxury jewelry"}
          </p>
        </div>
      </ScrollReveal>

      {featuredProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product, idx) => {
              const productImages = product.images.length > 0
                ? product.images
                : (product.preview_images.length > 0
                  ? product.preview_images
                  : ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop']);
              const mainImage = productImages[0];

              return (
                <ScrollReveal key={product.id} delay={0.1 * idx} direction="up">
                  <div className="group relative h-full rounded-2xl border border-[var(--border-color)] bg-[var(--glass-bg)] overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-[var(--gold-primary)]/50 hover:-translate-y-2">
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <Link href={`/products/${product.id}`}>
                        <Image
                          src={mainImage}
                          alt={product.name}
                          fill
                          className="object-cover transition-all duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Link>
                    </div>

                    {/* Content */}
                    <div className="p-6 bg-[var(--bg-secondary)]">
                      {/* Category Badge */}
                      <div className="mb-2">
                        <span className="text-xs text-[var(--gold-primary)] uppercase tracking-wide">
                          {product.category.name}
                        </span>
                      </div>

                      {/* Title */}
                      <Link href={`/products/${product.id}`}>
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 line-clamp-1 hover:text-[var(--gold-primary)] transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Description */}
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Product Details */}
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--border-color)]">
                        <div className="text-center">
                          <p className="text-xs text-[var(--text-secondary)] mb-1">
                            {language === "ar" ? "الوزن" : "Weight"}
                          </p>
                          <p className="text-sm font-semibold text-[var(--text-primary)]">
                            {product.weight ? `${product.weight} g` : 'N/A'}
                          </p>
                        </div>
                        <div className="h-8 w-px bg-[var(--border-color)]" />
                        <div className="text-center">
                          <p className="text-xs text-[var(--text-secondary)] mb-1">
                            {language === "ar" ? "السعر" : "Price"}
                          </p>
                          <p className="text-sm font-semibold text-[var(--text-primary)]">
                            ${product.final_price.toFixed(2)}
                            {product.discount_price && (
                              <span className="ml-2 text-xs text-[var(--text-secondary)] line-through">
                                ${product.price.toFixed(2)}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* View Details Button */}
                      {/* View Details Button */}
                      <Link
                        href={`/products/${product.id}`}
                        className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[var(--gold-primary)] to-[var(--gold-secondary)] text-black font-semibold text-sm transition-all duration-200 hover:opacity-90 flex items-center justify-center gap-2"
                      >
                        {language === "ar" ? "عرض التفاصيل" : "View Details"}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* View All Products CTA */}
          <ScrollReveal delay={0.4} direction="up">
            <div className="text-center mt-12">
              <Link
                href={isAuthenticated ? "/home" : "/register"}
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[var(--gold-primary)] text-[var(--gold-primary)] font-semibold rounded-lg hover:bg-[var(--gold-primary)] hover:text-black transition-all"
              >
                {language === "ar" ? "عرض جميع المنتجات" : "View All Products"}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </ScrollReveal>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-[var(--text-secondary)]">
            {language === "ar"
              ? "لا توجد منتجات مميزة حالياً"
              : "No featured products available"}
          </p>
        </div>
      )}
    </section>
  );
}
