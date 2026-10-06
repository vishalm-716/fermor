/**
 * The maths behind every calculator on this page.
 *
 * Nothing here is hidden: the homepage prints the same formulas that these
 * functions implement, so a reader can check the numbers by hand.
 */

export type SeriesPoint = { year: number; invested: number; value: number };

/** Monthly compounding on a monthly contribution (SIP). */
export function sipFutureValue(
  monthlyAmount: number,
  annualRatePct: number,
  years: number,
): number {
  const i = annualRatePct / 100 / 12;
  const n = Math.max(1, Math.round(years * 12));
  if (i === 0) return monthlyAmount * n;
  // M = P × [ ((1+i)^n − 1) / i ] × (1+i)
  return monthlyAmount * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
}

/** Reducing-balance EMI, the way Indian lenders actually compute it. */
export function loanEmi(
  principal: number,
  annualRatePct: number,
  years: number,
): number {
  const r = annualRatePct / 100 / 12;
  const n = Math.max(1, Math.round(years * 12));
  if (r === 0) return principal / n;
  // EMI = P × r × (1+r)^n / ((1+r)^n − 1)
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

/**
 * Year-by-year accrual, used for the projection chart.
 * `shock` simulates a one-off market fall at the end of a given year —
 * the kind of "what if it happens in year three?" question people actually ask.
 */
export function sipSeries(
  monthlyAmount: number,
  annualRatePct: number,
  years: number,
  shock?: { atYear: number; dropPct: number },
): SeriesPoint[] {
  const months = Math.max(1, Math.round(years * 12));
  const i = annualRatePct / 100 / 12;
  const points: SeriesPoint[] = [{ year: 0, invested: 0, value: 0 }];
  let balance = 0;

  for (let m = 1; m <= months; m += 1) {
    balance = (balance + monthlyAmount) * (1 + i);
    if (m % 12 === 0 || m === months) {
      const year = Math.round((m / 12) * 10) / 10;
      if (shock && year === shock.atYear) {
        balance *= 1 - shock.dropPct / 100;
      }
      points.push({
        year,
        invested: monthlyAmount * m,
        value: balance,
      });
    }
  }

  return points;
}

/** The "what did the market actually do for me" number. */
export function absoluteReturn(invested: number, value: number): number {
  if (invested <= 0) return 0;
  return ((value - invested) / invested) * 100;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
