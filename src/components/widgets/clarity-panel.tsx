"use client";

import { useId, useMemo, useState, type KeyboardEvent } from "react";
import { Sparkline, AllocationBar } from "@/components/ui/charts";
import { Slider } from "@/components/ui/slider";
import { CountUp } from "@/components/ui/count-up";
import { IconLock, Mark } from "@/components/ui/icons";
import { absoluteReturn, sipFutureValue } from "@/lib/finance";
import { inr, inrCompact, indianNumber } from "@/lib/format";

const NET_WORTH = 32_40_000;

/** Twelve months of net worth in lakhs — a real-looking, unremarkable shape. */
const NET_WORTH_SERIES = [
  21.4, 22.1, 22.8, 22.3, 23.6, 25.0, 26.2, 26.9, 27.4, 29.1, 30.8, 32.4,
];

const ALLOCATION = [
  { label: "Mutual funds & equity", value: 18_60_000, dot: "bg-jade-500" },
  { label: "Fixed deposits & EPF", value: 7_20_000, dot: "bg-ink-500" },
  { label: "Cash & savings account", value: 6_60_000, dot: "bg-smoke-300" },
];

const INSIGHTS = [
  {
    tone: "clay",
    text: (
      <>
        <strong className="font-medium text-ink-800">₹2.4 L FD matures on 14 Nov.</strong>{" "}
        Renewed at today&apos;s rates it barely beats inflation — compare prepaying the
        home loan against reinvesting.
      </>
    ),
  },
  {
    tone: "jade",
    text: (
      <>
        <strong className="font-medium text-ink-800">Food delivery: ₹4,180 last month.</strong>{" "}
        That&apos;s 28% above your own six-month average. Not a lecture — just the number.
      </>
    ),
  },
];

type TabId = "money" | "sip";

