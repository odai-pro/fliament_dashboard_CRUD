"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { HeroSlider } from "@/components/hero/HeroSlider";
import { useTranslation } from "@/lib/translations";
import { Model3D } from "@/components/3d/Model3D";
import { productsApi, categoriesApi, Product, Category } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageProvider";
import { seededShuffle } from "@/lib/random";
import { useCart } from "@/contexts/CartContext";
import { ProductSkeleton } from "@/components/ui/ProductSkeleton";

export default function HomePage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const { language: userLang } = useLanguage();
    const { addToCart, triggerAnimation } = useCart();
    const router = useRouter();
    const [isFlipped, setIsFlipped] = useState(false);
    const [userInteracted, setUserInteracted] = useState(false);
    const [activeFilter, setActiveFilter] = useState<number | 'all'>('all');
    const [imageIndices, setImageIndices] = useState<Record<string, number>>({});
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const t = useTranslation(userLang);

    // Get or generate a consistent seed for randomization
    const [randomSeed, setRandomSeed] = useState<number>(0);

    useEffect(() => {
        if (user?.layout_seed) {
            // Use seed from authenticated user profile
            setRandomSeed(user.layout_seed);
        } else {
            // For guest or user without seed, use local storage to persist a random seed
            const storedSeed = localStorage.getItem('guest_layout_seed');
            if (storedSeed) {
                setRandomSeed(parseInt(storedSeed));
            } else {
                const newSeed = Math.floor(Math.random() * 1000000);
                localStorage.setItem('guest_layout_seed', newSeed.toString());
                setRandomSeed(newSeed);
            }
        }
    }, [user]);

    // Auto-flip images every 5 seconds if user hasn't interacted
    useEffect(() => {
        if (userInteracted) return;

        const interval = setInterval(() => {
            setIsFlipped((prev) => !prev);
        }, 5000);

        return () => clearInterval(interval);
    }, [userInteracted]);

    // Fetch categories and products
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingProducts(true);
                // Fetch categories and initial products (first page only for home)
                const [categoriesRes, productsRes] = await Promise.all([
                    categoriesApi.getAll(userLang as 'en' | 'ar'),
                    productsApi.getAll({ locale: userLang as 'en' | 'ar', per_page: 24 }), // Fetch enough to shuffle
                ]);

                // التأكد من أن البيانات موجودة
                if (categoriesRes && categoriesRes.data) {
                    // Shuffle categories using seeded shuffle for consistent randomization per user
                    const shuffledCategories = seededShuffle(categoriesRes.data, randomSeed);

                    setCategories(shuffledCategories);

                    // Set random first category as active immediately
                    if (shuffledCategories.length > 0) {
                        setActiveFilter(shuffledCategories[0].id);
                    }
                }
                if (productsRes && productsRes.data) {
                    // Shuffle products using seeded shuffle
                    const shuffledProducts = seededShuffle(productsRes.data, randomSeed + 1);
                    setProducts(shuffledProducts);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(userLang === 'ar' ? 'حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى لاحقاً.' : 'Error loading data. Please try again later.');
                setCategories([]);
                setProducts([]);
            } finally {
                setLoadingProducts(false);
            }
        };

        if (randomSeed !== 0) {
            fetchData();
        }
    }, [isAuthenticated, userLang, randomSeed]);

    // Auto-rotate product images every 5 seconds
    useEffect(() => {
        if (products.length === 0) return;

        const interval = setInterval(() => {
            setImageIndices((prev) => {
                const newIndices = { ...prev };
                // Cycle through images for all products
                products.forEach((product) => {
                    const imageCount = product.images.length || 1;
                    newIndices[product.id.toString()] = ((newIndices[product.id.toString()] || 0) + 1) % imageCount;
                });
                return newIndices;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [products]);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, isLoading, router]);

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

    // حساب المنتجات للقسم المحدد (6 منتجات فقط في كل الحالات)
    const filteredProducts = activeFilter === 'all'
        ? products.slice(0, 6)
        : products.filter(p => p.category_id === activeFilter).slice(0, 6);

    const selectedCategory = activeFilter !== 'all' ? categories.find(c => c.id === activeFilter) : null;
    const sectionTitle = selectedCategory ? selectedCategory.name : (userLang === 'ar' ? 'أحدث التصاميم' : 'Latest Designs');

    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        addToCart(product);
        triggerAnimation({ x: e.clientX, y: e.clientY });
    };

    return (
        <div className="flex min-h-screen flex-col overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-700">
            <Navbar />

            <main className="flex-1">
                {/* HERO SLIDER */}
                <HeroSlider />

                {/* Award Section */}
                <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12 md:py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
                        {/* Text Content */}
                        <ScrollReveal delay={0.1} direction={userLang === 'ar' ? 'left' : 'right'}>
                            <div className="space-y-4">
                                <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)]">
                                    {t.awardSubtitle}
                                </p>
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[var(--gold-primary)] leading-tight">
                                    {t.awardTitle}{" "}
                                    <span className="text-[var(--text-primary)]">{t.awardTitleHighlight}</span>
                                </h2>
                                <div className="space-y-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                                    <p>
                                        {t.awardParagraph1}
                                    </p>
                                    <p>
                                        {t.awardParagraph2}
                                    </p>
                                    <p>
                                        {t.awardParagraph3}
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Images Stack with Card Flip Effect */}
                        <ScrollReveal delay={0.2} direction={userLang === 'ar' ? 'right' : 'left'}>
                            <div
                                className="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] cursor-pointer perspective-1000 select-none"
                                onClick={() => {
                                    setIsFlipped(!isFlipped);
                                    setUserInteracted(true);
                                }}
                            >
                                {/* Gold Ring 3D Model - Behind */}
                                <div
                                    className={`absolute inset-0 rounded-xl border border-[var(--border-color)] overflow-hidden bg-gradient-to-br from-[var(--gold-primary)]/20 to-transparent transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform-gpu ${isFlipped
                                            ? 'z-20 translate-x-0 translate-y-0 scale-100 opacity-100 shadow-[0_20px_60px_rgba(0,0,0,0.3)]'
                                            : 'z-0 translate-x-8 translate-y-8 scale-95 opacity-90 shadow-none'
                                        }`}
                                >
                                    <Model3D
                                        src="/models/gold-ring.glb"
                                        alt={userLang === 'ar' ? 'خاتم ذهبي' : 'Gold Ring'}
                                        className="w-full h-full"
                                        autoRotate={!userInteracted}
                                        cameraControls={true}
                                    />
                                </div>

                                {/* Silver Necklace 3D Model - In Front */}
                                <div
                                    className={`absolute inset-0 rounded-xl border border-[var(--border-color)] overflow-hidden bg-gradient-to-br from-[var(--gold-primary)]/10 to-transparent transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform-gpu ${isFlipped
                                            ? 'z-0 translate-x-8 translate-y-8 scale-95 opacity-90 shadow-none'
                                            : 'z-20 translate-x-0 translate-y-0 scale-100 opacity-100 shadow-[0_20px_60px_rgba(0,0,0,0.3)]'
                                        }`}
                                >
                                    <Model3D
                                        src="/models/silver-necklace.glb"
                                        alt={userLang === 'ar' ? 'عقد فضي' : 'Silver Necklace'}
                                        className="w-full h-full"
                                        autoRotate={!userInteracted}
                                        cameraControls={true}
                                    />
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </section>

                {/* Exclusive Collections Section */}
                <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-20">
                    {/* Header */}
                    <ScrollReveal delay={0.1} direction="up">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--text-primary)] mb-4">
                                {t.collectionsTitle}
                            </h2>
                            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
                                {t.collectionsDescription}
                            </p>
                        </div>
                    </ScrollReveal>

                    {/* Filter Buttons */}
                    <ScrollReveal delay={0.2} direction="up">
                        <div className="flex flex-wrap justify-center gap-3 mb-12">
                            {/* "All Design" button removed as per request */}

                            {categories.map((category) => {
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => setActiveFilter(category.id)}
                                        className={`px-6 py-2 rounded-full text-base font-medium transition-all duration-300 ${activeFilter === category.id
                                                ? 'bg-[var(--gold-primary)] text-black shadow-[0_4px_20px_rgba(200,164,109,0.4)] scale-105'
                                                : 'bg-[var(--glass-bg)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[var(--gold-primary)] hover:text-[var(--text-primary)]'
                                            }`}
                                    >
                                        {category.name}
                                    </button>
                                );
                            })}
                        </div>
                    </ScrollReveal>

                    {/* Products Grid */}
                    <div className="space-y-12">
                        {loadingProducts ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, idx) => (
                                    <ScrollReveal key={`skeleton-${idx}`} delay={0.1 * idx} direction="up">
                                        <ProductSkeleton />
                                    </ScrollReveal>
                                ))}
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-[var(--text-secondary)]">No products found.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-[var(--text-primary)]">
                                        {sectionTitle}
                                    </h3>
                                    {selectedCategory && (
                                        <Link
                                            href={`/category/${selectedCategory.id}`}
                                            className="text-sm text-[var(--gold-primary)] hover:text-[var(--gold-secondary)] transition-colors flex items-center gap-2 font-medium"
                                        >
                                            {userLang === 'ar' ? 'عرض الكل' : 'View All'}
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredProducts.map((product, idx) => {
                                        const currentImageIndex = imageIndices[product.id.toString()] || 0;
                                        // الاعتماد فقط على صور قاعدة البيانات
                                        const productImages = product.images && product.images.length > 0
                                            ? product.images
                                            : (product.preview_images && product.preview_images.length > 0
                                                ? product.preview_images
                                                : []);

                                        const currentImage = productImages[currentImageIndex] || productImages[0];
                                        const fallbackImage = 'https://placehold.co/600x600/e2e8f0/1e293b?text=No+Image';

                                        return (
                                            <ScrollReveal key={product.id} delay={0.1 * idx} direction="up">
                                                <div className="group relative h-full rounded-2xl border border-[var(--border-color)] bg-[var(--glass-bg)] overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-[var(--gold-primary)]/50">
                                                    <div className="relative h-64 overflow-hidden">
                                                        <Link href={`/products/${product.id}`}>
                                                            {currentImage ? (
                                                                <Image
                                                                    key={`${product.id}-${currentImageIndex}`}
                                                                    src={currentImage}
                                                                    alt={product.name}
                                                                    fill
                                                                    className="object-cover transition-all duration-700 group-hover:scale-105"
                                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                                    style={{
                                                                        animation: 'fadeIn 0.7s ease-in-out'
                                                                    }}
                                                                    onError={(e) => {
                                                                        const target = e.target as HTMLImageElement;
                                                                        target.srcset = "";
                                                                        target.src = fallbackImage;
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                                                    <span className="text-gray-500 text-sm">No Image</span>
                                                                </div>
                                                            )}
                                                        </Link>
                                                        {/* View All Button (only for specific category context) */}
                                                        {selectedCategory && idx === 5 && products.filter(p => p.category_id === selectedCategory.id).length > 6 && (
                                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                                                <Link
                                                                    href={`/category/${selectedCategory.id}`}
                                                                    className="px-3 py-1.5 bg-[var(--gold-primary)]/95 backdrop-blur-sm text-black text-xs font-semibold rounded-lg hover:bg-[var(--gold-primary)] transition-all shadow-lg inline-block"
                                                                >
                                                                    {userLang === 'ar' ? 'عرض الكل' : 'View All'}
                                                                </Link>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="p-6 bg-[var(--bg-secondary)]">
                                                        <div className="mb-2">
                                                            <span className="text-xs text-[var(--gold-primary)] uppercase tracking-wide">
                                                                {product.category.name}
                                                            </span>
                                                        </div>

                                                        <Link href={`/products/${product.id}`}>
                                                            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3 hover:text-[var(--gold-primary)] transition-colors">
                                                                {product.name}
                                                            </h3>
                                                        </Link>

                                                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-2">
                                                            {product.description}
                                                        </p>

                                                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--border-color)]">
                                                            <div className="text-center">
                                                                <p className="text-sm text-[var(--text-secondary)] mb-1 font-medium">{t.weight || 'Weight'}</p>
                                                                <p className="text-base font-bold text-[var(--text-primary)]">
                                                                    {product.weight ? `${product.weight} g` : 'N/A'}
                                                                </p>
                                                            </div>
                                                            <div className="h-8 w-px bg-[var(--border-color)]" />
                                                            <div className="text-center">
                                                                <p className="text-sm text-[var(--text-secondary)] mb-1 font-medium">{t.price || 'Price'}</p>
                                                                <p className="text-base font-bold text-[var(--text-primary)]">
                                                                    ${product.final_price.toFixed(2)}
                                                                    {product.discount_price && (
                                                                        <span className="ml-2 text-xs text-[var(--text-secondary)] line-through">
                                                                            ${product.price.toFixed(2)}
                                                                        </span>
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={(e) => handleAddToCart(e, product)}
                                                            className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[var(--gold-primary)] to-[var(--gold-secondary)] text-black font-semibold text-sm transition-all duration-200 hover:opacity-90 flex items-center justify-center gap-2"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                            </svg>
                                                            {t.addToCart || 'Add to Cart'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </ScrollReveal>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
