"use client";

/**
 * One slider style for every calculator on the page:
 * label on the left, live value on the right, range input underneath.
 */
export function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
  hint,
  dark = false,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  format: (value: number) => string;
  hint?: string;
  dark?: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={id}
          className={`text-[0.82rem] ${dark ? "text-white/70" : "text-smoke-600"}`}
        >
          {label}
        </label>
        <output
          htmlFor={id}
          className={`tnum font-mono text-[0.86rem] font-medium ${
            dark ? "text-jade-200" : "text-ink-800"
          }`}
        >
          {format(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className={`slider mt-1.5 ${dark ? "slider-dark" : ""}`}
      />
      {hint ? (
        <p className={`text-[0.7rem] ${dark ? "text-white/40" : "text-smoke-400"}`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
