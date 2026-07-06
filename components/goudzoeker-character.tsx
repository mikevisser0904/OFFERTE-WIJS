"use client";

import { useId } from "react";
import { GoudGradients, SvgMunt, SvgNugget, SvgSparkle } from "@/components/goudzoeker-art";

type Props = {
  wijstHoek?: number | null;
  agentOpen?: boolean;
  euro?: string;
};

export function GoudzoekerCharacter({ wijstHoek, agentOpen, euro }: Props) {
  const uid = useId().replace(/:/g, "");

  return (
    <div
      className={`relative h-[8.75rem] w-[8.75rem] ${agentOpen ? "goud-agent-modus" : "goud-mijn-modus"}`}
      aria-hidden
    >
      <div className="goudzoeker-scene relative h-full w-full">
        <svg
          viewBox="0 0 200 220"
          className="goudzoeker-svg h-full w-full"
          role="img"
          aria-label="Goudzoeker"
        >
          <GoudGradients uid={uid} />
          <g filter={`url(#${uid}-soft)`}>

          {/* achtergrond gloed */}
          <circle cx="100" cy="108" r="72" fill={`url(#${uid}-glow)`} opacity="0.4" className="goud-aura" />
          <ellipse cx="100" cy="188" rx="48" ry="10" fill="#000" opacity="0.28" className="goud-schaduw" />

          {/* zwevende illustraties */}
          <g transform="translate(24 12)">
            <g className="goud-munt goud-munt-1">
              <SvgMunt uid={uid} scale={1.1} />
            </g>
          </g>
          <g transform="translate(168 18)">
            <g className="goud-munt goud-munt-2">
              <SvgNugget uid={uid} scale={0.9} rot={12} />
            </g>
          </g>
          <g transform="translate(14 150)">
            <g className="goud-munt goud-munt-3">
              <SvgMunt uid={uid} scale={0.75} />
            </g>
          </g>

          <g className="goud-sparkles">
            <g className="goud-sparkle-a"><SvgSparkle x={28} y={58} size={7} /></g>
            <g className="goud-sparkle-b"><SvgSparkle x={168} y={48} size={6} fill="#fbbf24" /></g>
            <g className="goud-sparkle-c"><SvgSparkle x={154} y={118} size={5} fill="#fef08a" /></g>
            <g className="goud-sparkle-d"><SvgSparkle x={36} y={128} size={4} /></g>
          </g>

          {/* stof bij hakken */}
          <g className="goud-stof" opacity="0.8">
            <ellipse cx="58" cy="168" rx="14" ry="5" fill="#c4a484" />
            <ellipse cx="72" cy="172" rx="10" ry="4" fill="#d4b896" />
            <ellipse cx="48" cy="174" rx="8" ry="3" fill="#e8d4b8" />
          </g>

          <g className="goud-body-bob">
            {/* laarzen */}
            <path d="M78 168 L78 188 Q78 194 84 194 L92 194 Q98 194 98 188 L98 168 Z" fill={`url(#${uid}-leer)`} />
            <path d="M108 168 L108 188 Q108 194 114 194 L122 194 Q128 194 128 188 L128 168 Z" fill={`url(#${uid}-leer)`} />
            <ellipse cx="88" cy="194" rx="12" ry="5" fill="#451a03" />
            <ellipse cx="118" cy="194" rx="12" ry="5" fill="#451a03" />
            <path d="M80 178 L96 178" stroke="#fde68a" strokeWidth="1" opacity="0.25" />
            <path d="M110 178 L126 178" stroke="#fde68a" strokeWidth="1" opacity="0.25" />

            {/* broek / overall */}
            <path
              d="M72 118 L72 168 L96 168 L96 138 L104 138 L104 168 L128 168 L128 118 Q128 108 100 108 Q72 108 72 118 Z"
              fill={`url(#${uid}-overall)`}
            />
            <path d="M88 108 L88 168" stroke="#2c4a7c" strokeWidth="3" />
            <path d="M112 108 L112 168" stroke="#2c4a7c" strokeWidth="3" />
            <rect x="90" y="118" width="20" height="22" rx="3" fill={`url(#${uid}-overall-licht)`} />
            <circle cx="100" cy="128" r="3" fill="#fde68a" opacity="0.9" />
            <circle cx="100" cy="138" r="3" fill="#fde68a" opacity="0.9" />

            {/* goudzak aan riem */}
            <g transform="translate(126 132)">
              <path d="M0 0 Q8 2 10 12 Q8 22 0 20 Q-6 14 -2 4 Z" fill={`url(#${uid}-zak)`} stroke="#92400e" strokeWidth="0.8" />
              <path d="M2 8 Q5 10 8 8" fill="none" stroke="#fbbf24" strokeWidth="1.2" />
              <SvgNugget uid={uid} x={4} y={10} scale={0.35} rot={8} />
            </g>

            {/* bandana */}
            <path
              d="M68 88 Q100 98 132 88 L128 96 Q100 106 72 96 Z"
              fill={`url(#${uid}-bandana)`}
            />
            <path d="M128 92 L138 100 L132 104 Z" fill="#991b1b" />

            {/* hoofd */}
            <ellipse cx="100" cy="82" rx="26" ry="28" fill={`url(#${uid}-huid)`} />
            {/* stoppels */}
            <g opacity="0.35" fill="#92400e">
              <circle cx="88" cy="92" r="1" />
              <circle cx="94" cy="95" r="0.8" />
              <circle cx="106" cy="94" r="0.9" />
              <circle cx="112" cy="90" r="1" />
              <circle cx="100" cy="96" r="0.7" />
            </g>
            {/* wangen */}
            <ellipse cx="82" cy="88" rx="5" ry="3" fill="#f9a8d4" opacity="0.35" />
            <ellipse cx="118" cy="88" rx="5" ry="3" fill="#f9a8d4" opacity="0.35" />

            {/* ogen */}
            <g className="goud-blik">
              <ellipse cx="88" cy="80" rx="5" ry="6" fill="#fff" />
              <ellipse cx="112" cy="80" rx="5" ry="6" fill="#fff" />
              <circle cx="89" cy="81" r="3" fill="#1e293b" />
              <circle cx="113" cy="81" r="3" fill="#1e293b" />
              <circle cx="90" cy="79.5" r="1.2" fill="#fff" />
              <circle cx="114" cy="79.5" r="1.2" fill="#fff" />
              <path d="M80 72 Q88 68 94 72" fill="none" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
              <path d="M106 72 Q112 68 120 72" fill="none" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* mond */}
            <path
              d="M90 94 Q100 102 110 94"
              fill="none"
              stroke="#c2410c"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="goud-glimlach"
            />

            {/* hoed */}
            <g className="goud-hat">
              <ellipse cx="100" cy="58" rx="44" ry="9" fill="#78350f" />
              <ellipse cx="100" cy="56" rx="44" ry="9" fill={`url(#${uid}-hoed)`} />
              <path d="M58 58 Q100 18 142 58 Z" fill={`url(#${uid}-hoed)`} />
              <path d="M62 56 Q100 24 138 56" fill="none" stroke="#fde68a" strokeWidth="1" opacity="0.3" />
              <rect x="62" y="52" width="76" height="7" rx="2" fill="#713f12" />
              <rect x="78" y="53" width="44" height="4" rx="1" fill="#a16207" />
            </g>

            {/* linkerarm + pikhouweel */}
            <g className="goud-pik-arm" style={{ transformOrigin: "72px 128px" }}>
              <ellipse cx="62" cy="124" rx="12" ry="8" fill={`url(#${uid}-huid)`} transform="rotate(-18 62 124)" />
              <g className="goud-pikhouweel">
                <rect x="22" y="78" width="7" height="52" rx="2.5" fill={`url(#${uid}-hout)`} transform="rotate(-38 26 104)" />
                <path d="M8 68 L30 62 L26 78 L4 84 Z" fill={`url(#${uid}-metaal)`} transform="rotate(-38 18 74)" />
                <path d="M6 66 L14 62 L18 76 L8 80 Z" fill="#fde047" transform="rotate(-38 12 70)" className="goud-pik-tip" />
                <path d="M10 70 L22 66" fill="none" stroke="#64748b" strokeWidth="0.8" transform="rotate(-38 16 68)" />
              </g>
            </g>

            {/* wijsarm */}
            <g
              className="goud-wijs-wrapper"
              style={{
                transformOrigin: "128px 124px",
                transform: wijstHoek != null ? `rotate(${wijstHoek}deg)` : "rotate(-28deg)",
              }}
            >
              <g className="goud-wijs-arm">
                <ellipse cx="142" cy="122" rx="16" ry="9" fill={`url(#${uid}-huid)`} />
                <ellipse cx="162" cy="120" rx="7" ry="8" fill={`url(#${uid}-huid)`} />
                <rect x="160" y="114" width="6" height="16" rx="3" fill={`url(#${uid}-huid)`} className="goud-vinger" />
                <path d="M164 112 L168 108" stroke="#d4a574" strokeWidth="2" strokeLinecap="round" />
              </g>
            </g>
          </g>

          {/* Eureka badge met nugget */}
          {euro && !agentOpen && (
            <g className="goud-eureka" transform="translate(148 16)">
              <rect x="-36" y="-4" width="72" height="30" rx="10" fill="#2a1f0a" stroke="#fbbf24" strokeWidth="1.5" />
              <SvgNugget uid={uid} x={-28} y={10} scale={0.5} rot={-10} />
              <text x="4" y="17" textAnchor="middle" fill="#fde68a" fontSize="11" fontWeight="bold" fontFamily="system-ui, sans-serif">
                Goud!
              </text>
            </g>
          )}

          {/* agent: praatwolk met puntjes */}
          {agentOpen && (
            <g className="goud-chat-bubble-mini" transform="translate(158 22)">
              <rect x="-22" y="-14" width="44" height="28" rx="10" fill="#3b0764" stroke="#a78bfa" strokeWidth="1.5" />
              <path d="M-8 14 L-14 22 L-2 14 Z" fill="#3b0764" stroke="#a78bfa" strokeWidth="1" />
              <circle cx="-10" cy="0" r="2.5" fill="#e9d5ff" className="goud-chat-dot goud-chat-dot-1" />
              <circle cx="0" cy="0" r="2.5" fill="#c4b5fd" className="goud-chat-dot goud-chat-dot-2" />
              <circle cx="10" cy="0" r="2.5" fill="#a78bfa" className="goud-chat-dot goud-chat-dot-3" />
            </g>
          )}
          </g>
        </svg>

        <span className="goud-label-badge">Goudzoeker</span>
      </div>
    </div>
  );
}