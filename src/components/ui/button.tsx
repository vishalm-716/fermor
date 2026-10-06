import type { ButtonHTMLAttributes, ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "onDark" | "onDarkGhost";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2 font-medium transition-[transform,background-color,border-color,box-shadow,color] duration-200 ease-out will-change-transform disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink-800 text-paper shadow-[0_10px_24px_-14px_rgba(8,15,28,0.9)] hover:bg-ink-700 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none",
  secondary:
    "bg-transparent text-ink-800 border border-ink-800/20 hover:border-ink-800/45 hover:bg-white/70 hover:-translate-y-0.5 active:translate-y-0",
  ghost: "bg-transparent text-ink-700 hover:text-jade-700",
  onDark:
    "bg-jade-400 text-ink-900 shadow-[0_12px_30px_-16px_rgba(47,164,127,0.9)] hover:bg-jade-300 hover:-translate-y-0.5 active:translate-y-0",
  onDarkGhost:
    "border border-white/20 text-paper hover:border-white/45 hover:bg-white/5 hover:-translate-y-0.5 active:translate-y-0",
};

const sizes: Record<Size, string> = {
  md: "rounded-xl px-5 py-3 text-[0.9rem]",
  lg: "rounded-xl px-6 py-3.5 text-[0.95rem]",
};

export function buttonClass(
  variant: Variant = "primary",
  size: Size = "md",
  extra = "",
): string {
  return [base, variants[variant], sizes[size], extra]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ComponentProps<"a"> & { variant?: Variant; size?: Size }) {
  return (
    <a className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </a>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
