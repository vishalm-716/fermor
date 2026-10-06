import type { ReactElement } from "react";
import {
  Check,
  IconCalculator,
  IconForecast,
  IconInsight,
  IconLedger,
  IconPulse,
  IconShield,
} from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { EmiCalculator } from "@/components/widgets/emi-calculator";
import { ForecastChart } from "@/components/widgets/forecast-chart";

const cardBase =
  "relative flex flex-col overflow-hidden rounded-2xl border border-ink-800/8 bg-white p-5 shadow-[var(--shadow-card)] transition-[transform,box-shadow,border-color] duration-300 sm:p-7";

const cardHover =
  "hover:-translate-y-1 hover:border-ink-800/16 hover:shadow-[var(--shadow-lift)]";

const ACCOUNTS = [
  { name: "Savings, UPI & cards", detail: "4 accounts", value: "₹6.6 L" },
  { name: "Demat & mutual funds", detail: "2 brokers, 9 folios", value: "₹18.6 L" },
  { name: "FDs, PPF & EPF", detail: "3 instruments", value: "₹7.2 L" },
];

const HEALTH = [
  { label: "Savings rate", value: "22%", fill: 74 },
  { label: "Debt load", value: "28% of income", fill: 38 },
  { label: "Emergency cover", value: "3.1 months", fill: 52 },
  { label: "Investing consistency", value: "41 months unbroken", fill: 92 },
];

function CardHead({
  Icon,
  title,
  body,
}: {
  Icon: (props: { className?: string }) => ReactElement;
  title: string;
  body: string;
}) {
  return (
    <div>
      <span className="inline-flex size-9 items-center justify-center rounded-xl border border-ink-800/8 bg-paper text-ink-700">
        <Icon className="size-[1.15rem]" />
      </span>
      <h3 className="mt-4 font-display text-[1.3rem] leading-tight tracking-[-0.01em] text-ink-800">
        {title}
      </h3>
      <p className="mt-2.5 text-[0.88rem] leading-relaxed text-smoke-600">{body}</p>
    </div>
  );
}

