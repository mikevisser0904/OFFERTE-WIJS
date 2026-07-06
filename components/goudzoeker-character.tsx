"use client";

type Props = {
  wijstHoek?: number | null;
  agentOpen?: boolean;
  euro?: string;
};

export function GoudzoekerCharacter({ wijstHoek, agentOpen, euro }: Props) {
  return (
    <div
      className={`relative h-[7.5rem] w-[7.5rem] ${agentOpen ? "goud-agent-modus" : "goud-mijn-modus"}`}
      aria-hidden
    >
      <div className="goudzoeker-scene relative h-full w-full">
      {/* zwevende munten */}
      <span className="goud-munt goud-munt-1">🪙</span>
      <span className="goud-munt goud-munt-2">✨</span>
      <span className="goud-munt goud-munt-3">💰</span>

      <svg
        viewBox="0 0 120 140"
        className="goudzoeker-svg h-full w-full drop-shadow-[0_8px_24px_rgba(245,158,11,0.45)]"
        role="img"
        aria-label="Goudzoeker"
      >
        <defs>
          <radialGradient id="goud-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fde68a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="overall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="huid" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fcd9b6" />
            <stop offset="100%" stopColor="#e8b88a" />
          </linearGradient>
        </defs>

        {/* gloed achter figuur */}
        <ellipse cx="60" cy="118" rx="34" ry="8" fill="url(#goud-glow)" className="goud-schaduw" />
        <circle cx="60" cy="70" r="42" fill="url(#goud-glow)" opacity="0.35" className="goud-aura" />

        {/* stofwolk bij hakken */}
        <g className="goud-stof">
          <ellipse cx="38" cy="108" rx="10" ry="4" fill="#d4a574" opacity="0.5" />
          <ellipse cx="48" cy="112" rx="8" ry="3" fill="#c49a6c" opacity="0.4" />
          <ellipse cx="32" cy="114" rx="6" ry="2" fill="#e8c9a0" opacity="0.35" />
        </g>

        {/* sparkles */}
        <g className="goud-sparkles">
          <path d="M22 52 L24 56 L28 56 L25 59 L26 63 L22 60 L18 63 L19 59 L16 56 L20 56 Z" fill="#fde047" />
          <path d="M94 44 L95 47 L98 47 L96 49 L97 52 L94 50 L91 52 L92 49 L90 47 L93 47 Z" fill="#fbbf24" />
          <path d="M88 78 L89 80 L91 80 L90 82 L91 84 L88 82 L85 84 L86 82 L85 80 L87 80 Z" fill="#fef08a" />
        </g>

        <g className="goud-body-bob">
          {/* benen */}
          <rect x="44" y="98" width="14" height="22" rx="4" fill="#78350f" />
          <rect x="62" y="98" width="14" height="22" rx="4" fill="#78350f" />
          <ellipse cx="51" cy="122" rx="10" ry="5" fill="#451a03" />
          <ellipse cx="69" cy="122" rx="10" ry="5" fill="#451a03" />

          {/* torso */}
          <rect x="38" y="72" width="44" height="30" rx="8" fill="url(#overall)" />
          <rect x="52" y="72" width="16" height="30" rx="2" fill="#fbbf24" opacity="0.85" />
          <circle cx="60" cy="82" r="3" fill="#fde68a" />
          <circle cx="60" cy="92" r="3" fill="#fde68a" />

          {/* hoofd */}
          <circle cx="60" cy="58" r="20" fill="url(#huid)" />
          <ellipse cx="60" cy="66" rx="12" ry="8" fill="#d4a574" opacity="0.35" />

          {/* ogen */}
          <g className="goud-blik">
            <circle cx="52" cy="56" r="3.5" fill="#1e293b" />
            <circle cx="68" cy="56" r="3.5" fill="#1e293b" />
            <circle cx="53" cy="55" r="1.2" fill="#fff" />
            <circle cx="69" cy="55" r="1.2" fill="#fff" />
          </g>

          {/* mond - opgewonden */}
          <path
            d="M54 64 Q60 70 66 64"
            fill="none"
            stroke="#b45309"
            strokeWidth="2"
            strokeLinecap="round"
            className="goud-glimlach"
          />

          {/* hoed */}
          <g className="goud-hat">
            <ellipse cx="60" cy="42" rx="28" ry="6" fill="#92400e" />
            <path d="M42 42 Q60 18 78 42 Z" fill="#b45309" />
            <rect x="42" y="40" width="36" height="5" rx="2" fill="#78350f" />
          </g>

          {/* linkerarm + pikhouweel */}
          <g className="goud-pik-arm" style={{ transformOrigin: "48px 78px" }}>
            <rect x="30" y="74" width="18" height="8" rx="4" fill="url(#huid)" transform="rotate(-20 48 78)" />
            <g className="goud-pikhouweel">
              <rect x="14" y="58" width="5" height="36" rx="2" fill="#a8a29e" transform="rotate(-35 16 76)" />
              <path
                d="M6 52 L22 48 L20 58 L4 62 Z"
                fill="#94a3b8"
                transform="rotate(-35 14 55)"
              />
              <path
                d="M4 50 L8 46 L12 54 L6 58 Z"
                fill="#fbbf24"
                transform="rotate(-35 8 52)"
                className="goud-pik-tip"
              />
            </g>
          </g>

          {/* wijsarm — draait naar doel */}
          <g
            className="goud-wijs-wrapper"
            style={{
              transformOrigin: "72px 78px",
              transform: wijstHoek != null ? `rotate(${wijstHoek}deg)` : "rotate(-35deg)",
            }}
          >
            <g className="goud-wijs-arm">
              <rect x="72" y="74" width="22" height="8" rx="4" fill="url(#huid)" />
              <circle cx="96" cy="78" r="5" fill="url(#huid)" />
              <rect x="94" y="74" width="4" height="10" rx="2" fill="url(#huid)" className="goud-vinger" />
            </g>
          </g>
        </g>

        {/* Eureka badge */}
        {euro && !agentOpen && (
          <g className="goud-eureka">
            <rect x="72" y="8" width="44" height="22" rx="6" fill="#422006" stroke="#fbbf24" strokeWidth="1.5" />
            <text x="94" y="23" textAnchor="middle" fill="#fde68a" fontSize="9" fontWeight="bold" fontFamily="system-ui">
              Goud!
            </text>
          </g>
        )}

        {agentOpen && (
          <g className="goud-chat-bubble-mini">
            <ellipse cx="96" cy="24" rx="14" ry="10" fill="#4c1d95" stroke="#a78bfa" strokeWidth="1.5" />
            <text x="96" y="27" textAnchor="middle" fill="#e9d5ff" fontSize="10" fontFamily="system-ui">
              💬
            </text>
          </g>
        )}
      </svg>

      <span className="goud-label-badge">Goudzoeker</span>
      </div>
    </div>
  );
}