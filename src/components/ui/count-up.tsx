"use client";

import { useEffect, useRef, useState } from "react";

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Counts a figure up once, the first time it enters the viewport.
 * Respects prefers-reduced-motion by rendering the final value immediately.
 */
export function CountUp({
  value,
  duration = 900,
  format,
  className = "",
}: {
  value: number;
  duration?: number;
  format: (n: number) => string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (prefersReducedMotion() || typeof requestAnimationFrame === "undefined") {
      setDisplay(value);
      return;
    }

    setDisplay(0);
    let frame = 0;
    let startedAt = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();

          const step = (now: number) => {
            if (!startedAt) startedAt = now;
            const progress = Math.min(1, (now - startedAt) / duration);
            setDisplay(value * easeOutCubic(progress));
            if (progress < 1) frame = requestAnimationFrame(step);
            else setDisplay(value);
          };

          frame = requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={`tnum ${className}`.trim()}>
      {format(display)}
    </span>
  );
}
