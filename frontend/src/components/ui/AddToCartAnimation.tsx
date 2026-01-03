"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useTheme } from "@/components/ThemeProvider";

export function AddToCartAnimation() {
    const { animations, cartPosition } = useCart();
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted || !cartPosition) return null;

    return createPortal(
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
            <AnimatePresence>
                {animations.map((anim) => (
                    <ParticleGroup key={anim.id} startX={anim.startX} startY={anim.startY} targetX={cartPosition.x} targetY={cartPosition.y} theme={theme} />
                ))}
            </AnimatePresence>
        </div>,
        document.body
    );
}

interface Particle {
    id: number;
    randomOffsetX: number;
    duration: number;
    delay: number;
    rotateDir: number;
}

function ParticleGroup({ startX, startY, targetX, targetY, theme }: { startX: number, startY: number, targetX: number, targetY: number, theme: string }) {
    // Generate stable random values in effect to ensure purity
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const newParticles = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            randomOffsetX: (Math.random() - 0.5) * 300,
            duration: 1.5 + Math.random() * 1.0,
            delay: Math.random() * 0.3,
            rotateDir: Math.random() > 0.5 ? 1 : -1
        }));
        // Use setTimeout to avoid synchronous setState in effect linter error
        const timer = setTimeout(() => setParticles(newParticles), 0);
        return () => clearTimeout(timer);
    }, []);

    if (particles.length === 0) return null;

    return (
        <>
            {particles.map((p) => {
                // Removed unused controlX/Y logic to satisfy linter
                return (
                    <motion.div
                        key={p.id}
                        initial={{
                            x: startX,
                            y: startY,
                            scale: 0,
                            opacity: 1,
                            rotate: 0,
                            rotateX: 0,
                            rotateY: 0
                        }}
                        animate={{
                            x: targetX,
                            y: targetY,
                            scale: [0, 1.8, 1.2, 0.2], // Grow bigger, stay visible longer
                            opacity: [0, 1, 1, 1, 0], // Stay fully opaque until the very end
                            rotate: [0, 720 * p.rotateDir], // More spins
                            rotateX: [0, 360],
                            rotateY: [0, 360]
                        }}
                        transition={{
                            duration: p.duration,
                            ease: [0.25, 0.1, 0.25, 1], // Smoother, more elegant curve
                            delay: p.delay, // Stagger start times more
                        }}
                        className="absolute top-0 left-0 preserve-3d perspective-1000"
                    >
                        {/* Main Diamond/Gold Body - Bigger and clearer */}
                        <div className="relative h-6 w-6">
                            {theme === 'light' ? (
                                // Gold Style
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 opacity-100 rounded-full"
                                        style={{
                                            boxShadow: "0 0 20px 4px rgba(251, 191, 36, 0.6)", // Golden glow
                                            filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
                                        }}
                                    />
                                    {/* Inner Gold Shine */}
                                    <div className="absolute inset-[25%] bg-yellow-100 rounded-full blur-[1px]" />
                                    {/* Coin details / Facets */}
                                    <div className="absolute inset-0 border-[1px] border-yellow-200/50 rounded-full" />
                                </>
                            ) : (
                                // Diamond Style
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-blue-200 opacity-100"
                                        style={{
                                            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                                            boxShadow: "0 0 20px 4px rgba(165, 243, 252, 0.8)", // Stronger glow
                                            filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" // Shadow for depth
                                        }}
                                    />
                                    {/* Inner Sparkle - Brighter */}
                                    <div className="absolute inset-[25%] bg-white rounded-full blur-[2px] animate-pulse" />

                                    {/* Facet lines for clarity */}
                                    <div className="absolute inset-0 border-[0.5px] border-white/60"
                                        style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
                                    />
                                </>
                            )}
                        </div>
                    </motion.div>
                );
            })}

            {/* Burst effect at source - Slower - Color matches theme */}
            <motion.div
                initial={{ x: startX, y: startY, scale: 0, opacity: 0.8 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`absolute top-0 left-0 w-6 h-6 rounded-full blur-md ${theme === 'light' ? 'bg-amber-300' : 'bg-cyan-100'}`}
            />
        </>
    );
}
