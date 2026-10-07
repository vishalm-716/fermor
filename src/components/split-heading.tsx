"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Explicit tag union (not React.ElementType): R3F merges every THREE class
 * into JSX.IntrinsicElements, which collapses a fully-generic ElementType
 * to `never` props under `strict` — same constraint as Reveal's `as`.
 */
type SplitTag = "h1" | "h2" | "h3" | "p" | "span";

/**
 * SplitHeading — staggered word-by-word rise, clipped per word so the
 * text appears to lift out of its own baseline (the "split lines" beat).
 *
 * CSS transitions + one IntersectionObserver: no GSAP needed for reveals,
 * so headings stay cheap on phones. Reduced motion and no-JS both render
 * the words in place immediately.
 */
export function SplitHeading({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
  stagger = 55,
}: {
  text: string;
  as?: SplitTag;
  className?: string;
  delay?: number;
  stagger?: number;
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
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <Tag
      ref={ref as never}
      data-shown={shown ? "true" : "false"}
      className={className}
      aria-label={text}
    >
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="split-line"
            style={{
              transitionDelay: `${delay + index * stagger}ms`,
            }}
          >
            {word}
            {index < words.length - 1 ? "\u00A0" : ""}
          </span>
        ))}
      </span>
    </Tag>
  );
}
