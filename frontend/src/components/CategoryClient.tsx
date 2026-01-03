"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { productsApi, categoriesApi, Product, Category, PaginationMeta } from "@/lib/api";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { ProductSkeleton } from "@/components/ui/ProductSkeleton";
import { StoreSidebar } from "@/components/StoreSidebar";
import { ProductCard } from "@/components/ui/ProductCard";
import { seededShuffle } from "@/lib/random";

export function CategoryClient() {
    const { id } = useParams();
    const auth = useAuth(); 
    const { user, isAuthenticated, isLoading: authLoading } = auth;
    
    const router = useRouter();
    const [category, setCategory] = useState<Category | null>(null);
    const [allCategories, setAllCategories] = useState<Category[]>([]); // For Sidebar
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [imageIndices, setImageIndices] = useState<Record<string, number>>({});
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const { language } = useLanguage();

    const userLang = language || 'en';

    // Get user seed for randomization
    const [randomSeed, setRandomSeed] = useState<number>(0);

    useEffect(() => {
        if (user?.layout_seed) {
            setRandomSeed(user.layout_seed);
        } else {
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

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            
            try {
                setLoading(true);
                const categoryId = parseInt(Array.isArray(id) ? id[0] : id);
                
                // Fetch Current Category, Products, AND All Categories for Sidebar
                const [categoryRes, productsRes, allCategoriesRes] = await Promise.all([
                    categoriesApi.getById(categoryId, userLang as 'en' | 'ar'),
                    productsApi.getAll({ 
                        category_id: categoryId, 
                        locale: userLang as 'en' | 'ar',
                        page: 1,
                        per_page: 12
                    }),
                    categoriesApi.getAll(userLang as 'en' | 'ar')
                ]);

                if (categoryRes.success) {
                    setCategory(categoryRes.data);
                }
                if (allCategoriesRes.success) {
                    setAllCategories(allCategoriesRes.data);
                }
                if (productsRes.success) {
                    // Apply seeded shuffle to the fetched products
                    // Note: Pagination + Shuffle is tricky. 
                    // Ideally, backend should handle seeded random sort.
                    // For now, we shuffle the current page results which maintains "some" randomness
                    // consistent per user, but across pages it might not be perfect global shuffle.
                    // Given the requirement "keep the logic of order differs", client-side shuffle 
                    // of the page seems acceptable for the visual effect.
                    
                    const shuffledProducts = seededShuffle(productsRes.data, randomSeed + categoryId); 
                    setProducts(shuffledProducts);
                    
                    if (productsRes.meta) {
                        setMeta(productsRes.meta);
                    }
                }
            } catch (error) {
                console.error("Error fetching category data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated && id && randomSeed !== 0) {
            fetchData();
        }
    }, [id, isAuthenticated, userLang, randomSeed]);

    // Load more products
    const loadMore = async () => {
        if (!meta || meta.current_page >= meta.last_page || loadingMore) return;

        try {
            setLoadingMore(true);
            const categoryId = parseInt(Array.isArray(id) ? id[0] : id!);
            const nextPage = meta.current_page + 1;

            const response = await productsApi.getAll({
                category_id: categoryId,
                locale: userLang as 'en' | 'ar',
                page: nextPage,
                per_page: 12
            });

            if (response.success) {
                const shuffledNewProducts = seededShuffle(response.data, randomSeed + categoryId + nextPage);
                setProducts(prev => [...prev, ...shuffledNewProducts]);
                if (response.meta) {
                    setMeta(response.meta);
                }
            }
        } catch (error) {
            console.error("Error loading more products:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    // Auto-rotate product images
    useEffect(() => {
        if (products.length === 0) return;

        const interval = setInterval(() => {
            setImageIndices((prev) => {
                const newIndices = { ...prev };
                products.forEach((product) => {
                    const imageCount = product.images.length || 1;
                    newIndices[product.id.toString()] = ((newIndices[product.id.toString()] || 0) + 1) % imageCount;
                });
                return newIndices;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [products]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[var(--gold-primary)] border-r-transparent mb-4" />
                    <p className="text-[var(--text-secondary)]">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-700">
            <Navbar />

            <main className="flex-1 pb-20">
                <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-32">
                    <div className="flex flex-col lg:flex-row gap-8">
                        
                        {/* Sidebar - Right (RTL) or Left (LTR) depending on layout, but typically flex-row-reverse in RTL */}
                        <StoreSidebar 
                            categories={allCategories} 
                            activeCategoryId={category?.id}
                        />

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Header */}
                            <ScrollReveal direction="up">
                                <div className="mb-8 text-right">
                                    {loading && !category ? (
                                        <div className="h-8 bg-gray-200 dark:bg-gray-800 w-1/3 ml-auto rounded animate-pulse mb-2" />
                                    ) : (
                                        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2">
                                            {category?.name || (userLang === 'ar' ? 'الفئة' : 'Category')}
                                        </h1>
                                    )}
                                    
                                    {loading && !category ? (
                                        <div className="h-4 bg-gray-200 dark:bg-gray-800 w-1/2 ml-auto rounded animate-pulse" />
                                    ) : (
                                        <p className="text-[var(--text-secondary)] text-sm">
                                            {category?.description}
                                        </p>
                                    )}
                                </div>
                            </ScrollReveal>

                            {/* Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {loading ? (
                                    Array.from({ length: 6 }).map((_, idx) => (
                                        <ScrollReveal key={`skeleton-${idx}`} delay={0.1 * idx} direction="up">
                                            <ProductSkeleton />
                                        </ScrollReveal>
                                    ))
                                ) : products.length > 0 ? (
                                    products.map((product, idx) => (
                                        <ScrollReveal key={product.id} delay={0.05 * (idx % 12)} direction="up">
                                            <ProductCard 
                                                product={product} 
                                                imageIndex={imageIndices[product.id.toString()] || 0}
                                            />
                                        </ScrollReveal>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-12">
                                        <p className="text-[var(--text-secondary)]">
                                            {userLang === 'ar' ? 'لا توجد منتجات في هذا القسم حالياً' : 'No products found in this category.'}
                                        </p>
                                        <Link href="/home" className="mt-4 inline-block text-[var(--gold-primary)] hover:underline">
                                            {userLang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Load More */}
                            {meta && meta.current_page < meta.last_page && (
                                <div className="mt-12 text-center">
                                    <button
                                        onClick={loadMore}
                                        disabled={loadingMore}
                                        className="px-8 py-3 border border-[var(--gold-primary)] text-[var(--gold-primary)] hover:bg-[var(--gold-primary)] hover:text-black transition-colors rounded-full uppercase tracking-wider text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loadingMore ? (
                                            <span className="flex items-center gap-2">
                                                <span className="w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                                                {userLang === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                                            </span>
                                        ) : (
                                            userLang === 'ar' ? 'تحميل المزيد' : 'Load More'
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
