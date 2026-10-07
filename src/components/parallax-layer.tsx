"use client";

/**
 * ParallaxLayer — scroll-linked drift for *decorative* layers only.
 *
 * A tiny client boundary that server sections (Problem, Transparency…)
 * can import to get the depth effect without becoming client components
 * themselves. Speed is the fraction of the element's distance from the
 * viewport centre it may travel; keep values under ~0.15 so it reads as
 * depth rather than motion.
 */

import { useParallax } from "@/components/depth";

export function ParallaxLayer({
  children,
  speed = 0.1,
  className = "",
}: {
  children?: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useParallax(speed);
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {children}
    </div>
  );
}
