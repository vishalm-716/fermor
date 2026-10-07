"use client";

/**
 * MiniSIP — the "try it now" SIP calculator.
 *
 * Three sliders drive a live projected total and an animated SVG growth
 * chart. The chart draws two bands: what you put in (flat fill) and what
 * it grows to (jade line), so the gap between them *is* the story.
 *
 * All maths runs in the browser via the shared finance lib — same
 * formula the page prints. No login, no network.
 */

import { useId, useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { sipFutureValue, sipSeries, absoluteReturn } from "@/lib/finance";
import { inr, inrCompact } from "@/lib/format";

const VIEW_W = 320;
const VIEW_H = 132;

/** Build an SVG path (`d`) from a series, scaled into the view box. */
function toPath(
  points: { year: number; value: number }[],
  maxValue: number,
): string {
  if (points.length < 2 || maxValue <= 0) return "";
  const lastYear = points[points.length - 1].year || 1;
  return points
    .map((point, index) => {
      const x = (point.year / lastYear) * VIEW_W;
      const y = VIEW_H - (point.value / maxValue) * (VIEW_H - 8) - 4;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function MiniSIP() {
  const baseId = useId();
  const [monthly, setMonthly] = useState(15_000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);

  const { value, invested, gains, roi, growthPath, investedPath } = useMemo(() => {
    const future = sipFutureValue(monthly, rate, years);
    const contributed = monthly * years * 12;
    const series = sipSeries(monthly, rate, years);
    const maxValue = Math.max(future, contributed, 1);
    return {
      value: future,
      invested: contributed,
      gains: future - contributed,
      roi: absoluteReturn(contributed, future),
      growthPath: toPath(series, maxValue),
      investedPath: toPath(
        series.map((point) => ({ year: point.year, value: point.invested })),
        maxValue,
      ),
    };
  }, [monthly, rate, years]);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Slider
          id={`${baseId}-monthly`}
          label="Monthly SIP"
          value={monthly}
          min={500}
          max={100_000}
          step={500}
          onChange={setMonthly}
          format={(n) => inr(n)}
        />
        <Slider
          id={`${baseId}-rate`}
          label="Expected return"
          value={rate}
          min={6}
          max={18}
          step={0.5}
          onChange={setRate}
          format={(n) => `${n}% p.a.`}
        />
        <Slider
          id={`${baseId}-years`}
          label="Time horizon"
          value={years}
          min={1}
          max={30}
          step={1}
          onChange={setYears}
          format={(n) => `${n} ${n === 1 ? "year" : "years"}`}
        />
      </div>

      {/* Live total */}
      <div className="mt-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div>
          <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-smoke-500">
            Projected value in {years} {years === 1 ? "year" : "years"}
          </p>
          <p className="tnum mt-1 font-display text-[2rem] leading-none tracking-tight text-ink-800 sm:text-[2.35rem]">
            {inr(value)}
          </p>
        </div>
        <dl className="flex gap-5">
          <div>
            <dt className="text-[0.68rem] text-smoke-500">You invest</dt>
            <dd className="tnum font-mono text-[0.85rem] text-ink-800">
              {inrCompact(invested)}
            </dd>
          </div>
          <div>
            <dt className="text-[0.68rem] text-smoke-500">Gains</dt>
            <dd className="tnum font-mono text-[0.85rem] text-jade-600">
              {inrCompact(gains)}
            </dd>
          </div>
          <div>
            <dt className="text-[0.68rem] text-smoke-500">ROI</dt>
            <dd className="tnum font-mono text-[0.85rem] text-ink-800">
              {roi.toFixed(0)}%
            </dd>
          </div>
        </dl>
      </div>

      {/* Animated growth chart */}
      <figure className="mt-5">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="h-36 w-full"
          role="img"
          aria-label={`Growth chart: ${inr(invested)} invested grows to ${inr(value)} over ${years} years at ${rate}% expected return.`}
        >
          <defs>
            <linearGradient id={`${baseId}-fill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2fa47f" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#2fa47f" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* hairline grid */}
          {[0.25, 0.5, 0.75].map((fraction) => (
            <line
              key={fraction}
              x1="0"
              x2={VIEW_W}
              y1={VIEW_H * fraction}
              y2={VIEW_H * fraction}
              stroke="rgba(8,15,28,0.07)"
              strokeDasharray="2 4"
            />
          ))}

          {/* invested baseline */}
          <path
            d={investedPath}
            fill="none"
            stroke="#a9a598"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            style={{ transition: "d 320ms ease-out" }}
          />

          {/* growth area + line — both morph as sliders move */}
          <path
            d={`${growthPath} L${VIEW_W},${VIEW_H} L0,${VIEW_H} Z`}
            fill={`url(#${baseId}-fill)`}
            style={{ transition: "d 320ms ease-out" }}
          />
          <path
            d={growthPath}
            fill="none"
            stroke="#158a68"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: "d 320ms ease-out" }}
          />
        </svg>
        <figcaption className="mt-1.5 flex items-center justify-between font-mono text-[0.62rem] text-smoke-400">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 bg-jade-500" aria-hidden="true" />
              Projected
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="h-0.5 w-4 border-t border-dashed border-smoke-400"
                aria-hidden="true"
              />
              Your contributions
            </span>
          </span>
          <span>M = P × ((1+i)ⁿ − 1)/i × (1+i)</span>
        </figcaption>
      </figure>
    </div>
  );
}
