import { Reveal } from "@/components/ui/reveal";

const PAINS = [
  {
    n: "01",
    title: "Six apps, no single number",
    body: "Salary lands in one account, SIPs sit with two brokers, an old FD matures somewhere, and UPI spending disappears into a feed. Nowhere does it add up to one figure you can trust.",
  },
  {
    n: "02",
    title: "Advice with a commission attached",
    body: "The “best” fund usually turns out to be the one paying the most. Words like XIRR and expense ratio get used to end the conversation instead of explaining it.",
  },
  {
    n: "03",
    title: "Today’s spends and your 2035 goal live in different worlds",
    body: "A ₹240 delivery order and a ₹5,000 SIP feel unrelated. Over twenty years one compounds and the other doesn’t — and nothing connects the two decisions.",
  },
];

export function Problem() {
  return (
    <section id="problem" className="relative scroll-mt-24 pb-16 pt-6 lg:pb-28 lg:pt-10">
      <div className="shell grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-jade-600">
              01 — The starting point
            </p>
            <h2 className="mt-4 font-display text-[2rem] leading-[1.1] tracking-[-0.015em] text-ink-800 sm:text-[2.5rem]">
              Money isn’t hard to manage. It’s just scattered.
            </h2>
            <p className="mt-5 max-w-md text-[0.98rem] leading-relaxed text-smoke-600">
              Most people don’t have a spending problem or an investing problem. They
              have a visibility problem — and nobody gets paid to fix that one.
            </p>
            <p className="mt-6 max-w-md border-l-2 border-jade-300 pl-4 text-[0.92rem] leading-relaxed text-ink-700">
              Fermor starts from a plain idea: if you can see everything clearly, you’ll
              decide better. No nudges, no fear, no sales calls.
            </p>
          </Reveal>
        </div>

        <ul className="border-b border-ink-800/10 lg:col-span-7">
          {PAINS.map((pain, index) => (
            <Reveal as="li" key={pain.n} delay={index * 80}>
              <div className="group relative border-t border-ink-800/10 py-7 transition-colors lg:py-9">
                <div className="flex gap-5 sm:gap-7">
                  <span className="tnum font-mono text-[0.8rem] text-smoke-400 transition-colors duration-300 group-hover:text-jade-500 sm:pt-1">
                    {pain.n}
                  </span>
                  <div className="max-w-xl">
                    <h3 className="text-[1.08rem] font-medium leading-snug text-ink-800 sm:text-[1.15rem]">
                      {pain.title}
                    </h3>
                    <p className="mt-2.5 text-[0.92rem] leading-relaxed text-smoke-600">
                      {pain.body}
                    </p>
                  </div>
                </div>
                <span
                  aria-hidden="true"
                  className="absolute inset-y-6 left-[-1.25rem] hidden w-[2px] scale-y-0 rounded-full bg-jade-400 transition-transform duration-300 group-hover:scale-y-100 lg:block"
                  style={{ transformOrigin: "top" }}
                />
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