export function ClarityPanel() {
  const [tab, setTab] = useState<TabId>("money");

  const tabs: { id: TabId; label: string }[] = [
    { id: "money", label: "Your money" },
    { id: "sip", label: "SIP calculator" },
  ];

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next = (index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
    setTab(tabs[next].id);
    document.getElementById(`clarity-tab-${tabs[next].id}`)?.focus();
  };

  return (
    <div className="relative">
      {/* Offset outline behind the panel — a small signal that this is composed, not pasted. */}
      <div
        aria-hidden="true"
        className="absolute -right-3 -top-3 hidden h-full w-full rounded-[1.9rem] border border-ink-800/12 sm:block"
      />

      <div className="relative overflow-hidden rounded-[1.6rem] border border-ink-800/10 bg-white shadow-[var(--shadow-panel)] sm:rounded-[1.9rem]">
        <div className="flex items-center justify-between gap-3 border-b border-ink-800/8 bg-paper/60 px-4 py-3 sm:px-5">
          <span className="flex items-center gap-2 text-[0.78rem] text-smoke-600">
            <Mark className="size-4 text-ink-800" />
            <span className="font-display text-[0.95rem] tracking-tight text-ink-800">
              Fermor
            </span>
            <span className="text-smoke-400">·</span>
            <span className="truncate">Household view</span>
          </span>
          <span className="shrink-0 rounded-full border border-ink-800/10 bg-white px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-smoke-500">
            Sample data
          </span>
        </div>

        {/* Segmented control */}
        <div
          role="tablist"
          aria-label="Preview the app"
          className="flex gap-1 border-b border-ink-800/8 px-4 py-2.5 sm:px-5"
        >
          {tabs.map((item, index) => (
            <button
              key={item.id}
              id={`clarity-tab-${item.id}`}
              role="tab"
              type="button"
              aria-selected={tab === item.id}
              aria-controls={`clarity-panel-${item.id}`}
              tabIndex={tab === item.id ? 0 : -1}
              onClick={() => setTab(item.id)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              className={`rounded-full px-3.5 py-1.5 text-[0.8rem] transition-colors duration-200 ${
                tab === item.id
                  ? "bg-ink-800 text-paper"
                  : "text-smoke-600 hover:bg-paper-2 hover:text-ink-800"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="min-h-[21.5rem] p-4 sm:min-h-[23rem] sm:p-6">
          {tab === "money" ? <MoneyView /> : <SipView />}
        </div>
      </div>
    </div>
  );
}

function MoneyView() {
  return (
    <div
      id="clarity-panel-money"
      role="tabpanel"
      aria-labelledby="clarity-tab-money"
      className="animate-[fade_320ms_ease-out]"
    >
      <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-smoke-500">
        Net worth · today
      </p>
      <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-2">
        <span className="font-display text-[2.15rem] leading-none tracking-tight text-ink-800 sm:text-[2.6rem]">
          <CountUp value={NET_WORTH} format={inrCompact} />
        </span>
        <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-jade-50 px-2 py-0.5 font-mono text-[0.68rem] text-jade-700">
          <span aria-hidden="true">▲</span> 4.6% this month
        </span>
      </div>

      <div className="mt-4">
        <Sparkline values={NET_WORTH_SERIES} height={72} />
        <div className="mt-1 flex justify-between font-mono text-[0.62rem] text-smoke-400">
          <span>Oct 2025</span>
          <span>Sep 2026</span>
        </div>
      </div>

      <div className="mt-5">
        <AllocationBar
          segments={ALLOCATION.map((item) => ({
            label: item.label,
            value: item.value,
            className: item.dot,
          }))}
        />
        <dl className="mt-3 space-y-1.5">
          {ALLOCATION.map((item) => (
            <div key={item.label} className="flex items-center justify-between text-[0.82rem]">
              <dt className="flex items-center gap-2 text-smoke-600">
                <span className={`size-2 rounded-full ${item.dot}`} aria-hidden="true" />
                {item.label}
              </dt>
              <dd className="tnum font-mono text-ink-800">{inrCompact(item.value)}</dd>
            </div>
          ))}
        </dl>
      </div>

      <ul className="mt-5 space-y-2">
        {INSIGHTS.map((insight) => (
          <li
            key={insight.tone}
            className="flex gap-3 rounded-xl border border-ink-800/8 bg-paper/70 px-3.5 py-3 text-[0.8rem] leading-relaxed text-smoke-600"
          >
            <span
              aria-hidden="true"
              className={`mt-1.5 size-1.5 shrink-0 rounded-full ${
                insight.tone === "jade" ? "bg-jade-400" : "bg-clay-400"
              }`}
            />
            <span>{insight.text}</span>
          </li>
        ))}
      </ul>

      <p className="mt-4 flex items-center gap-2 font-mono text-[0.66rem] text-smoke-400">
        <IconLock className="size-3.5" />
        4 accounts · 2 brokers · read-only access
      </p>
    </div>
  );
}

function SipView() {
  const monthlyId = useId();
  const rateId = useId();
  const yearsId = useId();

  const [monthly, setMonthly] = useState(10_000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);

  const { invested, value, gains, multiple } = useMemo(() => {
    const future = sipFutureValue(monthly, rate, years);
    const contributed = monthly * years * 12;
    return {
      invested: contributed,
      value: future,
      gains: future - contributed,
      multiple: contributed > 0 ? future / contributed : 0,
    };
  }, [monthly, rate, years]);

  return (
    <div
      id="clarity-panel-sip"
      role="tabpanel"
      aria-labelledby="clarity-tab-sip"
      className="animate-[fade_320ms_ease-out]"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Slider
          id={monthlyId}
          label="Monthly SIP"
          value={monthly}
          min={500}
          max={100_000}
          step={500}
          onChange={setMonthly}
          format={(n) => inr(n)}
        />
        <Slider
          id={rateId}
          label="Expected return"
          value={rate}
          min={6}
          max={18}
          step={0.5}
          onChange={setRate}
          format={(n) => `${n}% p.a.`}
        />
        <Slider
          id={yearsId}
          label="Time horizon"
          value={years}
          min={1}
          max={30}
          step={1}
          onChange={setYears}
          format={(n) => `${n} ${n === 1 ? "year" : "years"}`}
        />
      </div>

      <div className="mt-5 rounded-2xl border border-ink-800/8 bg-paper/70 p-4 sm:p-5">
        <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-smoke-500">
          Projected value in {years} {years === 1 ? "year" : "years"}
        </p>
        <p className="tnum mt-1.5 font-display text-[2.1rem] leading-none tracking-tight text-ink-800">
          {inr(value)}
        </p>

        {/* Ledger rows on phones, three columns from small screens up. */}
        <dl className="mt-4 grid grid-cols-1 gap-3 border-t border-ink-800/8 pt-3.5 sm:grid-cols-3">
          <div className="flex items-baseline justify-between gap-3 sm:block">
            <dt className="text-[0.7rem] text-smoke-500">You invest</dt>
            <dd className="tnum font-mono text-[0.85rem] text-ink-800 sm:mt-0.5">
              {inrCompact(invested)}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-3 sm:block">
            <dt className="text-[0.7rem] text-smoke-500">Estimated gains</dt>
            <dd className="tnum font-mono text-[0.85rem] text-jade-600 sm:mt-0.5">
              {inrCompact(gains)}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-3 sm:block">
            <dt className="text-[0.7rem] text-smoke-500">Return on investment</dt>
            <dd className="tnum font-mono text-[0.85rem] text-ink-800 sm:mt-0.5">
              {absoluteReturn(invested, value).toFixed(0)}%
            </dd>
          </div>
        </dl>
      </div>

      {/* Transparent maths: the same formula the code runs. */}
      <div className="mt-4 rounded-xl border border-dashed border-ink-800/20 bg-white px-3.5 py-3">
        <p className="font-mono text-[0.68rem] leading-relaxed text-ink-700">
          M = P × ((1 + i)ⁿ − 1) / i × (1 + i)
        </p>
        <p className="mt-1 font-mono text-[0.66rem] leading-relaxed text-smoke-500">
          i = {rate}% ÷ 12 = {rate % 12 === 0 ? rate / 12 : (rate / 12).toFixed(4)}% monthly ·
          n = {years * 12} months · P = {inr(monthly)}
        </p>
      </div>

      <p className="mt-3 text-[0.7rem] leading-relaxed text-smoke-500">
        Projection at a steady rate, compounded monthly. Real markets move in both
        directions, and returns are taxed — {indianNumber(years)} years is a long time.
      </p>
    </div>
  );
}
