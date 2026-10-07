import { Check, Cross, IconScale, IconShield, IconSpark } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";

const CONTRASTS = [
  {
    ordinary: "Recommend the fund that pays the highest commission",
    fermor: "Recommend nothing we are paid to recommend",
  },
  {
    ordinary: "Put calculators behind a login wall, then call you",
    fermor: "Run every calculator in your browser, free, no sign-up",
  },
  {
    ordinary: "Bury the assumptions and hope nobody asks",
    fermor: "Print the formula and the assumptions beside the answer",
  },
  {
    ordinary: "Treat your spending data as inventory",
    fermor: "Never sell it, never share it, delete it when you ask",
  },
];

const PRINCIPLES = [
  {
    Icon: IconScale,
    title: "Calm by default",
    body: "No flashing red loss alerts, no countdown timers, no “act now”. Investing is a long habit, not a sale.",
  },
  {
    Icon: IconSpark,
    title: "Built for India’s reality",
    body: "UPI, salary cycles, EPF, gold, family money. Modelled the way money actually moves here, not as a US template with ₹ signs bolted on.",
  },
  {
    Icon: IconShield,
    title: "Boring where it matters",
    body: "Standard formulas, sourced rates, and a visible changelog whenever tax rules change. You should be able to check our work.",
  },
];

export function Principles() {
  return (
    <section
      id="principles"
      data-theme="dark"
      className="relative scroll-mt-24 overflow-hidden bg-ink-900 py-16 text-paper lg:py-24"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="graph-paper-dark absolute inset-0 opacity-70 [mask-image:radial-gradient(110%_70%_at_20%_0%,black,transparent_72%)]" />
        <div className="absolute -bottom-40 left-1/2 size-[34rem] -translate-x-1/2 rounded-full bg-jade-700/25 blur-[120px]" />
      </div>

      <div className="shell relative">
        <Reveal>
          <div className="max-w-3xl">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-jade-300">
              06 — Why Fermor is different
            </p>
            <h2 className="mt-4 font-display text-[2rem] leading-[1.1] tracking-[-0.015em] text-white sm:text-[2.7rem]">
              The usual finance playbook — and the parts we skip.
            </h2>
            <p className="mt-5 max-w-2xl text-[0.98rem] leading-relaxed text-white/65">
              None of this is a feature. It is the reason the product can be trusted with a
              question as personal as “am I doing fine?”
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-12 overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] lg:mt-16">
            <div className="hidden grid-cols-2 border-b border-white/10 font-mono text-[0.66rem] uppercase tracking-[0.16em] lg:grid">
              <p className="px-6 py-3 text-white/40">What most finance apps do</p>
              <p className="border-l border-white/10 px-6 py-3 text-jade-300">
                What Fermor does instead
              </p>
            </div>

            <ul>
              {CONTRASTS.map((row, index) => (
                <li
                  key={row.fermor}
                  className={`grid grid-cols-1 gap-px lg:grid-cols-2 ${
                    index > 0 ? "border-t border-white/10" : ""
                  }`}
                >
                  <div className="flex items-start gap-3 px-5 py-5 sm:px-6">
                    <Cross className="mt-0.5 size-4 shrink-0 text-white/25" />
                    <p className="text-[0.9rem] leading-relaxed text-white/45">
                      <span className="mr-1.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-white/25 lg:hidden">
                        Them
                      </span>
                      {row.ordinary}
                    </p>
                  </div>
                  <div className="flex items-start gap-3 bg-jade-900/25 px-5 py-5 sm:px-6 lg:border-l lg:border-white/10">
                    <Check className="mt-0.5 size-4 shrink-0 text-jade-300" />
                    <p className="text-[0.9rem] font-medium leading-relaxed text-white">
                      <span className="mr-1.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-jade-300/70 lg:hidden">
                        Fermor
                      </span>
                      {row.fermor}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-8">
          {PRINCIPLES.map((principle, index) => (
            <Reveal key={principle.title} delay={index * 70}>
              <div className="h-full border-t border-white/15 pt-6 sm:pr-4">
                <principle.Icon className="size-5 text-jade-300" />
                <h3 className="mt-3.5 text-[1rem] font-medium text-white">
                  {principle.title}
                </h3>
                <p className="mt-2 max-w-sm text-[0.86rem] leading-relaxed text-white/60">
                  {principle.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-12 border-l-2 border-jade-400/60 pl-4 text-[0.88rem] leading-relaxed text-white/55">
            The promise in one line: Fermor does not take money from fund houses, lenders or
            brokers. If that ever changes, this page is where we will say so first.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
