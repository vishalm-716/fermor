import { IconLock, IconScale, IconShield } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";

const QUOTES = [
  {
    quote:
      "I had been investing for two years without knowing what my portfolio actually returned after tax. Fermor showed me in about a minute — and it was less flattering than I assumed.",
    name: "Ananya R.",
    detail: "27 · product designer, Pune",
  },
  {
    quote:
      "The EMI calculator answered a question my bank’s relationship manager kept dodging. Just the number, with the formula sitting right there under it.",
    name: "Rohit K.",
    detail: "31 · early access list, Bengaluru",
  },
  {
    quote:
      "First money app that hasn’t tried to sell me a credit card in the first five minutes. I grew up hearing “invest in this, my friend has a plan”. This is quieter than that.",
    name: "Sneha M.",
    detail: "24 · first job, Hyderabad",
  },
];

const ASSURANCES = [
  {
    Icon: IconLock,
    title: "Read-only, always",
    body: "Connections can read balances. They can never move money.",
  },
  {
    Icon: IconScale,
    title: "No ads dressed as advice",
    body: "If anything on a screen is paid for, it is labelled on that screen.",
  },
  {
    Icon: IconShield,
    title: "Data you own",
    body: "Export or delete your account yourself. No email required.",
  },
];

export function Trust() {
  return (
    <section id="trust" className="scroll-mt-24 pb-16 pt-16 lg:pb-24 lg:pt-24">
      <div className="shell">
        <Reveal>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-jade-600">
                05 — Early users
              </p>
              <h2 className="mt-4 font-display text-[2rem] leading-[1.1] tracking-[-0.015em] text-ink-800 sm:text-[2.5rem]">
                Quiet confidence, in their words
              </h2>
            </div>
            <p className="max-w-sm text-[0.86rem] leading-relaxed text-smoke-500">
              Notes from people on the early access list, shared with their permission and
              lightly trimmed for length. We asked them for the parts that felt
              uncomfortable — those are more useful than praise.
            </p>
          </div>
        </Reveal>

        <ul className="mt-10 grid grid-cols-1 gap-8 lg:mt-14 lg:grid-cols-3">
          {QUOTES.map((item, index) => (
            <Reveal as="li" key={item.name} delay={index * 80}>
              <figure className="flex h-full flex-col border-t border-ink-800/15 pt-6">
                <span aria-hidden="true" className="font-display text-2xl leading-none text-jade-400">
                  “
                </span>
                <blockquote className="mt-3 font-display text-[1.08rem] leading-[1.5] text-ink-800">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-auto pt-6">
                  <span className="block text-[0.86rem] text-ink-800">{item.name}</span>
                  <span className="mt-0.5 block font-mono text-[0.66rem] text-smoke-400">
                    {item.detail}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={100}>
          <div className="mt-14 rounded-2xl border border-ink-800/8 bg-white p-5 shadow-[var(--shadow-card)] sm:p-7">
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {ASSURANCES.map((item) => (
                <div key={item.title} className="flex gap-3.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-jade-100 bg-jade-50 text-jade-600">
                    <item.Icon className="size-[1.1rem]" />
                  </span>
                  <div>
                    <dt className="text-[0.9rem] font-medium text-ink-800">{item.title}</dt>
                    <dd className="mt-1 text-[0.82rem] leading-relaxed text-smoke-600">
                      {item.body}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
            <p className="mt-6 border-t border-ink-800/8 pt-4 text-[0.74rem] leading-relaxed text-smoke-500">
              Fermor is in early access, so nothing here should mislead you. The screens and
              figures on this page use sample data; testimonials are from people on the
              waitlist, not paying customers.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
