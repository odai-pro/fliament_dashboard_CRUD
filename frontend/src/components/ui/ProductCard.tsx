"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/components/LanguageProvider";
import { useTranslation } from "@/lib/translations";

interface ProductCardProps {
    product: Product;
    imageIndex: number;
}

export function ProductCard({ product, imageIndex = 0 }: ProductCardProps) {
    const { addToCart, triggerAnimation } = useCart();
    const { language } = useLanguage();
    const t = useTranslation(language || 'en');

    // Image handling
    const productImages = product.images?.length > 0
        ? product.images
        : (product.preview_images?.length > 0
            ? product.preview_images
            : []);

    const currentImage = productImages[imageIndex % productImages.length] || productImages[0];
    const fallbackImage = 'https://placehold.co/600x600/e2e8f0/1e293b?text=No+Image';

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation if wrapped in Link
        addToCart(product);
        triggerAnimation({ x: e.clientX, y: e.clientY });
    };

    return (
        <div className="group relative flex flex-col h-full rounded-[2rem] bg-white dark:bg-[#1a1a1a] shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-transparent hover:border-[var(--gold-primary)]/30">
            {/* Image Container */}
            <Link href={`/products/${product.id}`} className="block relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-t-[2rem]">
                {currentImage ? (
                    <Image
                        src={currentImage}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.srcset = "";
                            target.src = fallbackImage;
                        }}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <span className="text-sm">No Image</span>
                    </div>
                )}

                {/* Optional: Badge or Tag */}
                {product.is_featured && (
                    <div className="absolute top-3 left-3 bg-[var(--gold-primary)] text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        FEATURED
                    </div>
                )}
            </Link>

            {/* Content */}
            <div className="flex-1 flex flex-col p-5 text-center">
                {/* Title */}
                <Link href={`/products/${product.id}`} className="block">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 hover:text-[var(--gold-primary)] transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Description */}
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-6 leading-relaxed">
                    {product.description}
                </p>

                {/* Spacer to push details to bottom */}
                <div className="mt-auto space-y-4">
                    {/* Details Row: Weight & Carat */}
                    <div className="flex items-center justify-center gap-8 text-sm">
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] text-gray-400 uppercase mb-0.5">{t.weight}</span>
                            <span className="font-bold text-gray-800 dark:text-gray-200">
                                {product.weight ? `${product.weight} g` : 'N/A'}
                            </span>
                        </div>

                        {/* Divider */}
                        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>

                        <div className="flex flex-col items-center">
                            <span className="text-[10px] text-gray-400 uppercase mb-0.5">{t.carat || 'Carat'}</span>
                            <span className="font-bold text-gray-800 dark:text-gray-200">
                                21k
                            </span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleAddToCart}
                        className="w-full py-3 bg-[#e6cfa0] hover:bg-[#d4b880] dark:bg-[#c8a660] dark:hover:bg-[#b5934b] text-[#5c4d2e] dark:text-black font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                        <span className="text-lg">+</span>
                        {language === 'ar' ? 'مضاف بالفعل' : 'Add to Cart'}
                        {/* Note: The image showed "مضاف بالفعل" style but implied "Add to cart". I'll use standard text */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70">
                            <path d="M9 20C9 21.1046 8.10457 22 7 22C5.89543 22 5 21.1046 5 20C5 18.8954 5.89543 18 7 18C8.10457 18 9 18.8954 9 20Z" fill="currentColor" />
                            <path d="M21 20C21 21.1046 20.1046 22 19 22C17.8954 22 17 21.1046 17 20C17 18.8954 17.8954 18 19 18C20.1046 18 21 18.8954 21 20Z" fill="currentColor" />
                            <path d="M1 1H4.63625L5.63625 3M5.63625 3L7.63625 13H19.6363L21.6363 3H5.63625Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}


