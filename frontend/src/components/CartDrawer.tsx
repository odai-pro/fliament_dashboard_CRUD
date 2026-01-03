"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, CartItem } from "@/contexts/CartContext";
import { useLanguage } from "@/components/LanguageProvider";
import { useTranslation } from "@/lib/translations";
import Link from "next/link";

export function CartDrawer() {
    const {
        isOpen,
        closeCart,
        items,
        updateQuantity,
        removeFromCart,
        cartSubtotal,
        cartTotal,
        coupon,
        applyCoupon,
        removeCoupon,
        discountAmount
    } = useCart();
    const { language } = useLanguage();
    const t = useTranslation(language);
    const [mounted, setMounted] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [couponMessage, setCouponMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleApplyCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!couponCode.trim()) return;

        setIsApplyingCoupon(true);
        setCouponMessage(null);


        // Removed artificial delay

        const result = await applyCoupon(couponCode);
        if (result.success) {
            setCouponMessage({ text: language === 'ar' ? 'تم تطبيق الخصم بنجاح' : result.message, type: 'success' });
            setCouponCode("");
        } else {
            setCouponMessage({ text: language === 'ar' ? 'كود الخصم غير صالح' : result.message, type: 'error' });
        }
        setIsApplyingCoupon(false);
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: language === 'ar' ? '-100%' : '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: language === 'ar' ? '-100%' : '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className={`fixed top-0 bottom-0 ${language === 'ar' ? 'left-0' : 'right-0'} z-[101] w-full max-w-md bg-[var(--bg-secondary)] shadow-2xl border-x border-[var(--border-color)] flex flex-col`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
                            <h2 className="text-xl font-serif font-bold text-[var(--text-primary)]">
                                {language === 'ar' ? 'سلة المشتريات' : 'Shopping Cart'}
                                <span className="text-sm font-normal text-[var(--text-secondary)] mx-2">
                                    ({items.length} {language === 'ar' ? 'منتج' : 'items'})
                                </span>
                            </h2>
                            <button
                                onClick={closeCart}
                                className="p-2 rounded-full hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-20 h-20 rounded-full bg-[var(--bg-primary)] flex items-center justify-center">
                                        <svg className="w-10 h-10 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <p className="text-[var(--text-secondary)] text-lg">
                                        {language === 'ar' ? 'سلة المشتريات فارغة' : 'Your cart is empty'}
                                    </p>
                                    <button
                                        onClick={closeCart}
                                        className="px-6 py-2 bg-[var(--gold-primary)] text-black font-semibold rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        {language === 'ar' ? 'تصفح المنتجات' : 'Start Shopping'}
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4 bg-[var(--glass-bg)] p-4 rounded-xl border border-[var(--border-color)]">
                                        {/* Image */}
                                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            <img
                                                src={item.images?.[0] || item.preview_images?.[0] || 'https://placehold.co/100x100'}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-medium text-[var(--text-primary)] line-clamp-2 text-sm">
                                                    {item.name}
                                                </h3>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-red-500 hover:text-red-600 p-1"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <div className="flex justify-between items-end mt-2">
                                                <div className="flex items-center border border-[var(--border-color)] rounded-lg overflow-hidden">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="px-2 py-1 hover:bg-[var(--bg-primary)] text-[var(--text-secondary)]"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-2 py-1 text-sm font-medium min-w-[2rem] text-center text-[var(--text-primary)]">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="px-2 py-1 hover:bg-[var(--bg-primary)] text-[var(--text-secondary)]"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <p className="font-bold text-[var(--gold-primary)]">
                                                    ${(item.final_price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 bg-[var(--bg-primary)] border-t border-[var(--border-color)] space-y-4">
                                {/* Coupon Input */}
                                <div>
                                    {coupon ? (
                                        <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 p-3 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm font-medium text-green-500">
                                                    {coupon.code} ({coupon.type === 'percent' ? `${coupon.value}%` : `$${coupon.value}`})
                                                </span>
                                            </div>
                                            <button
                                                onClick={removeCoupon}
                                                className="text-xs text-red-500 hover:underline"
                                            >
                                                {language === 'ar' ? 'إزالة' : 'Remove'}
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleApplyCoupon} className="relative">
                                            <input
                                                type="text"
                                                placeholder={language === 'ar' ? 'أدخل كود الخصم' : 'Enter coupon code'}
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg py-3 px-4 pr-24 focus:outline-none focus:border-[var(--gold-primary)] transition-colors text-sm"
                                            />
                                            <button
                                                type="submit"
                                                disabled={isApplyingCoupon || !couponCode.trim()}
                                                className="absolute right-1 top-1 bottom-1 px-4 bg-[var(--gold-primary)] text-black text-xs font-bold rounded-md disabled:opacity-50 hover:opacity-90 transition-opacity"
                                            >
                                                {isApplyingCoupon ? (
                                                    <span className="animate-pulse">...</span>
                                                ) : (
                                                    language === 'ar' ? 'تطبيق' : 'APPLY'
                                                )}
                                            </button>
                                        </form>
                                    )}
                                    {couponMessage && !coupon && (
                                        <p className={`text-xs mt-2 ${couponMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                            {couponMessage.text}
                                        </p>
                                    )}
                                </div>

                                {/* Summary */}
                                <div className="space-y-2 pt-4 border-t border-[var(--border-color)]">
                                    <div className="flex justify-between text-[var(--text-secondary)] text-sm">
                                        <span>{language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                                        <span>${cartSubtotal.toFixed(2)}</span>
                                    </div>
                                    {discountAmount > 0 && (
                                        <div className="flex justify-between text-green-500 text-sm">
                                            <span>{language === 'ar' ? 'الخصم' : 'Discount'}</span>
                                            <span>-${discountAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-[var(--text-primary)] font-bold text-lg pt-2">
                                        <span>{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <Link
                                    href="/checkout"
                                    onClick={closeCart}
                                    className="block w-full py-4 bg-gradient-to-r from-[var(--gold-primary)] to-[var(--gold-secondary)] text-black font-bold text-center rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[var(--gold-primary)]/20"
                                >
                                    {language === 'ar' ? 'إتمام الطلب' : 'Checkout Now'}
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}


