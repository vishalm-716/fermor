"use client";

/**
 * HowItWorks — the pinned scroll story.
 *
 * Desktop (≥1024px, motion allowed): the slab pins under the header and
 * scrolling advances through Connect → Understand → Act. The step copy
 * cross-fades, the progress rule fills, and the 3D story scene morphs its
 * bars/camera to match the active step — all driven by one ScrollTrigger.
 *
 * Everything else (phones, reduced motion, no JS) gets the original static
 * three-step list; the two variants are toggled purely by CSS/media queries
 * so there is no hydration flash and no content ever depends on JS.
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StoryScene } from "@/components/scene-loaders";
import { SplitHeading } from "@/components/split-heading";
import { Reveal } from "@/components/ui/reveal";
import { IconAct, IconConnect, IconUnderstand } from "@/components/ui/icons";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    step: "Connect",
    title: "Bring it all into one place",
    body: "Link your bank accounts, demat, mutual funds, FDs and EPF through read-only connections. UPI and card spends arrive already sorted, so you don’t start with a spreadsheet.",
    note: "Read-only by design — Fermor can never move your money.",
    Icon: IconConnect,
  },
  {
    step: "Understand",
    title: "Statements become sentences",
    body: "We de-duplicate, categorise and label everything, then write you a short summary: what changed, what it cost you, and what actually deserves a second look.",
    note: "Every line links back to the transactions behind it.",
    Icon: IconUnderstand,
  },
  {
    step: "Act",
    title: "Decide with numbers, not moods",
    body: "Set goals with timelines you can keep, test a 20% market fall, or compare prepaying your loan against investing the same amount. See the outcome before you commit a rupee.",
    note: "Every projection shows its formula and its assumptions.",
    Icon: IconAct,
  },
] as const;

export function HowItWorks() {
  const pinRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLSpanElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const node = pinRef.current;
    if (!node) return;
    if (typeof window.matchMedia !== "function") return;

    // gsap.matchMedia re-runs the block when the query flips, so rotating
    // a tablet or crossing the breakpoint cleanly builds/tears the pin.
    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const ctx = gsap.context(() => {
          ScrollTrigger.create({
            trigger: node,
            start: "top top",
            end: "+=2600",
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const progress = self.progress;
              const index = Math.min(2, Math.floor(progress * 3));
              setActive((current) => (current === index ? current : index));
              // Write the rule straight to the DOM — no re-render per frame.
              if (barRef.current) {
                barRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
              }
            },
          });
        }, node);

        return () => {
          ctx.revert();
          setActive(0);
          if (barRef.current) barRef.current.style.transform = "scaleX(0)";
        };
      },
    );

    // Layout can shift while fonts settle; keep measurements honest.
    const refresh = () => ScrollTrigger.refresh();
    const timer = window.setTimeout(refresh, 250);

    return () => {
      window.clearTimeout(timer);
      mm.revert();
    };
  }, []);

  return (
    <section id="how-it-works" className="scroll-mt-24 pb-16 lg:pb-28">
      {/* ---------------------------------------------------------- *
       *  Pinned story — desktop + motion-allowed only (CSS-gated)
       * ---------------------------------------------------------- */}
      <div className="story-pinned hidden lg:motion-safe:block">
        <div ref={pinRef} className="shell">
          <div className="relative overflow-hidden rounded-[1.5rem] border border-ink-800/8 bg-white px-6 py-10 shadow-[var(--shadow-card)] sm:px-10 lg:px-14 lg:py-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-32 -top-32 size-72 rounded-full bg-jade-50/80"
            />

            <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
              {/* Copy: heading, progress rail, cross-fading step. */}
              <div className="flex flex-col">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-jade-600">
                  02 — How it works
                </p>
                <SplitHeading
                  text="Bring it in. Understand it. Then move."
                  className="mt-4 font-display text-[2rem] leading-[1.1] tracking-[-0.015em] text-ink-800 sm:text-[2.4rem]"
                />
                <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-smoke-600">
                  Fermor is one loop rather than a pile of features. Your money comes in,
                  gets explained, and turns into a decision you can check later.
                </p>

                {/* Progress rail */}
                <div className="mt-7" aria-hidden="true">
                  <div className="flex items-center gap-5 font-mono text-[0.66rem] uppercase tracking-[0.16em]">
                    {STEPS.map((item, index) => (
                      <span
                        key={item.step}
                        className={`transition-colors duration-300 ${
                          index === active
                            ? "text-jade-600"
                            : index < active
                              ? "text-smoke-500"
                              : "text-smoke-400/70"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")} {item.step}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2.5 h-px w-full bg-ink-800/10">
                    <span
                      ref={barRef}
                      className="story-progress__bar block h-px w-full bg-jade-500"
                    />
                  </div>
                </div>

                {/* Cross-fading step panels. */}
                <div className="relative mt-7 min-h-[15.5rem]">
                  {STEPS.map((item, index) => (
                    <div
                      key={item.step}
                      className="story-step absolute inset-0"
                      data-active={index === active}
                      aria-hidden={index !== active}
                      style={{
                        opacity: index === active ? 1 : 0,
                        transform:
                          index === active
                            ? "translateY(0)"
                            : `translateY(${index < active ? -10 : 10}px)`,
                        pointerEvents: index === active ? "auto" : "none",
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-jade-200 bg-jade-50 text-jade-600">
                          <item.Icon className="size-[1.15rem]" />
                        </span>
                        <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-smoke-500">
                          Step {index + 1} — {item.step}
                        </span>
                      </div>
                      <h3 className="mt-4 text-[1.15rem] font-medium leading-snug text-ink-800">
                        {item.title}
                      </h3>
                      <p className="mt-2.5 max-w-md text-[0.9rem] leading-relaxed text-smoke-600">
                        {item.body}
                      </p>
                      <p className="mt-4 flex max-w-md items-start gap-2 border-t border-ink-800/8 pt-3 font-mono text-[0.68rem] leading-relaxed text-smoke-500">
                        <span
                          aria-hidden="true"
                          className="mt-1.5 size-1.5 shrink-0 rounded-full bg-jade-300"
                        />
                        {item.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual: the wealth object morphs through the steps. */}
              <div className="relative">
                <div className="relative h-[17rem] overflow-hidden rounded-2xl border border-ink-800/8 bg-paper/60 lg:h-full lg:min-h-[22rem]">
                  <div
                    aria-hidden="true"
                    className="graph-paper absolute inset-0 opacity-50 [mask-image:radial-gradient(90%_80%_at_50%_40%,black,transparent)]"
                  />
                  <StoryScene step={active} />
                  <span className="absolute bottom-3 left-4 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-smoke-400">
                    Live scene · step {active + 1} of 3
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------- *
       *  Static list — phones, reduced motion, no-JS fallback
       * ---------------------------------------------------------- */}
      <div className="story-static shell lg:motion-safe:hidden">
        <div className="relative overflow-hidden rounded-[1.5rem] border border-ink-800/8 bg-white px-5 py-12 shadow-[var(--shadow-card)] sm:px-10 sm:py-16 lg:px-14 lg:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-32 size-72 rounded-full bg-jade-50/80"
          />

          <div className="relative max-w-2xl">
            <Reveal>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-jade-600">
                02 — How it works
              </p>
              <h2 className="mt-4 font-display text-[2rem] leading-[1.1] tracking-[-0.015em] text-ink-800 sm:text-[2.5rem]">
                Bring it in. Understand it. Then move.
              </h2>
              <p className="mt-5 text-[0.98rem] leading-relaxed text-smoke-600">
                Fermor is one loop rather than a pile of features. Your money comes in,
                gets explained, and turns into a decision you can check later. Then the
                loop runs again next month.
              </p>
            </Reveal>
          </div>

          <div className="relative mt-12 lg:mt-16">
            <div
              aria-hidden="true"
              className="absolute left-[6%] right-[6%] top-[1.15rem] hidden border-t border-dashed border-ink-800/20 lg:block"
            />

            <ol className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
              {STEPS.map((item, index) => (
                <Reveal as="li" key={item.step} delay={index * 90} className="relative">
                  <div className="flex items-center gap-4 lg:flex-col lg:items-start">
                    <span className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl border border-jade-200 bg-jade-50 text-jade-600">
                      <item.Icon className="size-[1.15rem]" />
                    </span>
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-smoke-500 lg:mt-3">
                      Step {index + 1} — {item.step}
                    </span>
                  </div>

                  <h3 className="mt-4 text-[1.05rem] font-medium leading-snug text-ink-800 lg:mt-3 lg:text-[1.12rem]">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 max-w-md text-[0.9rem] leading-relaxed text-smoke-600">
                    {item.body}
                  </p>
                  <p className="mt-4 flex items-start gap-2 border-t border-ink-800/8 pt-3 font-mono text-[0.68rem] leading-relaxed text-smoke-500">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-jade-300"
                    />
                    {item.note}
                  </p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
