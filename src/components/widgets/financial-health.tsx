"use client";

/**
 * FinancialHealth — the four-input score demo.
 *
 * Same four inputs the product's Clarity score uses (savings rate,
 * emergency cover, debt load, investing consistency), each mapped to a
 * 0–100 sub-score and combined with visible weights. The badge, ring and
 * verdict line all update on the same frame as the sliders.
 *
 * The weights are printed on the card on purpose: a score you can't audit
 * is just a number pretending to be advice.
 */

import { useId, useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { clamp } from "@/lib/finance";

type Band = {
  label: string;
  verdict: string;
  color: string;
  track: string;
};

const BANDS: Band[] = [
  {
    label: "Fragile",
    verdict:
      "One bad month could push you to borrow. The fastest win is a small auto-transfer on payday — even ₹2,000 starts the habit.",
    color: "text-clay-500",
    track: "bg-clay-400",
  },
  {
    label: "Getting there",
    verdict:
      "The bones are in place. Close the emergency-fund gap first — it protects every other plan you make.",
    color: "text-smoke-600",
    track: "bg-smoke-400",
  },
  {
    label: "Steady",
    verdict:
      "You're covering the essentials and investing regularly. The next lever is raising savings rate, not chasing returns.",
    color: "text-jade-600",
    track: "bg-jade-400",
  },
  {
    label: "Strong",
    verdict:
      "Solid across all four inputs. At this point the work is maintenance: rebalance yearly and keep goals priced in today's rupees.",
    color: "text-jade-700",
    track: "bg-jade-500",
  },
];

const WEIGHTS = {
  savings: 0.3,
  emergency: 0.25,
  debt: 0.25,
  consistency: 0.2,
} as const;

/** 0–100 sub-scores for each input. */
function scoreSavings(ratePct: number) {
  return clamp((ratePct / 40) * 100, 0, 100); // 40% savings = full marks
}
function scoreEmergency(months: number) {
  return clamp((months / 6) * 100, 0, 100); // six months = full marks
}
function scoreDebt(ratioPct: number) {
  return clamp((1 - ratioPct / 50) * 100, 0, 100); // 0% debt = full, 50%+ = 0
}
function scoreConsistency(pct: number) {
  return clamp(pct, 0, 100);
}

export function FinancialHealth() {
  const baseId = useId();
  const [savingsRate, setSavingsRate] = useState(22);
  const [emergencyMonths, setEmergencyMonths] = useState(3);
  const [debtRatio, setDebtRatio] = useState(28);
  const [consistency, setConsistency] = useState(70);

  const { total, parts, band, ringDash } = useMemo(() => {
    const savings = scoreSavings(savingsRate);
    const emergency = scoreEmergency(emergencyMonths);
    const debt = scoreDebt(debtRatio);
    const consistent = scoreConsistency(consistency);

    const weighted =
      savings * WEIGHTS.savings +
      emergency * WEIGHTS.emergency +
      debt * WEIGHTS.debt +
      consistent * WEIGHTS.consistency;
    const rounded = Math.round(weighted);

    const bandIndex = rounded < 40 ? 0 : rounded < 60 ? 1 : rounded < 80 ? 2 : 3;

    const circumference = 2 * Math.PI * 34;
    return {
      total: rounded,
      parts: [
        { key: "savings", label: "Savings rate", value: savings, weight: WEIGHTS.savings },
        {
          key: "emergency",
          label: "Emergency cover",
          value: emergency,
          weight: WEIGHTS.emergency,
        },
        { key: "debt", label: "Debt load", value: debt, weight: WEIGHTS.debt },
        {
          key: "consistency",
          label: "Investing consistency",
          value: consistent,
          weight: WEIGHTS.consistency,
        },
      ],
      band: BANDS[bandIndex],
      ringDash: (rounded / 100) * circumference,
    };
  }, [savingsRate, emergencyMonths, debtRatio, consistency]);

  const circumference = 2 * Math.PI * 34;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Slider
          id={`${baseId}-savings`}
          label="Savings rate"
          value={savingsRate}
          min={0}
          max={60}
          step={1}
          onChange={setSavingsRate}
          format={(n) => `${n}% of income`}
        />
        <Slider
          id={`${baseId}-emergency`}
          label="Emergency fund"
          value={emergencyMonths}
          min={0}
          max={12}
          step={0.5}
          onChange={setEmergencyMonths}
          format={(n) => `${n} ${n === 1 ? "month" : "months"}`}
        />
        <Slider
          id={`${baseId}-debt`}
          label="Debt repayments"
          value={debtRatio}
          min={0}
          max={70}
          step={1}
          onChange={setDebtRatio}
          format={(n) => `${n}% of income`}
        />
        <Slider
          id={`${baseId}-consistency`}
          label="Investing consistency"
          value={consistency}
          min={0}
          max={100}
          step={5}
          onChange={setConsistency}
          format={(n) => `${n}% of planned months`}
        />
      </div>

      {/* Score badge + ring */}
      <div className="mt-6 rounded-2xl border border-ink-800/8 bg-paper/70 p-4 sm:p-5">
        <div className="flex items-center gap-4">
          <div className="relative size-[5.25rem] shrink-0">
            <svg viewBox="0 0 80 80" className="size-full -rotate-90" aria-hidden="true">
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="rgba(8,15,28,0.09)"
                strokeWidth="7"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
                className={band.color}
                strokeDasharray={circumference}
                strokeDashoffset={circumference - ringDash}
                style={{ transition: "stroke-dashoffset 380ms ease-out, stroke 300ms ease" }}
              />
            </svg>
            <span className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="tnum font-display text-[1.5rem] leading-none text-ink-800">
                {total}
              </span>
              <span className="font-mono text-[0.55rem] text-smoke-400">/100</span>
            </span>
          </div>

          <div className="min-w-0">
            <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-smoke-500">
              Clarity score
            </p>
            <p className={`mt-0.5 font-display text-[1.4rem] leading-tight ${band.color}`}>
              {band.label}
            </p>
            <p className="mt-1.5 text-[0.82rem] leading-relaxed text-smoke-600">
              {band.verdict}
            </p>
          </div>
        </div>

        {/* Sub-scores with their weights — the audit trail. */}
        <ul className="mt-4 space-y-2.5 border-t border-ink-800/8 pt-3.5">
          {parts.map((part) => (
            <li key={part.key}>
              <div className="flex items-baseline justify-between text-[0.74rem]">
                <span className="text-smoke-600">
                  {part.label}
                  <span className="ml-1.5 font-mono text-[0.62rem] text-smoke-400">
                    ×{part.weight.toFixed(2)}
                  </span>
                </span>
                <span className="tnum font-mono text-ink-700">
                  {Math.round(part.value)}
                </span>
              </div>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-paper-2">
                <span
                  className={`block h-full rounded-full ${band.track}`}
                  style={{
                    width: `${part.value}%`,
                    transition: "width 380ms ease-out, background-color 300ms ease",
                  }}
                />
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-3.5 font-mono text-[0.64rem] leading-relaxed text-smoke-500">
          score = savings×0.30 + emergency×0.25 + debt×0.25 + consistency×0.20 — a
          demo of the product&apos;s scoring, not financial advice.
        </p>
      </div>
    </div>
  );
}
