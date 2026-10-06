import { ArrowDown, ArrowRight, IconSpark } from "@/components/ui/icons";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { ClarityPanel } from "@/components/widgets/clarity-panel";

const FACTS = [
  { figure: "18", label: "free calculators, no login" },
  { figure: "0", label: "paid placements" },
  { figure: "FY 26-27", label: "tax slabs, updated by hand" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Backdrop: faint ledger grid + one soft jade wash. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="graph-paper absolute inset-0 opacity-60 [mask-image:radial-gradient(120%_80%_at_75%_0%,black,transparent_70%)]" />
        <div className="absolute -top-32 right-[-12%] size-[38rem] rounded-full bg-jade-200/40 blur-[110px]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-ink-800/10" />
      </div>

      <div className="shell grid grid-cols-1 items-center gap-12 pb-14 pt-12 lg:grid-cols-12 lg:gap-10 lg:pb-20 lg:pt-20">
        <div className="lg:col-span-6 xl:col-span-5">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-ink-800/12 bg-white/70 px-3 py-1 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-smoke-600">
              <IconSpark className="size-3.5 text-jade-500" />
              Personal finance for India
            </span>
          </Reveal>

          <Reveal delay={60}>
            <h1 className="mt-6 font-display text-[2.6rem] leading-[1.04] tracking-[-0.02em] text-ink-800 sm:text-[3.4rem] lg:text-[4rem]">
              One <em className="text-jade-600">honest</em> picture of your money.
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <p className="mt-6 max-w-xl text-[1.02rem] leading-relaxed text-smoke-600 sm:text-[1.08rem]">
              Fermor pulls your accounts, investments and spending into one view — then
              explains it in plain language, with the maths shown. Built for young
              professionals and first-time investors in India, not day traders.
            </p>
          </Reveal>

          <Reveal delay={180}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="#waitlist" size="lg" className="w-full sm:w-auto">
                Join the early access list
                <ArrowRight className="size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
              </ButtonLink>
              <ButtonLink
                href="#how-it-works"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                See how it works
                <ArrowDown className="size-4 transition-transform duration-200 group-hover/btn:translate-y-0.5" />
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <p className="mt-4 text-[0.8rem] text-smoke-500">
              Free to start · No card · One email when your invite is ready
            </p>
          </Reveal>

          <Reveal delay={300}>
            <ul className="mt-10 grid grid-cols-3 divide-x divide-ink-800/10 border-t border-ink-800/10 pt-5">
              {FACTS.map((fact) => (
                <li key={fact.label} className="pl-4 first:pl-0">
                  <span className="tnum block font-mono text-[0.95rem] font-medium text-ink-800">
                    {fact.figure}
                  </span>
                  <span className="mt-1 block text-[0.72rem] leading-snug text-smoke-500">
                    {fact.label}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="lg:col-span-6 xl:col-span-7 xl:pl-6">
          <Reveal delay={120}>
            <ClarityPanel />
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-5 text-center text-[0.72rem] text-smoke-400 lg:text-left">
              A working preview — move the sliders, the numbers are computed in your
              browser exactly as the product does.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
