"use client";

/**
 * TryItNow — the two widgets people can actually touch.
 *
 * This section exists because every claim elsewhere on the page is
 * checkable here: the SIP maths and the score maths both run in the
 * browser while you drag. Glass cards + tilt come from the shared depth
 * primitives so the interaction language matches the hero.
 */

import { GlassCard } from "@/components/depth";
import { SplitHeading } from "@/components/split-heading";
import { MiniSIP } from "@/components/widgets/mini-sip";
import { FinancialHealth } from "@/components/widgets/financial-health";
import { Reveal } from "@/components/ui/reveal";
import { IconCalculator, IconPulse } from "@/components/ui/icons";

export function TryItNow() {
  return (
    <section id="try-it" className="scroll-mt-24 pb-16 lg:pb-28">
      <div className="shell">
        <Reveal>
          <div className="max-w-2xl">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-jade-600">
              04 — Try it now
            </p>
            <SplitHeading
              text="Don’t take our word for it. Move a slider."
              className="mt-4 font-display text-[2rem] leading-[1.1] tracking-[-0.015em] text-ink-800 sm:text-[2.5rem]"
            />
            <p className="mt-5 text-[0.98rem] leading-relaxed text-smoke-600">
              Two of the product&apos;s engines, running live in your browser. Nothing
              is sent anywhere, there is no login, and the formula sits under each
              result — check it while you drag.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 lg:mt-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <GlassCard
              as="article"
              className="h-full rounded-2xl border border-ink-800/8 bg-white p-5 shadow-[var(--shadow-card)] sm:p-7"
            >
              <span className="inline-flex size-9 items-center justify-center rounded-xl border border-ink-800/8 bg-paper text-ink-700">
                <IconCalculator className="size-[1.15rem]" />
              </span>
              <h3 className="mt-4 font-display text-[1.3rem] leading-tight tracking-[-0.01em] text-ink-800">
                What does a SIP actually become?
              </h3>
              <p className="mt-2 text-[0.88rem] leading-relaxed text-smoke-600">
                Pick an amount, a return and a horizon. The chart redraws as you drag —
                the dashed line is what you put in, the solid line is what compounding
                did with it.
              </p>
              <div className="mt-5">
                <MiniSIP />
              </div>
            </GlassCard>
          </Reveal>

          <Reveal delay={90} className="lg:col-span-5">
            <GlassCard
              as="article"
              className="h-full rounded-2xl border border-ink-800/8 bg-white p-5 shadow-[var(--shadow-card)] sm:p-7"
              glowColor="rgba(47, 164, 127, 0.12)"
            >
              <span className="inline-flex size-9 items-center justify-center rounded-xl border border-ink-800/8 bg-paper text-ink-700">
                <IconPulse className="size-[1.15rem]" />
              </span>
              <h3 className="mt-4 font-display text-[1.3rem] leading-tight tracking-[-0.01em] text-ink-800">
                How healthy is your money, really?
              </h3>
              <p className="mt-2 text-[0.88rem] leading-relaxed text-smoke-600">
                Four inputs, weighted and shown. This is the same shape as the
                product&apos;s Clarity score — including the part where it tells you
                which lever moves most.
              </p>
              <div className="mt-5">
                <FinancialHealth />
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
