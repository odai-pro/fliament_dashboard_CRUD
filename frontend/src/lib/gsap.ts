"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export const useGsapContext = (scope: React.RefObject<HTMLDivElement | null>) => {
  const ctx = useLayoutEffect(() => {
    const ctx = gsap.context(() => {}, scope);
    return () => ctx.revert();
  }, [scope]);
  return ctx;
};

export { gsap, ScrollTrigger };
