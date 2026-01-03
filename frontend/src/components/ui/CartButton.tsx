"use client";

import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useEffect, useRef } from "react";

export function CartButton() {
    const { cartCount, setCartPosition, openCart } = useCart();
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const updatePosition = () => {
            if (buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                setCartPosition({ 
                    x: rect.left + rect.width / 2, 
                    y: rect.top + rect.height / 2 
                });
            }
        };

        updatePosition();
        window.addEventListener("resize", updatePosition);
        return () => window.removeEventListener("resize", updatePosition);
    }, [setCartPosition]);

    return (
        <button
            ref={buttonRef}
            onClick={openCart}
            className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--glass-bg)] backdrop-blur-md transition-all hover:border-[var(--gold-primary)] hover:shadow-lg"
            aria-label="Shopping Cart"
        >
            <div className="relative h-5 w-5">
                {/* Handle - Behind Bag */}
                <motion.div
                    className="absolute left-1/2 -top-2.5 h-4 w-3 -translate-x-1/2 rounded-t-full border-[2px] border-stone-400 dark:border-stone-500"
                    initial={{ y: 0 }}
                    whileHover={{ y: -2, scaleY: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                />
                
                {/* Bag Body */}
                <motion.div
                    className="relative h-full w-full rounded-[4px] bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 shadow-md shadow-amber-900/10 dark:shadow-black/30"
                    initial={{ scale: 1 }}
                    whileHover={{ 
                        scale: 1.05,
                        rotate: [0, -5, 5, 0],
                        transition: { 
                            rotate: { duration: 0.4, ease: "easeInOut" }
                        }
                    }}
                >
                    {/* Bag Details - Flap/Fold */}
                    <div className="absolute left-0 top-0 h-2 w-full rounded-t-[4px] bg-gradient-to-b from-white/20 to-transparent" />
                    
                    {/* Shine Reflection */}
                    <div className="absolute left-1 top-1.5 h-2 w-2 rounded-full bg-white/50 blur-[1px]" />
                    
                    {/* Gold Logo/Stud */}
                    <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-100 shadow-sm" />
                </motion.div>

                {/* Badge - Floating Gem */}
                <motion.div
                    key={cartCount} // Triggers animation on change
                    className="absolute -right-2 -top-3 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-700 shadow-sm shadow-red-900/30 text-[9px] font-bold text-white ring-1 ring-white/30"
                    initial={{ scale: 0.5, y: 5 }}
                    animate={{ scale: 1, y: 0 }}
                    whileHover={{ scale: 1.2, y: -2 }}
                >
                    {cartCount}
                </motion.div>
            </div>
        </button>
    );
}

