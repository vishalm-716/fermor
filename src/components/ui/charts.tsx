"use client";

import { useId } from "react";

/**
 * Tiny SVG chart kit — no chart library, no canvas, no extra JS.
 * Paths are built once per render and drawn with non-scaling strokes so
 * they stay crisp at every breakpoint.
 */

export function linePath(values: number[], width: number, height: number, pad = 6): string {
  if (values.length < 2) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stepX = width / (values.length - 1);

  const pts = values.map((v, i) => ({
    x: i * stepX,
    y: pad + (1 - (v - min) / span) * (height - pad * 2),
  }));

  // Midpoint smoothing: no overshoot, so charts never lie about a dip.
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 1; i < pts.length - 1; i += 1) {
    const midX = (pts[i].x + pts[i + 1].x) / 2;
    const midY = (pts[i].y + pts[i + 1].y) / 2;
    d += ` Q ${pts[i].x.toFixed(2)} ${pts[i].y.toFixed(2)} ${midX.toFixed(2)} ${midY.toFixed(2)}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
  return d;
}

export function areaPath(values: number[], width: number, height: number, pad = 6): string {
  const line = linePath(values, width, height, pad);
  if (!line) return "";
  return `${line} L ${width} ${height} L 0 ${height} Z`;
}

/**
 * Same shape as `linePath`, but against a fixed domain so several series
 * can share one scale — essential when drawing a forecast band.
 */
export function scaledPath(
  values: number[],
  domain: [number, number],
  width: number,
  height: number,
  pad = 8,
): string {
  if (values.length < 2) return "";
  const [min, max] = domain;
  const span = max - min || 1;
  const stepX = width / (values.length - 1);

  const pts = values.map((v, i) => ({
    x: i * stepX,
    y: pad + (1 - (v - min) / span) * (height - pad * 2),
  }));

  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 1; i < pts.length - 1; i += 1) {
    const midX = (pts[i].x + pts[i + 1].x) / 2;
    const midY = (pts[i].y + pts[i + 1].y) / 2;
    d += ` Q ${pts[i].x.toFixed(2)} ${pts[i].y.toFixed(2)} ${midX.toFixed(2)} ${midY.toFixed(2)}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
  return d;
}

export function Sparkline({
  values,
  height = 76,
  className = "",
  color = "var(--color-jade-500)",
  fillOpacity = 0.16,
  showEndDot = true,
  width = 300,
}: {
  values: number[];
  height?: number;
  className?: string;
  color?: string;
  fillOpacity?: number;
  showEndDot?: boolean;
  width?: number;
}) {
  const gradientId = `spark-${useId().replace(/[:]/g, "")}`;
  const lastX = width;
  const lastY =
    values.length > 1
      ? (() => {
          const min = Math.min(...values);
          const max = Math.max(...values);
          const span = max - min || 1;
          return 6 + (1 - (values[values.length - 1] - min) / span) * (height - 12);
        })()
      : height / 2;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      style={{ height, width: "100%" }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={fillOpacity} />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath(values, width, height)} fill={`url(#${gradientId})`} />
      <path
        d={linePath(values, width, height)}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      {showEndDot ? (
        <circle cx={lastX} cy={lastY} r={3.5} fill={color} vectorEffect="non-scaling-stroke" />
      ) : null}
    </svg>
  );
}

/** Horizontal allocation bar made of segments — used in the money view. */
export function AllocationBar({
  segments,
}: {
  segments: { label: string; value: number; className: string }[];
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  return (
    <div className="flex h-2 w-full gap-1 overflow-hidden rounded-full" role="presentation">
      {segments.map((segment) => (
        <span
          key={segment.label}
          className={`h-full rounded-full ${segment.className}`}
          style={{ width: `${(segment.value / total) * 100}%` }}
        />
      ))}
    </div>
  );
}
