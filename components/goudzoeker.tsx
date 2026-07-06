"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { GoudzoekerAgentChat } from "@/components/goudzoeker-agent-chat";
import { laadKpi, waarLigtHetGeld, type GoudTip } from "@/lib/goudzoeker";

type Point = { x: number; y: number };

export function Goudzoeker() {
  const [tip, setTip] = useState<GoudTip | null>(null);
  const [from, setFrom] = useState<Point | null>(null);
  const [to, setTo] = useState<Point | null>(null);
  const [zichtbaar, setZichtbaar] = useState(true);
  const [agentOpen, setAgentOpen] = useState(false);

  const update = useCallback(() => {
    const t = waarLigtHetGeld(laadKpi());
    setTip(t);

    const anchor = document.getElementById("goudzoeker-anchor");
    const target = document.querySelector(`[data-goud-target="${t.target}"]`);

    if (!anchor || !target) {
      setFrom(null);
      setTo(null);
      return;
    }

    const a = anchor.getBoundingClientRect();
    const tg = target.getBoundingClientRect();

    setFrom({ x: a.left + a.width * 0.3, y: a.top + 20 });
    setTo({ x: tg.left + tg.width / 2, y: tg.top + tg.height / 2 });

    document.querySelectorAll("[data-goud-highlight]").forEach((el) => {
      el.classList.remove("goud-pulse");
    });
    target.classList.add("goud-pulse");
  }, []);

  useEffect(() => {
    update();
    const t = setTimeout(update, 400);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      document.querySelectorAll("[data-goud-highlight]").forEach((el) => {
        el.classList.remove("goud-pulse");
      });
    };
  }, [update]);

  if (!zichtbaar || !tip) return null;

  return (
    <>
      <GoudzoekerAgentChat open={agentOpen} onClose={() => setAgentOpen(false)} />
      <svg
        className="pointer-events-none fixed inset-0 z-[90] h-full w-full"
        aria-hidden
      >
        {from && to && (
          <>
            <defs>
              <marker
                id="goud-pijl"
                markerWidth="10"
                markerHeight="10"
                refX="8"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L8,3 L0,6 Z" fill="#fbbf24" />
              </marker>
            </defs>
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="#fbbf24"
              strokeWidth="3"
              strokeDasharray="8 6"
              markerEnd="url(#goud-pijl)"
              opacity="0.85"
            />
            <circle cx={to.x} cy={to.y} r="28" fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.5">
              <animate attributeName="r" values="22;32;22" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
            </circle>
          </>
        )}
      </svg>

      <div
        id="goudzoeker-anchor"
        className={`fixed bottom-6 z-[100] flex max-w-[220px] flex-col items-end gap-2 transition-all duration-300 sm:max-w-xs ${
          agentOpen ? "hidden sm:flex sm:right-[25.5rem]" : "right-6"
        }`}
      >
        {!agentOpen && (
          <div className="relative rounded-2xl border border-amber-400/40 bg-[#1a1408]/95 px-4 py-3 shadow-lg shadow-amber-900/30 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setZichtbaar(false)}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs text-white/60 hover:bg-white/20"
              aria-label="Sluit goudzoeker"
            >
              ×
            </button>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {tip.titel}
            </p>
            <p className="mt-1 font-mono text-lg font-bold text-amber-300">{tip.euro}</p>
            <p className="mt-1 text-sm leading-snug text-white/70">{tip.tekst}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Link
                href={tip.href}
                className="text-sm font-bold text-amber-400 hover:text-amber-300"
              >
                Ga ernaartoe →
              </Link>
              <button
                type="button"
                onClick={() => setAgentOpen(true)}
                className="text-sm font-bold text-violet-400 hover:text-violet-300"
              >
                Vraag agent →
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setAgentOpen((o) => !o)}
          className="goudzoeker-wiggle group flex items-end gap-1 text-left"
          aria-label={agentOpen ? "Sluit agent" : "Open goudzoeker-agent"}
        >
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber-500/50 bg-gradient-to-b from-amber-700 to-amber-900 text-3xl shadow-lg shadow-amber-900/50 transition group-hover:border-amber-400/70">
              ⛏️
            </div>
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">🤠</span>
            {!agentOpen && (
              <span
                className="absolute -left-6 top-4 origin-right text-2xl"
                style={{ transform: "rotate(-25deg)" }}
                aria-hidden
              >
                👉
              </span>
            )}
            {agentOpen && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
                💬
              </span>
            )}
          </div>
          <p className="mb-2 text-xs font-bold text-amber-500/80 group-hover:text-amber-400">
            {agentOpen ? "Agent aan" : "Goudzoeker"}
          </p>
        </button>
      </div>

    </>
  );
}