"use client";

/**
 * BuiltForIndia — why the product isn't a US template with ₹ signs.
 *
 * Four cards, one line of copy each, small line icons: INR-first maths,
 * both tax regimes, UPI/bank reality, and phone-first usage. Numbers use
 * CountUp so the section's stats tick up as you reach them.
 */

import { CountUp } from "@/components/ui/count-up";
import { Reveal } from "@/components/ui/reveal";
import { SplitHeading } from "@/components/split-heading";
import {
  IconConnect,
  IconPhone,
  IconRupee,
  IconScale,
} from "@/components/ui/icons";

const PILLARS = [
  {
    Icon: IconRupee,
    title: "INR-first calculators",
    body: "Lakh and crore by default, not millions. Every result prints its formula so you can check it on paper.",
    stat: 18,
    suffix: " free calculators",
    format: (n: number) => String(Math.round(n)),
  },
  {
    Icon: IconScale,
    title: "Both tax regimes",
    body: "Old and new slabs, HRA, 80C, 80CCD(1B) — compared side by side instead of guessed at during filing season.",
    stat: 2,
    suffix: " regimes, always current",
    format: (n: number) => String(Math.round(n)),
  },
  {
    Icon: IconConnect,
    title: "UPI & bank reality",
    body: "Read-only connections that understand UPI handles, joint accounts, RD auto-debits and the way Indian statements actually arrive.",
    stat: 4,
    suffix: " minutes to set up",
    format: (n: number) => String(Math.round(n)),
  },
  {
    Icon: IconPhone,
    title: "Mobile-first, by default",
    body: "One thumb, one column, big tap targets. Built on a phone first and stretched to a laptop — the order most of India browses in.",
    stat: 78,
    suffix: "% of users arrive on a phone",
    format: (n: number) => String(Math.round(n)),
  },
] as const;

export function BuiltForIndia() {
  return (
    <section id="india" className="scroll-mt-24 pb-16 lg:pb-28">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-jade-600">
                05 — Built for India
              </p>
              <SplitHeading
                text="Not a US template with ₹ signs bolted on."
                className="mt-4 font-display text-[2rem] leading-[1.1] tracking-[-0.015em] text-ink-800 sm:text-[2.4rem]"
              />
              <p className="mt-5 max-w-md text-[0.98rem] leading-relaxed text-smoke-600">
                Money here behaves differently: salary lands on the 1st, festivals pull
                cash forward, and a “lakh” is a unit of planning, not a translation. The
                product is shaped around that, from the number format up.
              </p>

              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-ink-800/10 pt-6">
                {PILLARS.map((pillar) => (
                  <div key={pillar.title}>
                    <dt className="tnum font-display text-[1.75rem] leading-none tracking-tight text-ink-800">
                      <CountUp
                        value={pillar.stat}
                        format={pillar.format}
                        duration={1100}
                      />
                    </dt>
                    <dd className="mt-1.5 text-[0.74rem] leading-snug text-smoke-500">
                      {pillar.suffix}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {PILLARS.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 70}>
                <article className="group h-full rounded-2xl border border-ink-800/8 bg-white p-5 shadow-[var(--shadow-card)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-jade-300/70 hover:shadow-[var(--shadow-lift)] sm:p-6">
                  <span className="inline-flex size-9 items-center justify-center rounded-xl border border-ink-800/8 bg-paper text-ink-700 transition-colors duration-300 group-hover:border-jade-200 group-hover:bg-jade-50 group-hover:text-jade-600">
                    <pillar.Icon className="size-[1.15rem]" />
                  </span>
                  <h3 className="mt-4 text-[1rem] font-medium leading-snug text-ink-800">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-[0.86rem] leading-relaxed text-smoke-600">
                    {pillar.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
