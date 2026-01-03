"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        // Initial set
        gsap.set(cursor, { xPercent: -50, yPercent: -50 });

        const xTo = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3.out" });
        const yTo = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3.out" });

        const handleMouseMove = (e: MouseEvent) => {
            xTo(e.clientX);
            yTo(e.clientY);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === "BUTTON" || target.tagName === "A" || target.closest("button") || target.closest("a")) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, []);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        gsap.to(cursor, {
            scale: isHovering ? 2.5 : 1,
            opacity: isHovering ? 0.5 : 1,
            duration: 0.3,
            ease: "power2.out"
        });
    }, [isHovering]);

    return (
        <div
            ref={cursorRef}
            className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-8 w-8 items-center justify-center rounded-full border border-[var(--gold-primary)] bg-[var(--gold-primary)]/10 backdrop-blur-sm md:flex"
            style={{ mixBlendMode: "difference" }}
        >
            <div className="h-1 w-1 rounded-full bg-[var(--gold-primary)]" />
        </div>
    );
}
