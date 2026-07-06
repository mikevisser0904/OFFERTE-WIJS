"use client";

import { useId } from "react";
import { GoudDoelIllustratie } from "@/components/goudzoeker-art";

type Point = { x: number; y: number };

type Props = {
  from: Point;
  to: Point;
};

export function GoudzoekerPijl({ from, to }: Props) {
  const uid = useId().replace(/:/g, "");
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  if (len < 40) return null;

  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const perpX = (-dy / len) * 22;
  const perpY = (dx / len) * 22;
  const cx = mx + perpX;
  const cy = my + perpY;

  const pathD = `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;

  return (
    <svg className="pointer-events-none fixed inset-0 z-[90] h-full w-full" aria-hidden>
      <defs>
        <marker id={`${uid}-pijl-kop`} markerWidth="14" markerHeight="14" refX="10" refY="5" orient="auto">
          <path d="M0 0 L12 5 L0 10 L3 5 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
        </marker>
        <linearGradient id={`${uid}-lijn`} gradientUnits="userSpaceOnUse" x1={from.x} y1={from.y} x2={to.x} y2={to.y}>
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
          <stop offset="45%" stopColor="#fde047" stopOpacity="1" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.95" />
        </linearGradient>
        <radialGradient id={`${uid}-deeltje`}>
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="60%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
        <filter id={`${uid}-gloed`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path d={pathD} fill="none" stroke="#f59e0b" strokeWidth="10" opacity="0.18" filter={`url(#${uid}-gloed)`} />

      <path
        d={pathD}
        fill="none"
        stroke={`url(#${uid}-lijn)`}
        strokeWidth="3.5"
        strokeDasharray="12 9"
        strokeLinecap="round"
        markerEnd={`url(#${uid}-pijl-kop)`}
        className="goud-pijl-lijn"
      />

      {/* gouddeeltjes langs de route — illustrated blobs */}
      <g className="goud-deeltje goud-deeltje-1">
        <circle r="5" fill={`url(#${uid}-deeltje)`} />
        <animateMotion dur="2.6s" repeatCount="indefinite" path={pathD} />
      </g>
      <g className="goud-deeltje goud-deeltje-2">
        <circle r="3.5" fill="#fde047" />
        <animateMotion dur="2.6s" begin="0.85s" repeatCount="indefinite" path={pathD} />
      </g>
      <g className="goud-deeltje goud-deeltje-3">
        <path d="M-3 -2 C2 -3 4 0 3 3 C1 5 -2 4 -3 1 Z" fill="#fbbf24" />
        <animateMotion dur="2.6s" begin="1.7s" repeatCount="indefinite" path={pathD} />
      </g>

      <GoudDoelIllustratie x={to.x} y={to.y} />
    </svg>
  );
}