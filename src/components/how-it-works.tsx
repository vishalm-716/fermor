import { IconAct, IconConnect, IconUnderstand } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";

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
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 pb-16 lg:pb-28">
      <div className="shell">
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
                    <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-jade-300" />
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
