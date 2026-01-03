"use client";

import Link from "next/link";
import { Category } from "@/lib/api";
import { useLanguage } from "@/components/LanguageProvider";

interface StoreSidebarProps {
    categories: Category[];
    activeCategoryId?: number | 'all';
}

export function StoreSidebar({ categories, activeCategoryId }: StoreSidebarProps) {
    const { language } = useLanguage();
    const isRtl = language === 'ar';

    return (
        <aside className="w-full lg:w-72 flex-shrink-0 mb-8 lg:mb-0 lg:sticky lg:top-32 h-fit">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-bold text-[var(--gold-primary)] mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                    {language === 'ar' ? 'المجموعات الحصرية' : 'Exclusive Collections'}
                </h2>

                <nav className="space-y-2">
                    {/* All Designs Link */}
                    <Link
                        href="/home" // Assuming /home is the main shop view, or we could make a /shop route
                        className={`block w-full text-right px-4 py-3 rounded-xl transition-all duration-200 font-bold ${
                            activeCategoryId === 'all'
                                ? 'bg-[var(--gold-primary)] text-black shadow-md'
                                : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300'
                        }`}
                    >
                        {language === 'ar' ? 'جميع التصاميم' : 'All Designs'}
                    </Link>

                    {/* Categories List */}
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/category/${category.id}`}
                            className={`block w-full text-right px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                                activeCategoryId === category.id
                                    ? 'bg-[var(--gold-primary)]/10 text-[var(--gold-primary)] border border-[var(--gold-primary)]/20'
                                    : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400'
                            }`}
                        >
                            {category.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </aside>
    );
}


