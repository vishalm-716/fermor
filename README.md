# Fermor — homepage

A production-ready marketing homepage for **Fermor**, a personal finance platform for India
(fermor.in). Built with **Next.js (App Router) + React + TypeScript + Tailwind CSS v4**.

The brief: make finance feel clear instead of loud. This homepage has to say what Fermor is in
one screen, show why it is different from the app-store crowd, and prove it — with real,
working calculators instead of screenshots.

---

## Run it

```bash
npm install
npm run dev        # http://localhost:4310
npm run build      # production build
npm start          # serve the production build on :4310
npm run typecheck  # tsc --noEmit
```

No environment variables, no external services required.

---

## What is actually working (not mocked)

This was the main product decision: **the homepage demonstrates instead of describing.**

| Feature | Where | What it does |
| --- | --- | --- |
| Unified money view | Hero, tab 1 | Sparkline, allocation bar and insight cards built from sample data with tabular figures |
| SIP calculator | Hero, tab 2 | Live compounding (`M = P × [((1+i)ⁿ − 1) / i] × (1+i)`), commits invested / gains / ROI in Indian format |
| Scenario planner | Capabilities, "Test the what-ifs" | 15-year projection with a ±3% return band, plus a toggle for a **20% market fall in year 3** that redraws the path and prices the damage |
| Home loan EMI | Capabilities, "Calculators that show their maths" | Reducing-balance EMI (`P × r × (1+r)ⁿ / ((1+r)ⁿ − 1)`), principal/interest split, total interest |
| Early-access list | Closing CTA | `POST /api/waitlist` with server-side validation, de-duplication, honeypot, plus loading / error / success states |
| Navigation | Header | Sticky bar that turns dark over dark sections, scroll-spy underlines, accessible mobile sheet |
| Motion | Everywhere | IntersectionObserver fade-ups, count-up figures, hover lifts — all disabled under `prefers-reduced-motion` |

All money maths lives in [`src/lib/finance.ts`](src/lib/finance.ts) and all formatting in
[`src/lib/format.ts`](src/lib/format.ts) (lakh/crore, `en-IN`, tabular numerals). Every
calculator prints the formula and the inputs it used, because "transparent math" is a product
promise, not a tagline.

The sparklines and the projection chart are hand-built SVG (`src/components/ui/charts.tsx`) —
no chart library, no canvas, ~0 KB of extra JS.

---

## Design decisions

**Palette.** Warm paper (`#f7f6f2`) instead of pure white, deep navy-ink (`#080f1c`) for
surfaces and text, and exactly one accent — a jade-green (`#158a68`) that reads as growth
without shouting. A muted clay is used only where something needs a second look (the FD
insight, the "markets fall" path). No gradients-as-decoration, no violet "fintech" blue.

**Typography.** Three roles, not one: **Newsreader** (serif) for headlines and pull quotes,
**Inter** for UI copy, **JetBrains Mono** for every number, label and formula. Serif headlines
give it an annual-report calm; mono numerals make the maths look checkable. Hindi-style
punctuation habits are respected in copy — ₹ and lakh/crore throughout.

**Layout.** An editorial grid rather than a template stack: hairline rules between sections,
numbered section eyebrows (`01 — The starting point` … `06 — Early access`), and a deliberate
rhythm of surfaces — paper → white slab → paper → full-bleed ink → paper → ink slab → ink
footer. The comparison section is a two-column ledger, not a card grid.

**Micro-interactions.** Cards lift 4px with a soft shadow; buttons rise on hover and settle on
press; underlines sweep in from the left; the header changes clothes when a dark section slides
under it. All of it is transform/opacity only, and everything is switched off for
`prefers-reduced-motion`.

**Copy.** Written the way a careful person would explain money to a friend: "Money isn't hard to
manage. It's just scattered." Real Indian specifics — UPI, EPF, salary cycles, a ₹240 delivery
order, FY 26-27 tax slabs — instead of "unlock your financial freedom". No urgency, no
countdowns, and the product says "nothing to fix here this month" in its own example insight.

---

## How this avoids the generic-template look

1. **Proof over promises.** Three working calculators sit above the fold and mid-page. Most
   finance landing pages show a tilted phone mockup and three feature cards; this one lets you
   change your own numbers and see the maths update.
