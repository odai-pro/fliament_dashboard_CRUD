"use client";

import { useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Product } from "@/lib/server-api"; // Using Shared Interface

interface ProductDetailsClientProps {
    product: Product;
    language: 'en' | 'ar';
}

export function ProductDetailsClient({ product, language }: ProductDetailsClientProps) {
    const { addToCart, triggerAnimation } = useCart();
    // Use images or preview_images or fallback
    const allImages = product.images?.length > 0 ? product.images : (product.preview_images?.length > 0 ? product.preview_images : []);
    const [selectedImage, setSelectedImage] = useState<string>(allImages[0] || '');

    const handleAddToCart = (e: React.MouseEvent) => {
        // Adapt server product to cart product structure if needed, or if compatible just pass it
        // The CartContext expects a type compatible with what we have.
        // We might need to cast or map if the types strictly diverge, but usually they share structure.
        addToCart(product as any);
        triggerAnimation({ x: e.clientX, y: e.clientY });
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-700">
            <Navbar />

            <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* Left: Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative h-[32vh] lg:h-[360px] w-full rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-gray-800 border border-[var(--border-color)] shadow-2xl shadow-black/5">
                            {selectedImage ? (
                                <Image
                                    src={selectedImage}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-[var(--text-secondary)]">
                                    No Image Available
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === img
                                            ? 'border-[var(--gold-primary)] scale-105 shadow-lg'
                                            : 'border-transparent hover:border-[var(--gold-primary)]/50'
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className="lg:sticky lg:top-32 h-fit space-y-5">
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-3 bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent">
                                {product.name}
                            </h1>
                            {product.category && (
                                <div className="flex items-center gap-2">
                                    <span className="h-px w-8 bg-[var(--gold-primary)]"></span>
                                    <span className="text-[var(--gold-primary)] text-sm tracking-[0.2em] uppercase font-bold">
                                        {product.category.name}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-end gap-4 border-b border-[var(--border-color)] pb-6">
                            <div className="text-5xl font-bold text-[var(--gold-primary)] font-serif">
                                ${product.final_price?.toFixed(2)}
                            </div>
                            {product.discount_price && (
                                <div className="text-xl text-[var(--text-secondary)] line-through mb-2 opacity-60">
                                    ${product.price?.toFixed(2)}
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            {/* Digital Product Features */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 rounded-2xl bg-[var(--glass-bg)] border border-[var(--border-color)] backdrop-blur-sm text-center hover:border-[var(--gold-primary)] transition-colors group">
                                    <p className="text-xs text-[var(--text-secondary)] uppercase mb-2 tracking-wider group-hover:text-[var(--gold-primary)] transition-colors">
                                        {language === 'ar' ? 'نوع الملف' : 'File Format'}
                                    </p>
                                    <p className="font-bold text-lg font-mono">
                                        {product.file_format || 'STL/OBJ'}
                                    </p>
                                </div>
                                <div className="p-5 rounded-2xl bg-[var(--glass-bg)] border border-[var(--border-color)] backdrop-blur-sm text-center hover:border-[var(--gold-primary)] transition-colors group">
                                    <p className="text-xs text-[var(--text-secondary)] uppercase mb-2 tracking-wider group-hover:text-[var(--gold-primary)] transition-colors">
                                        {language === 'ar' ? 'وزن الذهب المتوقع' : 'Est. Gold Weight'}
                                    </p>
                                    <p className="font-bold text-lg">
                                        {product.weight ? `${product.weight}g` : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="prose dark:prose-invert max-w-none">
                                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-[var(--gold-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {language === 'ar' ? 'حول التصميم' : 'About Design'}
                                </h3>
                                <p className="text-[var(--text-secondary)] leading-relaxed text-lg">
                                    {product.description}
                                </p>
                            </div>
                        </div>

                        <div className="pt-2 space-y-3">
                            <button
                                onClick={handleAddToCart}
                                className="w-full py-4.5 bg-gradient-to-r from-[var(--gold-primary)] to-[var(--gold-secondary)] text-black font-bold text-xl rounded-2xl hover:shadow-[0_0_30px_rgba(200,164,109,0.3)] hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden group"
                            >
                                <span className="relative z-10">{language === 'ar' ? 'إضافة للسلة' : 'Add to Cart'}</span>
                                <svg className="w-6 h-6 relative z-10 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            </button>

                            <div className="flex items-center justify-center gap-6 text-xs text-[var(--text-secondary)]">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    {language === 'ar' ? 'تحميل فوري' : 'Instant Download'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {language === 'ar' ? 'جودة عالية' : 'High Quality STL'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
