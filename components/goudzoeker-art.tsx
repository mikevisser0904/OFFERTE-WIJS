"use client";

import { useId } from "react";

/** Gouden munt — puur SVG */
export function SvgMunt({ uid, x = 0, y = 0, scale = 1 }: { uid: string; x?: number; y?: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="11" rx="9" ry="2.5" fill="#000" opacity="0.25" />
      <circle r="9" fill={`url(#${uid}-munt)`} />
      <circle r="7.2" fill="none" stroke="#fff8dc" strokeWidth="0.6" opacity="0.45" />
      <circle r="5.5" fill="none" stroke="#b45309" strokeWidth="0.4" opacity="0.35" />
      <path d="M-4 -2.5 Q0 -4.5 4 -2.5" fill="none" stroke="#fef3c7" strokeWidth="0.8" opacity="0.7" />
      <text x="0" y="2.5" textAnchor="middle" fill="#92400e" fontSize="7" fontWeight="bold" fontFamily="Georgia, serif">
        €
      </text>
    </g>
  );
}

/** Goudklomp / nugget */
export function SvgNugget({ uid, x = 0, y = 0, scale = 1, rot = 0 }: { uid: string; x?: number; y?: number; scale?: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
      <path
        d="M0 -8 C5 -9 9 -4 8 1 C7 7 2 9 -3 7 C-8 5 -9 0 -6 -5 Z"
        fill={`url(#${uid}-nugget)`}
        stroke="#b45309"
        strokeWidth="0.6"
      />
      <path d="M-2 -4 C1 -6 4 -3 3 0" fill="none" stroke="#fef9c3" strokeWidth="1" opacity="0.65" strokeLinecap="round" />
    </g>
  );
}

/** Stersparkle */
export function SvgSparkle({ x, y, size = 6, fill = "#fde047" }: { x: number; y: number; size?: number; fill?: string }) {
  const h = size / 2;
  return (
    <path
      d={`M${x} ${y - h} L${x + h * 0.3} ${y - h * 0.3} L${x + h} ${y} L${x + h * 0.3} ${y + h * 0.3} L${x} ${y + h} L${x - h * 0.3} ${y + h * 0.3} L${x - h} ${y} L${x - h * 0.3} ${y - h * 0.3} Z`}
      fill={fill}
    />
  );
}

