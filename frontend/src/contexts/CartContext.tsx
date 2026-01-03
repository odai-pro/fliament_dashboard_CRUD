"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, cartApi } from '@/lib/api';
import { useLanguage } from "@/components/LanguageProvider";

export interface CartItem extends Product {
    quantity: number;
    cart_item_id?: number; // ID from backend DB
}

export interface AnimationEvent {
    id: number;
    startX: number;
    startY: number;
}

export interface Coupon {
    code: string;
    type: 'percent' | 'fixed';
    value: number;
}

interface CartContextType {
    items: CartItem[];
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartSubtotal: number;
    cartTotal: number;
    coupon: Coupon | null;
    applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
    removeCoupon: () => void;
    discountAmount: number;
    animations: AnimationEvent[];
    triggerAnimation: (startPos: { x: number; y: number }) => void;
    cartPosition: { x: number; y: number } | null;
    setCartPosition: (pos: { x: number; y: number }) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [coupon, setCoupon] = useState<Coupon | null>(null);
    const [animations, setAnimations] = useState<AnimationEvent[]>([]);
    const [cartPosition, setCartPosition] = useState<{ x: number; y: number } | null>(null);
    const [backendTotals, setBackendTotals] = useState<{
        subtotal: number;
        total: number;
        discount_amount: number;
    } | null>(null);
    const { language } = useLanguage();

    // Load cart from API on mount
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await cartApi.getCart(language);
                if (response && response.items) {
                    setItems(response.items);
                    // Use coupon data from backend response
                    if (response.coupon && response.coupon.code) {
                        setCoupon({
                            code: response.coupon.code,
                            type: response.coupon.type,
                            value: response.coupon.value,
                        });
                    } else {
                        setCoupon(null);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch cart:", error);
            }
        };
        fetchCart();
    }, [language]);

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);

    const addToCart = async (product: Product) => {
        // Optimistic UI Update
        setItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });

        try {
            const response = await cartApi.addToCart(product.id, 1, language);
            if (response && response.items) {
                setItems(response.items);
            }
        } catch (error) {
            console.error("Failed to add to cart:", error);
            // Revert on error? (Complexity trade-off)
        }
    };

    const updateQuantity = async (productId: number, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }

        // Optimistic UI
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );

        try {
            const response = await cartApi.updateQuantity(productId, quantity, language);
            if (response && response.items) {
                setItems(response.items);
            }
        } catch (error) {
            console.error("Failed to update quantity:", error);
        }
    };

    const removeFromCart = async (productId: number) => {
        // Optimistic UI
        setItems(prevItems => prevItems.filter(item => item.id !== productId));

        try {
            const response = await cartApi.removeFromCart(productId, language);
            if (response && response.items) {
                setItems(response.items);
            }
        } catch (error) {
            console.error("Failed to remove from cart:", error);
        }
    };

    const clearCart = async () => {
        setItems([]);
        setCoupon(null);
        try {
            await cartApi.clearCart(language);
        } catch (error) {
            console.error("Failed to clear cart:", error);
        }
    };

    const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await cartApi.applyCoupon(code, language);
            if (response && response.success && response.coupon) {
                // Use coupon data from backend
                setCoupon({
                    code: response.coupon.code,
                    type: response.coupon.type,
                    value: response.coupon.value,
                });
                return { 
                    success: true, 
                    message: language === 'ar' ? 'تم تطبيق الكوبون بنجاح' : 'Coupon applied successfully!' 
                };
            }
            return { 
                success: false, 
                message: response?.message || (language === 'ar' ? 'كود الكوبون غير صالح' : 'Invalid coupon code.') 
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message 
                || (language === 'ar' ? 'فشل تطبيق الكوبون' : 'Failed to apply coupon.');
            return { success: false, message: errorMessage };
        }
    };

    const removeCoupon = async () => {
        setCoupon(null);
        try {
            await cartApi.removeCoupon(language);
        } catch (error) {
            console.error("Failed to remove coupon:", error);
        }
    };

    const triggerAnimation = (startPos: { x: number; y: number }) => {
        const id = Date.now() + Math.random();
        setAnimations(prev => [...prev, { id, startX: startPos.x, startY: startPos.y }]);
        
        setTimeout(() => {
            setAnimations(prev => prev.filter(anim => anim.id !== id));
        }, 3000);
    };

    const cartCount = items.reduce((total, item) => total + item.quantity, 0);
    
    // Fetch totals from backend when cart changes
    useEffect(() => {
        const fetchTotals = async () => {
            try {
                const response = await cartApi.getCart(language);
                if (response && response.subtotal !== undefined) {
                    setBackendTotals({
                        subtotal: response.subtotal || 0,
                        total: response.total || 0,
                        discount_amount: response.discount_amount || 0,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch cart totals:", error);
            }
        };
        fetchTotals();
    }, [items, coupon, language]);

    // Use backend totals if available, otherwise calculate locally
    const cartSubtotal = backendTotals?.subtotal ?? items.reduce((total, item) => total + (item.final_price * item.quantity), 0);
    const discountAmount = backendTotals?.discount_amount ?? (coupon ? (coupon.type === 'percent' 
        ? cartSubtotal * (coupon.value / 100) 
        : Math.min(coupon.value, cartSubtotal)) : 0);
    const cartTotal = backendTotals?.total ?? (cartSubtotal - discountAmount);

    return (
        <CartContext.Provider value={{
            items,
            isOpen,
            openCart,
            closeCart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartSubtotal,
            cartTotal,
            coupon,
            applyCoupon,
            removeCoupon,
            discountAmount,
            animations,
            triggerAnimation,
            cartPosition,
            setCartPosition
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