export function Capabilities() {
  return (
    <section id="capabilities" className="scroll-mt-24 pb-16 lg:pb-28">
      <div className="shell">
        <Reveal>
          <div className="max-w-2xl">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-jade-600">
              03 — What you get
            </p>
            <h2 className="mt-4 font-display text-[2rem] leading-[1.1] tracking-[-0.015em] text-ink-800 sm:text-[2.5rem]">
              Six things, done properly
            </h2>
            <p className="mt-5 text-[0.98rem] leading-relaxed text-smoke-600">
              A deliberately short list. Everything here answers one of three questions:
              what do I have, what is it doing, and what should I do next.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 lg:mt-14 lg:grid-cols-12">
          {/* 1 · Unified view */}
          <Reveal className="lg:col-span-7">
            <article className={`${cardBase} ${cardHover} h-full`}>
              <CardHead
                Icon={IconLedger}
                title="One view, across every account"
                body="Bank, demat, mutual funds, FDs and EPF in a single ledger. Net worth updates as balances move, so you stop guessing which number is current."
              />
              <ul className="mt-5 space-y-2.5">
                {ACCOUNTS.map((account) => (
                  <li
                    key={account.name}
                    className="flex items-center justify-between gap-3 rounded-xl border border-ink-800/8 bg-paper/60 px-3.5 py-2.5"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[0.86rem] text-ink-800">
                        {account.name}
                      </span>
                      <span className="block font-mono text-[0.64rem] text-smoke-400">
                        {account.detail}
                      </span>
                    </span>
                    <span className="tnum shrink-0 font-mono text-[0.86rem] text-ink-800">
                      {account.value}
                    </span>
                  </li>
                ))}
                <li className="flex items-center justify-between gap-3 rounded-xl border border-jade-200 bg-jade-50 px-3.5 py-2.5">
                  <span className="text-[0.86rem] text-jade-800">Net worth</span>
                  <span className="tnum font-mono text-[0.9rem] font-medium text-jade-800">
                    ₹32.4 L
                  </span>
                </li>
              </ul>
            </article>
          </Reveal>

          {/* 2 · Plain-English insights */}
          <Reveal delay={60} className="lg:col-span-5">
            <article className={`${cardBase} ${cardHover} h-full`}>
              <CardHead
                Icon={IconInsight}
                title="Insights written like a person wrote them"
                body="No dashboard to decode. Fermor says what changed, what it cost, and whether it deserves your attention this week."
              />
              <figure className="mt-5 rounded-xl border border-ink-800/8 bg-paper/60 p-4">
                <blockquote className="font-display text-[1.05rem] leading-snug text-ink-800">
                  “Your SIPs have run for 41 months without a pause. The last skipped
                  instalment was in March 2024 — you fixed it in two days.”
                </blockquote>
                <figcaption className="mt-3 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-smoke-400">
                  Example insight
                </figcaption>
              </figure>

              <div className="mt-auto pt-6">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-smoke-400">
                  And sometimes
                </p>
                <p className="mt-2.5 text-[0.85rem] leading-relaxed text-smoke-600">
                  “Your emergency fund covers 5.2 months. Nothing to fix here this
                  month.” Saying that is the point — an app that earns from activity has no
                  reason to.
                </p>
              </div>
            </article>
          </Reveal>

          {/* 3 · Health score */}
          <Reveal className="lg:col-span-4">
            <article className={`${cardBase} ${cardHover} h-full`}>
              <CardHead
                Icon={IconPulse}
                title="A health score that shows its working"
                body="Four inputs: what you save, what you owe, how long you’d last without income, and how regularly you invest."
              />
              <div className="mt-5">
                <div className="flex items-end justify-between">
                  <span className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-smoke-500">
                    Clarity score
                  </span>
                  <span className="tnum font-display text-[1.6rem] leading-none text-ink-800">
                    72<span className="text-[0.9rem] text-smoke-400">/100</span>
                  </span>
                </div>
                <ul className="mt-4 space-y-3">
                  {HEALTH.map((metric) => (
                    <li key={metric.label}>
                      <div className="flex justify-between text-[0.72rem]">
                        <span className="text-smoke-600">{metric.label}</span>
                        <span className="tnum font-mono text-ink-700">{metric.value}</span>
                      </div>
                      <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-paper-2">
                        <span
                          className="block h-full rounded-full bg-jade-400"
                          style={{ width: `${metric.fill}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto border-t border-ink-800/8 pt-5">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-smoke-400">
                  What to fix first
                </p>
                <p className="mt-2 text-[0.82rem] leading-relaxed text-smoke-600">
                  Emergency cover is the weak link. At 3.1 months you’re one hospital bill
                  away from borrowing — growing it to six months is the biggest single jump
                  available to you.
                </p>
              </div>
            </article>
          </Reveal>

          {/* 4 · Forecasting (interactive) */}
          <Reveal delay={60} className="lg:col-span-8">
            <article className={`${cardBase} h-full`}>
              <CardHead
                Icon={IconForecast}
                title="Test the what-ifs before they happen"
                body="What if the market falls the year you need the money? What if you invest ₹5,000 more each month? Change one number and see the next fifteen years move."
              />
              <div className="mt-6">
                <ForecastChart />
              </div>
            </article>
          </Reveal>

          {/* 5 · Calculators (interactive) */}
          <Reveal className="lg:col-span-7">
            <article className={`${cardBase} h-full`}>
              <CardHead
                Icon={IconCalculator}
                title="Calculators that show their maths"
                body="EMI, SIP, FD, income tax, HRA and salary break-ups — free, mobile-first, and computed in your browser. No login, no phone number, no follow-up call."
              />
              <div className="mt-6">
                <EmiCalculator />
              </div>
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {["EMI", "SIP", "FD & RD", "Income tax (old vs new)", "HRA", "Salary structure", "Prepay vs invest"].map(
                  (tool) => (
                    <li
                      key={tool}
                      className="rounded-full border border-ink-800/10 bg-paper px-2.5 py-1 font-mono text-[0.62rem] text-smoke-600"
                    >
                      {tool}
                    </li>
                  ),
                )}
              </ul>
            </article>
          </Reveal>

          {/* 6 · Privacy */}
          <Reveal delay={60} className="lg:col-span-5">
            <article className={`${cardBase} ${cardHover} h-full`}>
              <CardHead
                Icon={IconShield}
                title="Yours, and portable"
                body="Read-only connections, encrypted in transit and at rest. Export everything as a file, or delete it in one tap — no support ticket, no retention games."
              />
              <ul className="mt-5 space-y-2.5">
                {[
                  "Fermor can see balances, never move money",
                  "Your data is never sold or shared with lenders",
                  "Delete your account and everything in it, yourself",
                ].map((line) => (
                  <li key={line} className="flex gap-2.5 text-[0.84rem] leading-relaxed text-smoke-600">
                    <Check className="mt-0.5 size-4 shrink-0 text-jade-500" />
                    {line}
                  </li>
                ))}
              </ul>

              <div className="mt-auto border-t border-ink-800/8 pt-5">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-smoke-400">
                  If you leave
                </p>
                <p className="mt-2 text-[0.82rem] leading-relaxed text-smoke-600">
                  One tap in settings. No confirmation call, no “are you sure?” maze, and
                  nothing kept on the side afterwards.
                </p>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