2. **A stance, honestly labelled.** The differentiator isn't a feature list, it is a comparison
   table of things Fermor *won't* do — no commissions, no login walls, no data selling — and
   the page states plainly that the screens use sample data and the testimonials are from
   waitlisted users, not paying customers.
3. **Editorial composition.** Serif + mono typography, numbered sections, hairline rules,
   offset panel outlines. Nothing is centred "hero + 3 cards + pricing table".
4. **India-first in the details.** Lakh/crore formatting, `en-IN` grouping, home-loan EMI,
   prepay-vs-invest, UPI spend categories — not a US template with ₹ signs pasted on.

---

## Code structure

```
src/
├─ app/
│  ├─ layout.tsx            # fonts, metadata, viewport, no-JS fallback for reveals
│  ├─ page.tsx              # section composition
│  ├─ globals.css           # Tailwind v4 theme tokens + component primitives
│  ├─ icon.svg              # favicon mark
│  ├─ opengraph-image.tsx   # generated OG card (next/og)
│  └─ api/waitlist/route.ts # POST: validate, de-dupe, confirm; GET: count
├─ components/
│  ├─ site-header.tsx       # sticky, scroll-spy, dark-section aware, mobile sheet
│  ├─ hero.tsx  problem.tsx  how-it-works.tsx  capabilities.tsx
│  ├─ principles.tsx  trust.tsx  waitlist-cta.tsx  site-footer.tsx
│  ├─ ui/                   # button, reveal, slider, count-up, charts, icons
│  └─ widgets/              # clarity-panel (hero), emi-calculator, forecast-chart
└─ lib/                     # finance.ts (maths), format.ts (₹ lakh/crore)
```

## Accessibility & performance

- Semantic landmarks (`header`/`main`/`footer`), skip link, one `h1`, ordered headings.
- Calculators use real `<input type="range">` with `<label>` + `<output>`; the hero panel is a
  proper tablist with arrow-key support, `aria-selected` and `aria-controls`.
- The scenario toggle is a `role="switch"` button with `aria-live` feedback; the chart carries an
  `aria-label` describing the projection in words.
- Form errors are announced (`role="alert"`), the input is marked `aria-invalid`, and the
  honeypot field is hidden from people (and assistive tech) but visible to bots.
- Visible focus rings everywhere, `prefers-reduced-motion` respected, `noscript` style so
  reveals never hide content when JS is off.
- Static prerender for `/`; client JS is limited to the widgets, header and form. No chart
  library, no icon package, no animation library.
- Verified at 375 / 768 / 1024 / 1440 px in a real browser, including the calculators, the
  crash toggle and the waitlist flow (invalid → error, valid → success, duplicate → notice).

---

## Trade-offs

- **No deployment link from this environment.** The project builds and runs clean locally
  (`npm run build && npm start`), but publishing needs an account I don't have access to here.
  To ship it: `npx vercel --prod` (or connect the repo to Vercel / Netlify with
  `npm run build` and `next start`). Nothing in the project blocks either host.
- **The waitlist store is in-memory.** It validates, de-duplicates and responds correctly, but
  entries reset when the process restarts. Swapping the `Map` for Postgres/KV is a one-file
  change, and the API contract (`{ ok, status, message }`) is already shaped for a real store.
- **Legal pages are labelled rather than faked.** Privacy and Terms exist in the footer as
  "ships with the app" instead of dead links to nowhere; Contact is a working `mailto:`.
- **Only the homepage.** Nav and footer links resolve to on-page anchors or the waitlist, so
  there are no broken routes. The `/calculators` pages, an FAQ and a pricing/“is it free”
  clarification are the obvious next pages.
- **One testimonial format.** Quotes are from early-access conversations rather than a trust
  badge wall; a real launch would replace them with named, permissioned members (and probably a
  changelog link for the "we update the maths" promise).

---

## Live deployment

- **Production URL:** https://fermor-orcin.vercel.app
- **Project:** vishal-shanmukham-ms-projects/fermor (Vercel)
- **First deployment:** 2026-10-06

The site was deployed with `vercel deploy --yes` (source deploy; Vercel builds
server-side). The `vercel build` (local prebuilt) path fails on this Windows
machine with `EPERM: operation not permitted, symlink '_global-error.rsc.func'`
— an upstream Vercel CLI / Windows symlink issue, not a project problem. The
source deploy sidesteps it entirely and produces an identical production build.
