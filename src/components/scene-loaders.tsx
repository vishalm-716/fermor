"use client";

/**
 * Scene loaders — the only place three.js is allowed to be requested.
 *
 * Both HeroScene and StoryScene:
 *   - never load below their breakpoint (phones keep the flat HTML mock,
 *     which protects the Lighthouse mobile budget),
 *   - never load under prefers-reduced-motion,
 *   - mount lazily when they come within ~240px of the viewport,
 *   - pause the WebGL loop (frameloop="never") once scrolled away.
 *
 * The heavy chunk is fetched with next/dynamic (ssr:false), so the server
 * render and first paint never wait on three.js.
 */

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

const ThreeScene = dynamic(() => import("@/components/three-scene"), {
  ssr: false,
  loading: () => null,
});

type GateOptions = {
  /** media query that must match for the scene to be allowed at all */
  query: string;
};

/**
 * Decides whether a scene may load (breakpoint + motion preference) and
 * whether it is close enough to the viewport to be worth running.
 */
function useSceneGate({ query }: GateOptions) {
  const [allowed, setAllowed] = useState(false);
  const [near, setNear] = useState(false);
  // Mount once, pause later: avoids WebGL context churn on scroll-back.
  const [hasBeenNear, setHasBeenNear] = useState(false);
  const holderRef = useRef<HTMLDivElement | null>(null);

  // Gate 1: viewport class + motion preference (checked before any import).
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const viewport = window.matchMedia(query);
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAllowed(viewport.matches && !calm.matches);
    sync();
    viewport.addEventListener("change", sync);
    calm.addEventListener("change", sync);
    return () => {
      viewport.removeEventListener("change", sync);
      calm.removeEventListener("change", sync);
    };
  }, [query]);

  // Gate 2: proximity — mount shortly before it scrolls in, tear the
  // loop down (not the canvas) once it leaves.
  useEffect(() => {
    if (!allowed) return;
    const node = holderRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setNear(entry.isIntersecting);
          if (entry.isIntersecting) setHasBeenNear(true);
        }
      },
      { rootMargin: "240px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [allowed]);

  return { allowed, near, mounted: hasBeenNear, holderRef };
}

function SceneSlot({
  holderRef,
  allowed,
  near,
  mounted,
  quality,
  placeholder,
  children,
}: {
  holderRef: RefObject<HTMLDivElement | null>;
  allowed: boolean;
  near: boolean;
  mounted: boolean;
  quality: "high" | "low";
  placeholder: ReactNode;
  children: (near: boolean, quality: "high" | "low") => ReactNode;
}) {
  return (
    <div ref={holderRef} className="absolute inset-0">
      {/* Flat stand-in: first paint + the no-JS/no-WebGL story. */}
      {allowed && mounted ? children(near, quality) : placeholder}
    </div>
  );
}

/** Lightweight CSS-only preview shown until the WebGL scene takes over. */
export function ScenePlaceholder({ bars = true }: { bars?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-end justify-center gap-2 overflow-hidden px-6 pb-8 sm:gap-3"
    >
      {bars ? (
        [28, 44, 62, 78, 96].map((height, index) => (
          <span
            key={height}
            className="w-8 rounded-t-md bg-gradient-to-t from-jade-500/25 to-jade-300/45 sm:w-11"
            style={{ height: `${height}%`, animationDelay: `${index * 90}ms` }}
          />
        ))
      ) : (
        <span className="h-24 w-2/3 rounded-xl bg-jade-100/60" />
      )}
    </div>
  );
}

/** Hero wealth object — desktop and up only. */
export function HeroScene() {
  const { allowed, near, mounted, holderRef } = useSceneGate({
    query: "(min-width: 1024px)",
  });
  // Depth of field is the priciest pass — only on roomy desktops.
  const quality =
    typeof window !== "undefined" && window.innerWidth >= 1280 ? "high" : "low";

  return (
    <SceneSlot
      holderRef={holderRef}
      allowed={allowed}
      near={near}
      mounted={mounted}
      quality={quality}
      placeholder={<ScenePlaceholder />}
    >
      {(isNear, q) => (
        <ThreeScene
          variant="hero"
          quality={q}
          frameloop={isNear ? "always" : "never"}
        />
      )}
    </SceneSlot>
  );
}

/**
 * How-it-works story scene — pinned-section companion. `step` (0..2)
 * drives the bar morph + camera move.
 */
export function StoryScene({ step }: { step: number }) {
  const { allowed, near, mounted, holderRef } = useSceneGate({
    query: "(min-width: 1024px)",
  });

  return (
    <SceneSlot
      holderRef={holderRef}
      allowed={allowed}
      near={near}
      mounted={mounted}
      quality="low"
      placeholder={<ScenePlaceholder bars={false} />}
    >
      {(isNear) => (
        <ThreeScene
          variant="story"
          step={step}
          quality="low"
          frameloop={isNear ? "always" : "never"}
        />
      )}
    </SceneSlot>
  );
}
