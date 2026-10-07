import type { ReactNode, SVGProps } from "react";

/**
 * Hand-drawn icon set: 24px grid, 1.5px strokes, round joins.
 * Kept in one file so every section shares one visual grammar.
 */

type IconProps = SVGProps<SVGSVGElement> & { children?: ReactNode };

function Glyph({ children, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

/** Wordmark glyph: three growth bars, read left to right like a report. */
export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="3" y="13.5" width="4.6" height="7.5" rx="1.6" fill="currentColor" opacity="0.32" />
      <rect x="9.7" y="8.5" width="4.6" height="12.5" rx="1.6" fill="currentColor" opacity="0.6" />
      <rect x="16.4" y="3" width="4.6" height="18" rx="1.6" fill="currentColor" />
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M4 12h15" />
      <path d="M13.5 6.5 20 12l-6.5 5.5" />
    </Glyph>
  );
}

export function ArrowDown(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M12 4v15" />
      <path d="M6 13.5 12 20l6-6.5" />
    </Glyph>
  );
}

export function Check(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M5 12.5 9.5 17 19 6.5" />
    </Glyph>
  );
}

export function Cross(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M7 7l10 10" />
      <path d="M17 7 7 17" />
    </Glyph>
  );
}

export function Plus(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </Glyph>
  );
}

export function Menu(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M4 7.5h16" />
      <path d="M4 12h16" />
      <path d="M4 16.5h10" />
    </Glyph>
  );
}

/** Connect: two accounts joined through a read-only handshake. */
export function IconConnect(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="3" y="4.5" width="7" height="6" rx="2" />
      <rect x="14" y="13.5" width="7" height="6" rx="2" />
      <path d="M6.5 10.5v4a3 3 0 0 0 3 3H14" />
      <path d="M12 7.5h1.5a3 3 0 0 1 3 3" />
    </Glyph>
  );
}

/** Understand: a lens over a small bar chart. */
export function IconUnderstand(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="11" cy="10.5" r="6.5" />
      <path d="M8 12.5v-2" />
      <path d="M11 12.5v-4" />
      <path d="M14 12.5v-2.5" />
      <path d="M15.8 15.4 20.5 20" />
    </Glyph>
  );
}

/** Act: a decision point with a chosen path. */
export function IconAct(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 12h8.5" />
      <path d="M12 3.5V8" />
    </Glyph>
  );
}

export function IconLedger(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M7.5 9h9" />
      <path d="M7.5 12.5h5.5" />
      <path d="M7.5 16h7" />
    </Glyph>
  );
}

export function IconInsight(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M4 6.5h9.5a2.5 2.5 0 0 1 2.5 2.5v5a2.5 2.5 0 0 1-2.5 2.5H10L6 20v-3.5H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z" />
      <path d="M7 11.5h6" />
      <circle cx="19.5" cy="5.5" r="1.6" />
    </Glyph>
  );
}

export function IconPulse(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M3 12.5h3.5l2-5 3 10 2.5-6 1.8 3.5H21" />
    </Glyph>
  );
}

export function IconForecast(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M3.5 19.5V4.5" />
      <path d="M3.5 19.5h17" />
      <path d="M6.5 15.5c2-1 3-4.5 5-4.5s2.5 2 4-1" />
      <path d="M16.5 10c1 .5 2 2 2.5 4" strokeDasharray="2.5 2.5" />
      <path d="M15 17.5h6" strokeDasharray="2.5 2.5" />
    </Glyph>
  );
}

export function IconCalculator(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="5" y="3" width="14" height="18" rx="3" />
      <path d="M8.5 7.5h7" />
      <path d="M9 12h.01" />
      <path d="M12 12h.01" />
      <path d="M15 12h.01" />
      <path d="M9 16h.01" />
      <path d="M12 16h.01" />
      <path d="M15 16h.01" />
    </Glyph>
  );
}

export function IconShield(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M12 3.5 19 6v5.5c0 4.2-2.8 7.4-7 9-4.2-1.6-7-4.8-7-9V6l7-2.5Z" />
      <path d="M9.2 12.2 11.4 14.4 15 10.2" />
    </Glyph>
  );
}

export function IconLock(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="3" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
      <path d="M12 14.5v2.5" />
    </Glyph>
  );
}

export function IconScale(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M12 4.5v15" />
      <path d="M6.5 19.5h11" />
      <path d="M4.5 7.5h15" />
      <path d="M4.5 7.5 2 13.5a3.1 3.1 0 0 0 5 0L4.5 7.5Z" />
      <path d="M19.5 7.5 17 13.5a3.1 3.1 0 0 0 5 0L19.5 7.5Z" />
    </Glyph>
  );
}

/** Rupee glyph set as text — recognisable, and honest about it. */
export function IconRupee(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect
        x="3.75"
        y="3.75"
        width="16.5"
        height="16.5"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <text
        x="12"
        y="16.1"
        textAnchor="middle"
        fontSize="11.5"
        fontWeight="600"
        fill="currentColor"
        fontFamily="var(--font-mono-jet), ui-monospace, monospace"
      >
        ₹
      </text>
    </svg>
  );
}

/** Phone-first: the layout most of India actually browses on. */
export function IconPhone(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="6.5" y="2.5" width="11" height="19" rx="3" />
      <path d="M10 5.5h4" />
      <path d="M11 18.2h2" />
    </Glyph>
  );
}

/** A small ledger/receipt: the disclosure card in Transparency. */
export function IconReceipt(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M5 3.5h14v17l-2.3-1.6-2.35 1.6L12 18.9l-2.35 1.6L7.3 18.9 5 20.5v-17Z" />
      <path d="M8.5 8h7" />
      <path d="M8.5 11.5h7" />
      <path d="M8.5 15h4" />
    </Glyph>
  );
}

export function IconSpark(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M12 3.5v4" />
      <path d="M12 16.5v4" />
      <path d="M3.5 12h4" />
      <path d="M16.5 12h4" />
      <path d="M6.5 6.5 9 9" />
      <path d="M15 15l2.5 2.5" />
      <path d="M17.5 6.5 15 9" />
      <path d="M9 15l-2.5 2.5" />
    </Glyph>
  );
}
