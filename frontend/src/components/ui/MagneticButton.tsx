"use client";

import { useRef, useLayoutEffect } from "react";
import { gsap } from "@/lib/gsap";

interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export function MagneticButton({ children, className = "", onClick }: MagneticButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const button = buttonRef.current;
            if (!button) return;

            const xTo = gsap.quickTo(button, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
            const yTo = gsap.quickTo(button, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

            const handleMouseMove = (e: MouseEvent) => {
                const { clientX, clientY } = e;
                const { left, top, width, height } = button.getBoundingClientRect();
                const x = clientX - (left + width / 2);
                const y = clientY - (top + height / 2);

                xTo(x * 0.3);
                yTo(y * 0.3);
            };

            const handleMouseLeave = () => {
                xTo(0);
                yTo(0);
            };

            button.addEventListener("mousemove", handleMouseMove);
            button.addEventListener("mouseleave", handleMouseLeave);

            return () => {
                button.removeEventListener("mousemove", handleMouseMove);
                button.removeEventListener("mouseleave", handleMouseLeave);
            };
        }, buttonRef);
        return () => ctx.revert();
    }, []);

    return (
        <button ref={buttonRef} className={className} onClick={onClick}>
            {children}
        </button>
    );
}
