"use client";

/**
 * Depth primitives: GlassCard and Magnetic.
 *
 * GlassCard — layered-shadow glass panel that tilts toward the pointer
 * (mouse-position perspective) with a soft glow that follows the cursor.
 * Touch devices and reduced-motion users get a static card: tilt and glow
 * engage only when (pointer: fine) matches and motion is allowed.
 *
 * Magnetic — pulls a primary CTA a few pixels toward the cursor and
 * springs back on leave. Pure transform work, one rAF-free event handler.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

const TILT_MAX = 6; // degrees — calm, not a funfair
const PULL = 0.22; // magnetic strength

function useFinePointerAndMotion(): boolean {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const fine = window.matchMedia("(pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAllowed(fine.matches && !calm.matches);
    sync();
    fine.addEventListener("change", sync);
    calm.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      calm.removeEventListener("change", sync);
    };
  }, []);
  return allowed;
}

/* ------------------------------------------------------------------ *
 *  GlassCard — tilt + cursor glow
 * ------------------------------------------------------------------ */
export function GlassCard({
  children,
  className = "",
  style,
  glowColor = "rgba(47, 164, 127, 0.16)",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  glowColor?: string;
  as?: "div" | "article" | "section";
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const allowed = useFinePointerAndMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50, on: false });

  const onMove = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (!allowed) return;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      setTilt({
        x: (0.5 - py) * TILT_MAX * 2,
        y: (px - 0.5) * TILT_MAX * 2,
      });
      setGlow({ x: px * 100, y: py * 100, on: true });
    },
    [allowed],
  );

  const onLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setGlow((g) => ({ ...g, on: false }));
  }, []);

  return (
    <Tag
      ref={ref as never}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`glass-card ${className}`.trim()}
      style={
        {
          ...style,
          "--tilt-x": `${tilt.x}deg`,
          "--tilt-y": `${tilt.y}deg`,
          "--glow-x": `${glow.x}%`,
          "--glow-y": `${glow.y}%`,
          "--glow-color": glowColor,
          "--glow-opacity": glow.on && allowed ? 1 : 0,
        } as CSSProperties
      }
    >
      {children}
      <span aria-hidden="true" className="glass-card__glow" />
    </Tag>
  );
}

/* ------------------------------------------------------------------ *
 *  Magnetic — pointer-attracted CTA
 * ------------------------------------------------------------------ */
export function Magnetic({
  children,
  strength = PULL,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const allowed = useFinePointerAndMotion();

  const onMove = useCallback(
    (event: ReactMouseEvent<HTMLSpanElement>) => {
      if (!allowed) return;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      node.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
    },
    [allowed, strength],
  );

  const reset = useCallback(() => {
    const node = ref.current;
    if (node) node.style.transform = "translate3d(0, 0, 0)";
  }, []);

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onBlur={reset}
      className={`magnetic ${className}`.trim()}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 *  useParallax — small scroll-linked offset for decorative layers.
 *  Returns a ref to attach; writes transform via rAF (no re-renders).
 * ------------------------------------------------------------------ */
export function useParallax(speed = 0.12) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (
      typeof window.matchMedia === "function" &&
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        window.matchMedia("(max-width: 767px)").matches)
    ) {
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const offset = (elementCenter - viewportCenter) * speed;
      node.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [speed]);

  return ref;
}
