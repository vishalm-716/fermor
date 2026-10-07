"use client";

/**
 * HeroStage — the right-hand hero column.
 *
 * Layered composition (back → front):
 *   1. WebGL wealth object (desktop ≥1024px, lazily imported) or a flat
 *      CSS stand-in on smaller screens,
 *   2. the existing ClarityPanel dashboard, floated with perspective and
 *      a gentle pointer tilt,
 *   3. two glass chips pinned at different z-depths that parallax against
 *      the pointer, so the stack reads as physical layers.
 *
 * Everything degrades to a static, fully-usable panel below 1024px and
 * under prefers-reduced-motion.
 */

import { useCallback, useEffect, useRef, type CSSProperties } from "react";
import { ClarityPanel } from "@/components/widgets/clarity-panel";
import { HeroScene } from "@/components/scene-loaders";
import { IconLock, IconSpark } from "@/components/ui/icons";

const TILT_MAX = 4; // deg — barely there, on purpose
const CHIP_PARALLAX = 14; // px of counter-drift for the floating chips

export function HeroStage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const chipTopRef = useRef<HTMLDivElement | null>(null);
  const chipBottomRef = useRef<HTMLDivElement | null>(null);
  const frame = useRef(0);

  const reset = useCallback(() => {
    const panel = panelRef.current;
    if (panel) panel.style.transform = "";
    for (const chip of [chipTopRef.current, chipBottomRef.current]) {
      if (chip) chip.style.transform = "";
    }
  }, []);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const fine = window.matchMedia("(pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wide = window.matchMedia("(min-width: 1024px)");
    if (!fine.matches || calm.matches || !wide.matches) return;

    const onMove = (event: PointerEvent) => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        const root = rootRef.current;
        if (!root) return;
        const rect = root.getBoundingClientRect();
        // -0.5 … 0.5 across the stage
        const nx = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
        const ny = (event.clientY - (rect.top + rect.height / 2)) / rect.height;

        const panel = panelRef.current;
        if (panel) {
          panel.style.transform = `perspective(1400px) rotateX(${(-ny * TILT_MAX).toFixed(2)}deg) rotateY(${(nx * TILT_MAX).toFixed(2)}deg)`;
        }
        // Chips drift *with* the pointer at different depths.
        const map: Array<[HTMLDivElement | null, number]> = [
          [chipTopRef.current, 1],
          [chipBottomRef.current, -0.6],
        ];
        for (const [chip, depth] of map) {
          if (!chip) continue;
          chip.style.transform = `translate3d(${(nx * CHIP_PARALLAX * depth).toFixed(1)}px, ${(ny * CHIP_PARALLAX * depth).toFixed(1)}px, 0)`;
        }
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame.current) cancelAnimationFrame(frame.current);
      reset();
    };
  }, [reset]);

  return (
    <div ref={rootRef} className="hero-stage relative">
      {/* Layer 1 — the wealth object behind everything. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-6 -top-10 bottom-8 -z-10 overflow-hidden rounded-[2rem] [mask-image:radial-gradient(120%_90%_at_50%_35%,black_55%,transparent)]"
      >
        <HeroScene />
      </div>

      {/* Layer 2 — the interactive dashboard. */}
      <div
        ref={panelRef}
        className="hero-stage__panel relative transition-transform duration-300 ease-out will-change-transform"
        style={{ transformStyle: "preserve-3d" } as CSSProperties}
      >
        <ClarityPanel />
      </div>

      {/* Layer 3 — floating glass chips at their own depths. */}
      <div
        ref={chipTopRef}
        className="glass absolute -top-5 -left-3 z-20 hidden items-center gap-2 rounded-full px-3 py-1.5 shadow-glass transition-transform duration-300 ease-out will-change-transform sm:flex"
        style={{ transform: "translateZ(40px)" }}
      >
        <IconSpark className="size-3.5 text-jade-600" />
        <span className="font-mono text-[0.66rem] tracking-tight text-ink-700">
          Compounding daily
        </span>
      </div>

      <div
        ref={chipBottomRef}
        className="glass absolute -right-3 -bottom-6 z-20 hidden items-center gap-2 rounded-full px-3 py-1.5 shadow-glass transition-transform duration-300 ease-out will-change-transform sm:flex"
        style={{ transform: "translateZ(70px)" }}
      >
        <IconLock className="size-3.5 text-jade-600" />
        <span className="font-mono text-[0.66rem] tracking-tight text-ink-700">
          Read-only · never moves money
        </span>
      </div>
    </div>
  );
}
