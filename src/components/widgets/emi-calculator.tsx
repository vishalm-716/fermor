"use client";

import { useId, useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { loanEmi } from "@/lib/finance";
import { inr, inrCompact } from "@/lib/format";

/**
 * Home-loan EMI, computed live from the same formula lenders use.
 * The point of putting this on the homepage is that nobody has to
 * sign up (or hand over a phone number) to check it.
 */
export function EmiCalculator() {
  const amountId = useId();
  const rateId = useId();
  const yearsId = useId();

  const [amount, setAmount] = useState(45_00_000);
  const [rate, setRate] = useState(8.6);
  const [years, setYears] = useState(20);

  const { emi, total, interest, principalShare } = useMemo(() => {
    const monthly = loanEmi(amount, rate, years);
    const totalPayment = monthly * years * 12;
    return {
      emi: monthly,
      total: totalPayment,
      interest: totalPayment - amount,
      principalShare: (amount / totalPayment) * 100,
    };
  }, [amount, rate, years]);

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
      <div className="space-y-4">
        <Slider
          id={amountId}
          label="Loan amount"
          value={amount}
          min={5_00_000}
          max={2_00_00_000}
          step={1_00_000}
          onChange={setAmount}
          format={inrCompact}
        />
        <Slider
          id={rateId}
          label="Interest rate"
          value={rate}
          min={6}
          max={14}
          step={0.1}
          onChange={setRate}
          format={(n) => `${n.toFixed(1)}% p.a.`}
          hint="Most home loans in India sit between 8% and 10%."
        />
        <Slider
          id={yearsId}
          label="Tenure"
          value={years}
          min={5}
          max={30}
          step={1}
          onChange={setYears}
          format={(n) => `${n} years`}
        />
      </div>

      <div className="rounded-2xl border border-ink-800/8 bg-paper/70 p-4">
        <p className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-smoke-500">
          Monthly EMI
        </p>
        <p className="tnum mt-1 font-display text-[1.9rem] leading-none tracking-tight text-ink-800">
          {inr(emi)}
        </p>

        <div className="mt-4 flex h-2 overflow-hidden rounded-full">
          <span className="h-full bg-jade-500" style={{ width: `${principalShare}%` }} />
          <span className="h-full flex-1 bg-clay-400" />
        </div>
        <div className="mt-2 flex justify-between font-mono text-[0.62rem] text-smoke-500">
          <span>Principal {principalShare.toFixed(0)}%</span>
          <span>Interest {(100 - principalShare).toFixed(0)}%</span>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-ink-800/8 pt-3.5">
          {/* two columns is enough here: two numbers, one comparison */}
          <div>
            <dt className="text-[0.68rem] text-smoke-500">Total interest</dt>
            <dd className="tnum mt-0.5 font-mono text-[0.85rem] text-ink-800">
              {inrCompact(interest)}
            </dd>
          </div>
          <div>
            <dt className="text-[0.68rem] text-smoke-500">Total you pay</dt>
            <dd className="tnum mt-0.5 font-mono text-[0.85rem] text-ink-800">
              {inrCompact(total)}
            </dd>
          </div>
        </dl>

        <div className="mt-4 rounded-lg border border-dashed border-ink-800/20 bg-white px-3 py-2">
          <p className="font-mono text-[0.64rem] leading-relaxed text-ink-700">
            EMI = P × r × (1+r)ⁿ ÷ ((1+r)ⁿ − 1)
          </p>
          <p className="mt-1 font-mono text-[0.6rem] leading-relaxed text-smoke-500">
            r = {(rate / 1200).toFixed(5)} monthly · n = {years * 12} months · P ={" "}
            {inrCompact(amount)}
          </p>
        </div>
      </div>
    </div>
  );
}
