/**
 * Transparency — the "fine print, printed fine" section.
 *
 * Where the Principles section states the stance (a contrast table), this
 * one shows the mechanisms: four short bullets plus a receipt-style
 * disclosure card that itemises what Fermor does and doesn't earn from.
 * Deliberately dry — transparency should read like a bill, not a slogan.
 */

import { Reveal } from "@/components/ui/reveal";
import { ParallaxLayer } from "@/components/parallax-layer";
import { SplitHeading } from "@/components/split-heading";
import {
  Check,
  Cross,
  IconCalculator,
  IconLock,
  IconReceipt,
  IconShield,
} from "@/components/ui/icons";

const COMMITMENTS = [
  {
    Icon: IconLock,
    title: "No login wall on the core tools",
    body: "EMI, SIP, FD, tax and salary calculators run in your browser before you ever type an email.",
  },
  {
    Icon: IconCalculator,
    title: "Every answer shows its maths",
    body: "The formula, the rate source and the assumptions sit next to the result — not behind a tooltip.",
  },
  {
    Icon: IconShield,
    title: "No pushy cards, no paid rankings",
    body: "We don't run credit-card campaigns or rank funds by commission. Nothing on this page is a placement.",
  },
  {
    Icon: IconReceipt,
    title: "Privacy-minded by architecture",
    body: "Connections are read-only, exports are yours, deletion is self-serve. We never sell transaction data.",
  },
] as const;

/** What the money is — and isn't — tied to. */
const LEDGER: Array<{ item: string; status: string; honest: boolean }> = [
  { item: "Commission from fund houses", status: "₹0", honest: true },
  { item: "Selling or sharing your data", status: "Never", honest: true },
  { item: "Credit-card referrals", status: "None", honest: true },
  { item: "Calculators behind a login", status: "Free", honest: true },
  { item: "Ads or sponsored rankings", status: "Labelled if ever", honest: true },
  { item: "Subscription (future, optional)", status: "You'll hear first", honest: true },
];

export function Transparency() {
  return (
    <section
      id="transparency"
      className="relative scroll-mt-24 overflow-hidden pb-16 lg:pb-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-ink-800/10"
      />

      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left: the commitments. */}
          <div className="lg:col-span-7">
            <Reveal>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-jade-600">
                07 — Transparency &amp; principles
              </p>
              <SplitHeading
                text="Trust is a mechanism, not a mood."
                className="mt-4 font-display text-[2rem] leading-[1.1] tracking-[-0.015em] text-ink-800 sm:text-[2.4rem]"
              />
              <p className="mt-5 max-w-xl text-[0.98rem] leading-relaxed text-smoke-600">
                Anyone can claim to be on your side. These are the four checks you can
                run yourself — on this page, today, without an account.
              </p>
            </Reveal>

            <ul className="mt-9 space-y-5">
              {COMMITMENTS.map((item, index) => (
                <Reveal as="li" key={item.title} delay={index * 70}>
                  <div className="flex gap-4 border-t border-ink-800/10 pt-5">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-jade-50 text-jade-600">
                      <item.Icon className="size-4" />
                    </span>
                    <div>
                      <h3 className="text-[0.98rem] font-medium leading-snug text-ink-800">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 max-w-lg text-[0.87rem] leading-relaxed text-smoke-600">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>

          {/* Right: the disclosure receipt. */}
          <div className="lg:col-span-5">
            <Reveal delay={120}>
              <div className="relative">
                {/* Perforation strip behind the receipt's top edge. */}
                <ParallaxLayer
                  speed={0.06}
                  className="dotted-ring absolute -top-2 left-4 right-4 h-3 rounded-full opacity-70 will-change-transform"
                />

                <div className="rounded-2xl border border-dashed border-ink-800/25 bg-white px-5 py-6 shadow-[var(--shadow-card)] sm:px-6">
                  <div className="flex items-center justify-between gap-3 border-b border-dashed border-ink-800/20 pb-4">
                    <span className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-ink-700">
                      <IconReceipt className="size-4 text-jade-600" />
                      Disclosure
                    </span>
                    <span className="font-mono text-[0.62rem] text-smoke-400">
                      Updated monthly
                    </span>
                  </div>

                  <ul className="divide-y divide-dashed divide-ink-800/15">
                    {LEDGER.map((row) => (
                      <li
                        key={row.item}
                        className="flex items-baseline justify-between gap-4 py-3"
                      >
                        <span className="text-[0.84rem] leading-snug text-smoke-600">
                          {row.item}
                        </span>
                        <span className="flex shrink-0 items-center gap-1.5 font-mono text-[0.78rem] font-medium text-jade-700">
                          <Check className="size-3.5" aria-hidden="true" />
                          {row.status}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex items-start gap-2.5 border-t border-dashed border-ink-800/20 pt-4">
                    <Cross
                      className="mt-0.5 size-3.5 shrink-0 text-clay-500"
                      aria-hidden="true"
                    />
                    <p className="text-[0.76rem] leading-relaxed text-smoke-500">
                      Every line above is checkable on this page today: open a
                      calculator, read a formula, inspect the markup. No account needed
                      for any of it.
                    </p>
                  </div>
                </div>

                <p className="mt-4 px-1 font-mono text-[0.66rem] leading-relaxed text-smoke-400">
                  Receipt № 01 · generated from the same source we ship with — if a
                  line moves, it moves here first.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
