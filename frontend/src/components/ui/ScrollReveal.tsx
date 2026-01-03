"use client";

import { useRef, useLayoutEffect } from "react";
import { gsap } from "@/lib/gsap";

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "left" | "right" | "none";
}

export function ScrollReveal({ children, className = "", delay = 0, direction = "up" }: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            let y = 0;
            let x = 0;

            if (direction === "up") y = 50;
            if (direction === "left") x = -50;
            if (direction === "right") x = 50;

            gsap.fromTo(
                ref.current,
                {
                    opacity: 0,
                    y: y,
                    x: x
                },
                {
                    opacity: 1,
                    y: 0,
                    x: 0,
                    duration: 1,
                    ease: "power3.out",
                    delay: delay,
                    scrollTrigger: {
                        trigger: ref.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }, ref);
        return () => ctx.revert();
    }, [delay, direction]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}
