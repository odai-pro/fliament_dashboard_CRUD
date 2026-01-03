"use client";

import { useState, useRef } from "react";
import { Slide } from "./Slide";
import { CustomCursor } from "../ui/CustomCursor";

const SLIDES = [
    {
        id: 1,
        title: "Ethereal Radiance",
        subtitle: "The 2025 Collection",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop",
        layer2: "https://pngimg.com/d/diamond_PNG6696.png",
    },
    {
        id: 2,
        title: "Elegance",
        subtitle: "Crafted for Eternity",
        image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1974&auto=format&fit=crop",
    },
    {
        id: 3,
        title: "Midnight Velvet",
        subtitle: "Limited Edition",
        image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1974&auto=format&fit=crop",
        layer2: "https://pngimg.com/d/necklace_PNG68.png",
    },
    {
        id: 4,
        title: "Luxury Collection",
        subtitle: "Exclusive Designs",
        image: "/slider-2.png",
        layer2: "https://pngimg.com/d/diamond_PNG6696.png",
    },
];

export function HeroSlider() {
    const [activeSlide, setActiveSlide] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const touchStart = useRef(0);
    const touchEnd = useRef(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { width, height, left, top } = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        setMousePos({ x, y });
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStart.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEnd.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStart.current || !touchEnd.current) return;
        const distance = touchStart.current - touchEnd.current;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            nextSlide();
        }
        if (isRightSwipe) {
            prevSlide();
        }

        touchStart.current = 0;
        touchEnd.current = 0;
    };

    const nextSlide = () => {
        setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    };

    const prevSlide = () => {
        setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    };

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative h-[60vh] md:h-screen w-full overflow-hidden bg-black"
        >
            <CustomCursor />

            {/* Slides */}
            {SLIDES.map((slide, index) => (
                <Slide
                    key={slide.id}
                    active={index === activeSlide}
                    data={slide}
                    mousePos={mousePos}
                />
            ))}

            {/* Navigation - Moved away from text content */}
            <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-30 flex gap-4">
                <button
                    onClick={prevSlide}
                    className="group flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-full border border-white/20 bg-black/20 backdrop-blur-md transition-all hover:border-[var(--gold-primary)] hover:bg-[var(--gold-primary)] hover:text-black"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform group-hover:-translate-x-1 md:w-6 md:h-6">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={nextSlide}
                    className="group flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-full border border-white/20 bg-black/20 backdrop-blur-md transition-all hover:border-[var(--gold-primary)] hover:bg-[var(--gold-primary)] hover:text-black"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform group-hover:translate-x-1 md:w-6 md:h-6">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Pagination */}
            <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-30 flex gap-3">
                {SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveSlide(index)}
                        className={`h-1.5 md:h-2 rounded-full transition-all duration-500 ${index === activeSlide
                                ? "w-6 md:w-10 bg-[var(--gold-primary)] shadow-[0_0_10px_var(--gold-primary)]"
                                : "w-1.5 md:w-2 bg-white/30 hover:bg-white/60"
                            }`}
                    />
                ))}
            </div>

            {/* Gold Shimmer Overlay */}
            <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-transparent via-[var(--gold-primary)]/10 to-transparent opacity-0 mix-blend-overlay" />
        </section>
    );
}
