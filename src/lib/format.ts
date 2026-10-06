/**
 * Money formatting helpers.
 * India formats numbers in lakhs and crores, so we never fall back to
 * international "K / M / B" notation.
 */

const inrWhole = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const plainIndian = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function inr(value: number): string {
  return inrWhole.format(Math.round(value));
}

export function indianNumber(value: number): string {
  return plainIndian.format(Math.round(value));
}

function trim(value: number, decimals = 2): string {
  return value
    .toFixed(decimals)
    .replace(/\.0+$/, "")
    .replace(/(\.\d*?)0+$/, "$1");
}

/** ₹1,25,00,000 -> "₹1.25 Cr". Used for large headline figures. */
export function inrCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_00_00_000) return `₹${trim(value / 1_00_00_000)} Cr`;
  if (abs >= 1_00_000) return `₹${trim(value / 1_00_000)} L`;
  if (abs >= 1_000) return `₹${trim(value / 1_000, 1)}k`;
  return inr(value);
}
