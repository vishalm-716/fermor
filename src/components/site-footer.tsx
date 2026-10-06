import { Mark } from "@/components/ui/icons";

const COLUMNS: { heading: string; links: { label: string; href?: string; note?: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Capabilities", href: "#capabilities" },
      { label: "Why Fermor", href: "#principles" },
      { label: "Early access", href: "#waitlist" },
    ],
  },
  {
    heading: "Tools",
    links: [
      { label: "SIP calculator", href: "#top" },
      { label: "Home loan EMI", href: "#capabilities" },
      { label: "Scenario planner", href: "#capabilities" },
      { label: "All 18 calculators", note: "ships at launch" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Contact", href: "mailto:hello@fermor.in" },
      { label: "Privacy", note: "ships with the app" },
      { label: "Terms", note: "ships with the app" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer data-theme="dark" className="bg-ink-950 text-paper">
      <div className="shell py-14 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 lg:grid-cols-12">
          <div className="sm:col-span-3 lg:col-span-5">
            <a href="#top" className="inline-flex items-center gap-2.5" aria-label="Fermor home">
              <Mark className="size-6 text-jade-300" />
              <span className="font-display text-[1.4rem] leading-none tracking-tight text-white">
                Fermor
              </span>
            </a>
            <p className="mt-4 max-w-xs text-[0.9rem] leading-relaxed text-white/55">
              Smart financial decisions for India. One clear view of your money, plain
              answers, and calculators that show their working.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/12 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-white/45">
              Built for India · Early access
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav
              key={column.heading}
              aria-label={column.heading}
              className="sm:col-span-1 lg:col-span-2"
            >
              <p className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-white/40">
                {column.heading}
              </p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <a
                        href={link.href}
                        className="link-sweep text-[0.86rem] text-white/70 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <>
                        <span className="block text-[0.86rem] text-white/40">
                          {link.label}
                        </span>
                        {link.note ? (
                          <span className="mt-0.5 block font-mono text-[0.58rem] uppercase tracking-[0.12em] text-white/25">
                            {link.note}
                          </span>
                        ) : null}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="max-w-3xl text-[0.72rem] leading-relaxed text-white/40">
            Fermor is a personal finance tool, not an investment adviser. Nothing on this
            page is investment advice or a recommendation to buy any product. Calculators
            use standard formulas and are illustrative — actual returns and taxes depend on
            your own situation. Figures shown on this page use sample data.
          </p>
          <div className="mt-6 flex flex-col gap-3 text-[0.72rem] text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Fermor. Made in India.</p>
            <p className="font-mono">
              Markets and tax rules change; we update the maths and note the date.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
