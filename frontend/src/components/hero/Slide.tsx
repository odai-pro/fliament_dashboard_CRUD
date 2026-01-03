"use client";

import { useRef, useLayoutEffect } from "react";
import { gsap } from "@/lib/gsap";
import Image from "next/image";

interface SlideProps {
    active: boolean;
    data: {
        id: number;
        title: string;
        subtitle: string;
        image: string; // Background/Main image
        layer2?: string; // Mid layer
        layer3?: string; // Foreground layer
    };
    mousePos: { x: number; y: number };
}

export function Slide({ active, data, mousePos }: SlideProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const midRef = useRef<HTMLDivElement>(null);
    const fgRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    // Parallax Effect
    useLayoutEffect(() => {
        if (!active) return;

        const ctx = gsap.context(() => {
            // Map mouse position (-1 to 1) to movement
            // Background moves slightly opposite
            gsap.to(bgRef.current, {
                x: -mousePos.x * 20,
                y: -mousePos.y * 20,
                duration: 1,
                ease: "power2.out"
            });

            // Mid layer moves more
            gsap.to(midRef.current, {
                x: mousePos.x * 40,
                y: mousePos.y * 40,
                rotateY: mousePos.x * 5,
                rotateX: -mousePos.y * 5,
                duration: 1,
                ease: "power2.out"
            });

            // Foreground moves most
            gsap.to(fgRef.current, {
                x: mousePos.x * 80,
                y: mousePos.y * 80,
                duration: 1,
                ease: "power2.out"
            });

        }, containerRef);
        return () => ctx.revert();
    }, [mousePos, active]);

    // Enter/Exit Animations
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (active) {
                // Enter
                gsap.fromTo(containerRef.current,
                    { opacity: 0, scale: 1.1, filter: "blur(10px)" },
                    { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out" }
                );

                gsap.fromTo(textRef.current,
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: "power3.out" }
                );
            } else {
                // Exit
                gsap.to(containerRef.current, {
                    opacity: 0,
                    scale: 1.05,
                    filter: "blur(10px)",
                    duration: 0.8,
                    ease: "power3.in"
                });
            }
        }, containerRef);
        return () => ctx.revert();
    }, [active]);

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 h-full w-full overflow-hidden ${active ? "z-10 pointer-events-auto" : "z-0 pointer-events-none"}`}
        >
            {/* Background Layer */}
            <div ref={bgRef} className="absolute inset-0 scale-110">
                <Image
                    src={data.image}
                    alt={data.title}
                    fill
                    sizes="100vw"
                    className="object-cover opacity-60"
                    priority={active}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

            {/* Mid Layer (Main Subject) */}
            <div ref={midRef} className="absolute inset-0 flex items-center justify-center perspective-1000">
                {data.layer2 && (
                    <div className="relative h-[50vh] w-[50vh] md:h-[70vh] md:w-[70vh]">
                        <Image
                            src={data.layer2}
                            alt={data.title}
                            fill
                            sizes="(max-width: 768px) 50vh, 70vh"
                            className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                            priority={active}
                        />
                    </div>
                )}
            </div>

            {/* Foreground Layer (Particles/Effects) */}
            <div ref={fgRef} className="absolute inset-0 pointer-events-none mix-blend-screen">
                {data.layer3 && (
                    <Image
                        src={data.layer3}
                        alt=""
                        fill
                        sizes="100vw"
                        className="object-cover opacity-50"
                    />
                )}
            </div>

            {/* Text Content - Lifted up slightly to avoid nav overlap */}
            <div ref={textRef} className="absolute bottom-32 left-6 md:left-20 md:bottom-24 max-w-2xl z-20 pointer-events-none">
                <p className="text-[var(--gold-primary)] text-xs md:text-sm uppercase tracking-[0.4em] mb-4">{data.subtitle}</p>
                <h2 className="text-white font-serif text-4xl md:text-7xl leading-tight mb-6">
                    {data.title}
                </h2>
                <button className="pointer-events-auto group relative overflow-hidden rounded-full border border-[var(--gold-primary)] px-8 py-3 text-xs md:text-sm uppercase tracking-[0.2em] text-[var(--gold-primary)] transition-colors hover:bg-[var(--gold-primary)] hover:text-black">
                    <span className="relative z-10">Explore Collection</span>
                </button>
            </div>
        </div>
    );
}