/** Doelmarkering: goudader met klompjes */
export function GoudDoelIllustratie({ x, y }: { x: number; y: number }) {
  const uid = useId().replace(/:/g, "");

  return (
    <g className="goud-doel" transform={`translate(${x} ${y})`}>
      <defs>
        <radialGradient id={`${uid}-doel-gloed`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fde047" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-nugget`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="45%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      <circle r="34" fill={`url(#${uid}-doel-gloed)`} className="goud-doel-ring" />
      <circle r="24" fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.45" className="goud-doel-ring" />
      <circle r="16" fill="none" stroke="#fde047" strokeWidth="1.5" opacity="0.65" className="goud-doel-ring-2" />

      {/* goudberg */}
      <ellipse cx="0" cy="8" rx="18" ry="10" fill="#78350f" opacity="0.5" />
      <path
        d="M-16 6 Q-8 -6 0 -2 Q8 -8 16 4 L14 10 Q0 14 -14 10 Z"
        fill="#92400e"
        opacity="0.85"
      />
      <path
        d="M-12 4 Q-4 -8 2 -4 Q10 -10 14 0 L10 8 Q0 10 -10 8 Z"
        fill={`url(#${uid}-nugget)`}
        className="goud-doel-berg"
      />
      <path d="M-6 -2 Q0 -6 6 0 L4 5 Q0 6 -4 4 Z" fill="#fde68a" opacity="0.9" />
      <SvgNugget uid={uid} x={-10} y={-6} scale={0.55} rot={-15} />
      <SvgNugget uid={uid} x={11} y={-4} scale={0.45} rot={20} />
      <SvgSparkle x={-14} y={-12} size={5} />
      <SvgSparkle x={16} y={-10} size={4} fill="#fbbf24" />

      {/* klein pikhouweel in het goud */}
      <g transform="translate(6 -10) rotate(35)" className="goud-doel-pik">
        <rect x="-1.5" y="-2" width="3" height="14" rx="1" fill="#a16207" />
        <path d="M-6 -4 L6 -6 L5 0 L-5 2 Z" fill="#94a3b8" />
        <path d="M-5 -5 L-2 -6 L-1 0 L-4 1 Z" fill="#fde047" />
      </g>
    </g>
  );
}

/** Klein avatar-icoontje voor chat-header */
export function GoudzoekerAvatarMini({ className = "h-9 w-9" }: { className?: string }) {
  const uid = useId().replace(/:/g, "");

  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${uid}-mini-huid`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fde8d0" />
          <stop offset="100%" stopColor="#d4a574" />
        </linearGradient>
        <linearGradient id={`${uid}-mini-hoed`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="#2a1f0a" />
      <ellipse cx="24" cy="40" rx="14" ry="4" fill="#f59e0b" opacity="0.25" />
      <ellipse cx="24" cy="28" rx="12" ry="13" fill={`url(#${uid}-mini-huid)`} />
      <ellipse cx="24" cy="14" rx="16" ry="5" fill={`url(#${uid}-mini-hoed)`} />
      <path d="M10 14 Q24 2 38 14 Z" fill={`url(#${uid}-mini-hoed)`} />
      <circle cx="19" cy="27" r="2" fill="#1e293b" />
      <circle cx="29" cy="27" r="2" fill="#1e293b" />
      <path d="M18 32 Q24 36 30 32" fill="none" stroke="#c2410c" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="8" y="30" width="5" height="14" rx="2" fill="#a16207" transform="rotate(-30 10 37)" />
      <path d="M4 26 L10 24 L9 30 L3 32 Z" fill="#94a3b8" transform="rotate(-30 7 28)" />
    </svg>
  );
}

/** Gedeelde gradients — één keer per character-SVG */
export function GoudGradients({ uid }: { uid: string }) {
  return (
    <defs>
      <radialGradient id={`${uid}-glow`} cx="50%" cy="40%" r="55%">
        <stop offset="0%" stopColor="#fde68a" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${uid}-huid`} x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor="#fde8d0" />
        <stop offset="55%" stopColor="#f0c49a" />
        <stop offset="100%" stopColor="#d4a574" />
      </linearGradient>
      <linearGradient id={`${uid}-overall`} x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stopColor="#4f6fa8" />
        <stop offset="100%" stopColor="#2c4a7c" />
      </linearGradient>
      <linearGradient id={`${uid}-overall-licht`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#6b8fc4" />
        <stop offset="100%" stopColor="#3d5f94" />
      </linearGradient>
      <linearGradient id={`${uid}-leer`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#a16207" />
        <stop offset="100%" stopColor="#713f12" />
      </linearGradient>
      <linearGradient id={`${uid}-hoed`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>
      <linearGradient id={`${uid}-bandana`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#b91c1c" />
      </linearGradient>
      <linearGradient id={`${uid}-hout`} x1="0" y1="0" x2="0.2" y2="1">
        <stop offset="0%" stopColor="#d4a574" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>
      <linearGradient id={`${uid}-metaal`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#cbd5e1" />
        <stop offset="50%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#64748b" />
      </linearGradient>
      <linearGradient id={`${uid}-munt`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fef9c3" />
        <stop offset="40%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#ca8a04" />
      </linearGradient>
      <linearGradient id={`${uid}-nugget`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
      <linearGradient id={`${uid}-zak`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#d6b88a" />
        <stop offset="100%" stopColor="#a68b5b" />
      </linearGradient>
      <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.35" />
      </filter>
    </defs>
  );
}