"use client";

import { useId } from "react";
import { GoudGradients, SvgMunt, SvgNugget, SvgSparkle } from "@/components/goudzoeker-art";

type Props = {
  agentOpen?: boolean;
  euro?: string;
  wandelt?: boolean;
  bijGoud?: boolean;
  diepte?: number;
  opdringerig?: boolean;
};

export function GoudzoekerCharacter({
  agentOpen,
  euro,
  wandelt = false,
  bijGoud = false,
  diepte = 0.5,
  opdringerig = false,
}: Props) {
  const uid = useId().replace(/:/g, "");

  return (
    <div
      className={`relative h-[9.375rem] w-[8.125rem] ${
        agentOpen ? "goud-agent-modus" : "goud-mijn-modus"
      } ${wandelt ? "goud-is-wandelen" : ""} ${bijGoud ? "goud-bij-goud" : ""} ${
        opdringerig ? "goud-opdringerig-char" : ""
      } ${diepte > 0.65 ? "goud-dichtbij" : diepte < 0.35 ? "goud-verweg" : ""}`}
      style={{ transform: `translateZ(${diepte * 20}px)`, transformStyle: "preserve-3d" }}
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
            <circle cx="100" cy="108" r="72" fill={`url(#${uid}-glow)`} opacity="0.4" className="goud-aura" />
            <ellipse cx="100" cy="188" rx="48" ry="10" fill="#000" opacity="0.28" className="goud-schaduw" />

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

            <g className={`goud-body-bob ${wandelt ? "goud-walk-body" : ""}`}>
              {/* benen — loop animatie bij wandelen */}
              <g className="goud-been goud-been-links">
                <path d="M78 168 L78 188 Q78 194 84 194 L92 194 Q98 194 98 188 L98 168 Z" fill={`url(#${uid}-leer)`} />
                <ellipse cx="88" cy="194" rx="12" ry="5" fill="#451a03" />
              </g>
              <g className="goud-been goud-been-rechts">
                <path d="M108 168 L108 188 Q108 194 114 194 L122 194 Q128 194 128 188 L128 168 Z" fill={`url(#${uid}-leer)`} />
                <ellipse cx="118" cy="194" rx="12" ry="5" fill="#451a03" />
              </g>

              <path
                d="M72 118 L72 168 L96 168 L96 138 L104 138 L104 168 L128 168 L128 118 Q128 108 100 108 Q72 108 72 118 Z"
                fill={`url(#${uid}-overall)`}
              />
              <path d="M88 108 L88 168" stroke="#2c4a7c" strokeWidth="3" />
              <path d="M112 108 L112 168" stroke="#2c4a7c" strokeWidth="3" />
              <rect x="90" y="118" width="20" height="22" rx="3" fill={`url(#${uid}-overall-licht)`} />
              <circle cx="100" cy="128" r="3" fill="#fde68a" opacity="0.9" />
              <circle cx="100" cy="138" r="3" fill="#fde68a" opacity="0.9" />

              <g transform="translate(126 132)">
                <path d="M0 0 Q8 2 10 12 Q8 22 0 20 Q-6 14 -2 4 Z" fill={`url(#${uid}-zak)`} stroke="#92400e" strokeWidth="0.8" />
                <path d="M2 8 Q5 10 8 8" fill="none" stroke="#fbbf24" strokeWidth="1.2" />
                <SvgNugget uid={uid} x={4} y={10} scale={0.35} rot={8} />
              </g>

              <path d="M68 88 Q100 98 132 88 L128 96 Q100 106 72 96 Z" fill={`url(#${uid}-bandana)`} />
              <path d="M128 92 L138 100 L132 104 Z" fill="#991b1b" />

              <ellipse cx="100" cy="82" rx="26" ry="28" fill={`url(#${uid}-huid)`} />
              <g opacity="0.35" fill="#92400e">
                <circle cx="88" cy="92" r="1" />
                <circle cx="94" cy="95" r="0.8" />
                <circle cx="106" cy="94" r="0.9" />
                <circle cx="112" cy="90" r="1" />
              </g>
              <ellipse cx="82" cy="88" rx="5" ry="3" fill="#f9a8d4" opacity="0.35" />
              <ellipse cx="118" cy="88" rx="5" ry="3" fill="#f9a8d4" opacity="0.35" />

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

              <path
                d="M92 95 Q100 100 108 95"
                fill="none"
                stroke="#c2410c"
                strokeWidth="2"
                strokeLinecap="round"
                className="goud-mompel-mond"
              />

              <g className="goud-hat">
                <ellipse cx="100" cy="58" rx="44" ry="9" fill="#78350f" />
                <ellipse cx="100" cy="56" rx="44" ry="9" fill={`url(#${uid}-hoed)`} />
                <path d="M58 58 Q100 18 142 58 Z" fill={`url(#${uid}-hoed)`} />
                <rect x="62" y="52" width="76" height="7" rx="2" fill="#713f12" />
              </g>

              {/* armen op wiggelrode */}
              <ellipse cx="78" cy="124" rx="11" ry="7" fill={`url(#${uid}-huid)`} transform="rotate(-8 78 124)" />
              <ellipse cx="122" cy="124" rx="11" ry="7" fill={`url(#${uid}-huid)`} transform="rotate(8 122 124)" />

              {/* WIGGELRODE */}
              <g className="goud-wiggelrode" transform="translate(100 118)">
                <g className="goud-wiggel-schacht">
                  <rect x="-3" y="-58" width="6" height="62" rx="3" fill={`url(#${uid}-hout)`} />
                  <rect x="-2" y="-56" width="2" height="58" rx="1" fill="#fde68a" opacity="0.25" />
                </g>
                <g className="goud-wiggel-vork">
                  <path d="M0 -58 L-18 -78" stroke="#a16207" strokeWidth="4" strokeLinecap="round" />
                  <path d="M0 -58 L18 -78" stroke="#a16207" strokeWidth="4" strokeLinecap="round" />
                  <path d="M0 -58 L0 -74" stroke="#92400e" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="-18" cy="-78" r="3" fill="#fbbf24" className="goud-wiggel-tip" />
                  <circle cx="18" cy="-78" r="3" fill="#fbbf24" className="goud-wiggel-tip" />
                  {bijGoud && (
                    <g className="goud-wiggel-hit">
                      <circle cx="0" cy="-78" r="8" fill="#fde047" opacity="0.5" />
                      <SvgSparkle x={-8} y={-86} size={5} />
                      <SvgSparkle x={10} y={-84} size={4} fill="#fbbf24" />
                    </g>
                  )}
                </g>
              </g>
            </g>

            {euro && !agentOpen && bijGoud && (
              <g className="goud-eureka" transform="translate(148 16)">
                <rect x="-36" y="-4" width="72" height="30" rx="10" fill="#2a1f0a" stroke="#fbbf24" strokeWidth="1.5" />
                <SvgNugget uid={uid} x={-28} y={10} scale={0.5} rot={-10} />
                <text x="4" y="17" textAnchor="middle" fill="#fde68a" fontSize="11" fontWeight="bold" fontFamily="system-ui, sans-serif">
                  BINGO!
                </text>
              </g>
            )}

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