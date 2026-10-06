"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mark, Menu, Cross } from "@/components/ui/icons";
import { ButtonLink } from "@/components/ui/button";

const NAV = [
  { href: "#how-it-works", label: "How it works", id: "how-it-works" },
  { href: "#capabilities", label: "Capabilities", id: "capabilities" },
  { href: "#principles", label: "Why Fermor", id: "principles" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const frame = useRef(0);

  /**
   * The page alternates between paper and ink sections, so the header
   * changes clothes when a dark section slides underneath it.
   */
  useEffect(() => {
    const darkSections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-theme="dark"]'),
    );

    const measure = () => {
      frame.current = 0;
      setScrolled(window.scrollY > 10);
      const probe = 44; // a point just inside the sticky bar
      setOverDark(
        darkSections.some((section) => {
          const rect = section.getBoundingClientRect();
          return rect.top <= probe && rect.bottom >= probe;
        }),
      );
    };

    const request = () => {
      if (!frame.current) frame.current = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  // Scroll spy: underline the section you are actually reading.
  useEffect(() => {
    const sections = NAV.map((item) => document.getElementById(item.id)).filter(
      (node): node is HTMLElement => Boolean(node),
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0.01, 0.2, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const close = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [menuOpen, close]);

  const dark = overDark && scrolled;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-ink-800 focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
      >
        Skip to content
      </a>

      {/* Utility strip — the India-first, no-nonsense tone in one line. */}
      <div className="hidden bg-ink-900 text-paper sm:block">
        <div className="shell flex h-9 items-center justify-between text-[0.72rem] tracking-wide">
          <span className="inline-flex items-center gap-2">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-jade-300 opacity-70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-jade-300" />
            </span>
            Early access is open — invites going out in batches
          </span>
          <span className="flex items-center gap-5 text-white/60">
            <span className="hidden md:inline">Calculators need no login</span>
            <span className="hidden lg:inline">Read-only connections</span>
            <span className="font-mono">Made for India</span>
          </span>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-colors duration-300 ${
          scrolled || menuOpen
            ? dark
              ? "border-b border-white/10 bg-ink-900/95 backdrop-blur-md"
              : "border-b border-ink-800/10 bg-paper/95 backdrop-blur-md"
            : "border-b border-transparent"
        }`}
      >
        <div className="shell flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
          <a
            href="#top"
            className="group flex items-center gap-2.5 rounded-lg py-2"
            aria-label="Fermor home"
          >
            <Mark
              className={`size-6 transition-transform duration-300 group-hover:-translate-y-px ${
                dark ? "text-jade-300" : "text-ink-800"
              }`}
            />
            <span
              className={`font-display text-[1.4rem] leading-none tracking-tight transition-colors ${
                dark ? "text-white" : "text-ink-800"
              }`}
            >
              Fermor
            </span>
          </a>

          <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                data-active={active === item.id}
                className={`link-sweep text-[0.9rem] transition-colors ${
                  dark
                    ? "text-white/65 hover:text-white data-[active=true]:text-white"
                    : "text-ink-700/80 hover:text-ink-800 data-[active=true]:text-ink-800"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <ButtonLink href="#waitlist" variant={dark ? "onDarkGhost" : "secondary"}>
                Join early access
              </ButtonLink>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className={`inline-flex size-10 items-center justify-center rounded-xl border transition-colors md:hidden ${
                dark
                  ? "border-white/20 text-white hover:bg-white/10"
                  : "border-ink-800/15 text-ink-800 hover:bg-white/70"
              }`}
            >
              {menuOpen ? <Cross className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile sheet */}
        <div
          id="mobile-nav"
          hidden={!menuOpen}
          className={`rounded-b-2xl border-t shadow-[0_24px_48px_-28px_rgba(8,15,28,0.45)] md:hidden ${
            dark
              ? "border-white/10 bg-ink-900"
              : "border-ink-800/10 bg-paper"
          }`}
        >
          <nav aria-label="Mobile" className="shell flex flex-col py-3">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={close}
                className={`border-b py-4 text-lg last:border-0 ${
                  dark
                    ? "border-white/10 text-white/85"
                    : "border-ink-800/8 text-ink-800"
                }`}
              >
                {item.label}
              </a>
            ))}
            <ButtonLink
              href="#waitlist"
              variant={dark ? "onDark" : "primary"}
              size="lg"
              className="mt-4 w-full"
              onClick={close}
            >
              Join early access
            </ButtonLink>
          </nav>
        </div>
      </header>
    </>
  );
}
