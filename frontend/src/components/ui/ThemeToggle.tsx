"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useTheme } from "../ThemeProvider";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const sunRef = useRef<HTMLDivElement>(null);
    const moonRef = useRef<HTMLDivElement>(null);
    const moonBodyRef = useRef<HTMLDivElement>(null);
    const [isPressed, setIsPressed] = useState(false);

    // Animate theme change
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (theme === "dark") {
                // Moon active - animate rotation
                gsap.to(moonRef.current, {
                    scale: 1,
                    opacity: 1,
                    rotate: 0,
                    duration: 0.6,
                    ease: "back.out(1.7)",
                });
                gsap.to(moonBodyRef.current, {
                    rotate: -15,
                    duration: 1.5,
                    yoyo: true,
                    repeat: -1,
                    ease: "sine.inOut",
                });
                gsap.to(sunRef.current, {
                    scale: 0,
                    opacity: 0,
                    rotate: 180,
                    duration: 0.5,
                    ease: "back.in(1.7)",
                });
            } else {
                // Sun active
                gsap.to(sunRef.current, {
                    scale: 1,
                    opacity: 1,
                    rotate: 0,
                    duration: 0.6,
                    ease: "back.out(1.7)",
                });
                gsap.to(moonRef.current, {
                    scale: 0,
                    opacity: 0,
                    rotate: -180,
                    duration: 0.5,
                    ease: "back.in(1.7)",
                });
            }
        });

        return () => ctx.revert();
    }, [theme]);

    // Press effect
    useLayoutEffect(() => {
        const activeRef = theme === "dark" ? moonRef : sunRef;
        gsap.to(activeRef.current, {
            scale: isPressed ? 0.85 : 1,
            duration: 0.2,
            ease: "power2.out",
        });
    }, [isPressed, theme]);

    return (
        <button
            onClick={toggleTheme}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--glass-bg)] backdrop-blur-md transition-all hover:border-[var(--gold-primary)] hover:shadow-lg"
            aria-label="Toggle theme"
        >
            {/* Sun */}
            <div ref={sunRef} className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                    {/* Sun core - BIGGER */}
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/50" />

                    {/* Sun rays */}
                    <div className="absolute inset-0 animate-spin-slow">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400 shadow-sm shadow-yellow-300"
                                style={{
                                    transform: `rotate(${i * 45}deg) translateY(-14px)`,
                                    animationDelay: `${i * 0.1}s`,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Moon - BIGGER & ANIMATED */}
            <div ref={moonRef} className="absolute inset-0 flex items-center justify-center">
                <div ref={moonBodyRef} className="relative h-7 w-7">
                    {/* Moon with crater effect - BIGGER */}
                    <div className="h-full w-full rounded-full bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 shadow-lg shadow-slate-500/30" />
                    <div className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-slate-500/40" />
                    <div className="absolute bottom-1.5 left-1.5 h-2 w-2 rounded-full bg-slate-500/30" />
                    <div className="absolute right-2 bottom-2 h-1.5 w-1.5 rounded-full bg-slate-500/25" />

                    {/* Stars around moon - ANIMATED */}
                    <div className="absolute inset-0">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute h-1.5 w-1.5 rounded-full bg-yellow-300 animate-pulse shadow-sm shadow-yellow-200"
                                style={{
                                    top: `${[10, 80, 30, 70][i]}%`,
                                    left: `${[5, 85, 95, 15][i]}%`,
                                    animationDelay: `${i * 0.4}s`,
                                    animationDuration: "2s",
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </button>
    );
}
