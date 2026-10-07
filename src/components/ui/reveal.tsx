"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Tags Reveal is allowed to render as. Kept as an explicit union (rather than
 * React.ElementType) because React Three Fiber merges every THREE class into
 * JSX.IntrinsicElements, which collapses a fully-generic ElementType down to
 * `never` props under `strict`.
 */
type RevealTag = "div" | "li" | "section" | "article" | "span" | "ul";

/**
 * Fades content up the first time it scrolls into view.
 * Uses one IntersectionObserver per element and only animates
 * opacity/transform, so it stays quiet on low-end phones.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: RevealTag;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      data-shown={shown ? "true" : "false"}
      className={`reveal ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
