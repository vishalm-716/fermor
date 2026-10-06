"use client";

import { useId, useMemo, useState } from "react";
import { scaledPath } from "@/components/ui/charts";
import { Slider } from "@/components/ui/slider";
import { sipSeries } from "@/lib/finance";
import { inrCompact } from "@/lib/format";

const YEARS = 15;
const WIDTH = 320;
const HEIGHT = 132;

/**
 * Scenario modelling, without pretending to be a crystal ball:
 * one line for a steady return, one shading for "returns vary",
 * and an optional 20% fall in year three so the trade-off is visible.
 */
export function ForecastChart() {
  const monthlyId = useId();
  const rateId = useId();

  const [monthly, setMonthly] = useState(15_000);
  const [rate, setRate] = useState(11);
  const [crash, setCrash] = useState(false);

  const model = useMemo(() => {
    const expected = sipSeries(monthly, rate, YEARS);
    const low = sipSeries(monthly, Math.max(0.5, rate - 3), YEARS);
    const high = sipSeries(monthly, rate + 3, YEARS);
    const shocked = sipSeries(monthly, rate, YEARS, { atYear: 3, dropPct: 20 });

    const max = Math.max(...high.map((p) => p.value));
    const domain: [number, number] = [0, max * 1.06];

    const expectedEnd = expected[expected.length - 1].value;
    const shockedEnd = shocked[shocked.length - 1].value;

    return {
      expected,
      low,
      high,
      shocked,
      domain,
      expectedEnd,
      shockedEnd,
      invested: expected[expected.length - 1].invested,
      gap: expectedEnd - shockedEnd,
      gapPct: expectedEnd > 0 ? ((expectedEnd - shockedEnd) / expectedEnd) * 100 : 0,
    };
  }, [monthly, rate]);

  const { domain } = model;
  const half = domain[1] / 2;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Slider
          id={monthlyId}
          label="Investing every month"
          value={monthly}
          min={2_000}
          max={60_000}
          step={1_000}
          onChange={setMonthly}
          format={inrCompact}
        />
        <Slider
          id={rateId}
          label="Assuming a return of"
          value={rate}
          min={6}
          max={16}
          step={0.5}
          onChange={setRate}
          format={(n) => `${n}% p.a.`}
        />
      </div>

      <div className="mt-5 rounded-2xl border border-ink-800/8 bg-paper p-3.5 sm:p-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-smoke-500">
            Value after {YEARS} years
          </p>
          <p className="tnum font-mono text-[0.95rem] text-ink-800">
            {inrCompact(model.expectedEnd)}
          </p>
        </div>

        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="none"
          style={{ width: "100%", height: HEIGHT }}
          role="img"
          aria-label={`Projection: investing ${inrCompact(monthly)} a month for ${YEARS} years at ${rate}% could reach about ${inrCompact(model.expectedEnd)}. You would have invested ${inrCompact(model.invested)}.`}
          className="mt-2"
        >
          {/* gridlines */}
          {[0, half, domain[1]].map((line) => {
            const y = 8 + (1 - line / domain[1]) * (HEIGHT - 16);
            return (
              <line
                key={line}
                x1="0"
                x2={WIDTH}
                y1={y}
                y2={y}
                stroke="rgba(11,20,36,0.10)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}

          {/* range band: return assumptions never arrive as one clean number */}
          <path
            d={`${scaledPath(
              model.high.map((p) => p.value),
              domain,
              WIDTH,
              HEIGHT,
            )} L ${WIDTH} ${HEIGHT} L 0 ${HEIGHT} Z`}
            fill="rgba(21,138,104,0.10)"
          />
          {/* carve the band back out with the card colour so only the range shows */}
          <path
            d={`${scaledPath(
              model.low.map((p) => p.value),
              domain,
              WIDTH,
              HEIGHT,
            )} L ${WIDTH} ${HEIGHT} L 0 ${HEIGHT} Z`}
            fill="#f7f6f2"
          />

          {/* invested capital — the floor you can count on */}
          <path
            d={scaledPath(
              model.expected.map((p) => p.invested),
              domain,
              WIDTH,
              HEIGHT,
            )}
            fill="none"
            stroke="rgba(11,20,36,0.28)"
            strokeWidth="1.25"
            strokeDasharray="4 3"
            vectorEffect="non-scaling-stroke"
          />

          {crash ? (
            <path
              d={scaledPath(
                model.shocked.map((p) => p.value),
                domain,
                WIDTH,
                HEIGHT,
              )}
              fill="none"
              stroke="#bd8440"
              strokeWidth="2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ) : null}

          <path
            d={scaledPath(
              model.expected.map((p) => p.value),
              domain,
              WIDTH,
              HEIGHT,
            )}
            fill="none"
            stroke="#158a68"
            strokeWidth="2.25"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="mt-1 flex justify-between font-mono text-[0.6rem] text-smoke-400">
          {[0, 5, 10, 15].map((year) => (
            <span key={year}>{year === 0 ? "now" : `yr ${year}`}</span>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[0.62rem] text-smoke-500">
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded-full bg-jade-500" aria-hidden="true" />
            one steady return
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-4 rounded-sm bg-jade-500/15" aria-hidden="true" />
            returns 3% higher or lower
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded-full bg-ink-800/30" aria-hidden="true" />
            money you put in
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={crash}
          onClick={() => setCrash((value) => !value)}
          className={`group inline-flex items-center gap-3 rounded-full border px-3.5 py-2 text-[0.78rem] transition-colors duration-200 ${
            crash
              ? "border-clay-400 bg-clay-300/20 text-ink-800"
              : "border-ink-800/15 bg-white text-smoke-600 hover:border-ink-800/35"
          }`}
        >
          <span
            aria-hidden="true"
            className={`relative h-4 w-7 rounded-full transition-colors duration-200 ${
              crash ? "bg-clay-400" : "bg-smoke-300"
            }`}
          >
            <span
              className={`absolute top-0.5 size-3 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                crash ? "translate-x-3.5" : "translate-x-0.5"
              }`}
            />
          </span>
          Markets fall 20% in year 3
        </button>

        <p
          aria-live="polite"
          className={`tnum font-mono text-[0.68rem] ${crash ? "text-clay-500" : "text-smoke-400"}`}
        >
          {crash
            ? `cost by year 15: ${inrCompact(model.gap)} (${model.gapPct.toFixed(0)}%)`
            : "assumes you keep investing through the dip"}
        </p>
      </div>

      {crash ? (
        <p className="mt-3 rounded-xl border border-clay-300/60 bg-clay-300/10 px-3.5 py-3 text-[0.78rem] leading-relaxed text-ink-700">
          A 20% fall in year three would leave you around{" "}
          <strong className="font-medium">{inrCompact(model.shockedEnd)}</strong> instead of{" "}
          {inrCompact(model.expectedEnd)}. Notice how much smaller the gap is than the crash
          itself — monthly investing keeps buying through the fall. That is the whole argument
          for SIPs, and you just watched it happen.
        </p>
      ) : null}
    </div>
  );
}
