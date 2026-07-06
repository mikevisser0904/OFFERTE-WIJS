"use client";

type Point = { x: number; y: number };

type Props = {
  from: Point;
  to: Point;
};

export function GoudzoekerPijl({ from, to }: Props) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  if (len < 40) return null;

  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const perpX = (-dy / len) * 18;
  const perpY = (dx / len) * 18;
  const cx = mx + perpX;
  const cy = my + perpY;

  const pathD = `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;

  return (
    <svg
      className="pointer-events-none fixed inset-0 z-[90] h-full w-full"
      aria-hidden
    >
      <defs>
        <marker id="goud-pijl-kop" markerWidth="12" markerHeight="12" refX="9" refY="4" orient="auto">
          <path d="M0,0 L10,4 L0,8 Z" fill="#fbbf24" className="goud-pijl-kop" />
        </marker>
        <linearGradient id="goud-lijn-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#fde047" stopOpacity="1" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.9" />
        </linearGradient>
        <filter id="goud-gloed" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* zachte gloed onder lijn */}
      <path
        d={pathD}
        fill="none"
        stroke="#f59e0b"
        strokeWidth="8"
        opacity="0.2"
        filter="url(#goud-gloed)"
      />

      {/* geanimeerde stippellijn */}
      <path
        d={pathD}
        fill="none"
        stroke="url(#goud-lijn-grad)"
        strokeWidth="3"
        strokeDasharray="10 8"
        strokeLinecap="round"
        markerEnd="url(#goud-pijl-kop)"
        className="goud-pijl-lijn"
      />

      {/* zwevende goudstukjes langs de route */}
      <circle r="4" fill="#fde047" className="goud-deeltje goud-deeltje-1">
        <animateMotion dur="2.4s" repeatCount="indefinite" path={pathD} />
      </circle>
      <circle r="3" fill="#fbbf24" className="goud-deeltje goud-deeltje-2">
        <animateMotion dur="2.4s" begin="0.8s" repeatCount="indefinite" path={pathD} />
      </circle>
      <circle r="2.5" fill="#fef08a" className="goud-deeltje goud-deeltje-3">
        <animateMotion dur="2.4s" begin="1.6s" repeatCount="indefinite" path={pathD} />
      </circle>

      {/* doel: goudklomp */}
      <g className="goud-doel">
        <circle cx={to.x} cy={to.y} r="30" fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.4" className="goud-doel-ring" />
        <circle cx={to.x} cy={to.y} r="20" fill="none" stroke="#fde047" strokeWidth="1.5" opacity="0.6" className="goud-doel-ring-2" />
        <text
          x={to.x}
          y={to.y + 5}
          textAnchor="middle"
          fontSize="22"
          className="goud-doel-emoji"
        >
          🏆
        </text>
      </g>
    </svg>
  );
}