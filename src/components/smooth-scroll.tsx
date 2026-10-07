"use client";

/**
 * SmoothScroll — one Lenis instance for the whole page, driven by GSAP's
 * ticker so ScrollTrigger and Lenis share a single clock (no fighting
 * scroll listeners, no jank on trackpads).
 *
 * Behaviour:
 *   - prefers-reduced-motion: Lenis never starts; native scroll + the
 *     CSS scroll-behavior rules take over, ScrollTrigger still works.
 *   - In-page anchors (#waitlist, #how-it-works…) are routed through
 *     lenis.scrollTo so they glide instead of teleporting.
 *   - Everything is torn down on unmount — no leaked rAF loops.
 */

import { useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const HEADER_OFFSET = 96; // sticky header height + breathing room

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // Still register ScrollTrigger so section triggers work with native scroll.
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000); // gsap ticker gives seconds; lenis wants ms
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Glide to in-page anchors instead of the browser's instant jump.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, {
        offset: -HEADER_OFFSET,
        duration: 1.15,
      });
      history.replaceState(null, "", id);
    };

    document.addEventListener("click", onClick);

    // Fonts/images settling can shift layout; keep triggers honest.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch(() => {});

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
