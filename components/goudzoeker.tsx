"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { GoudzoekerAgentChat } from "@/components/goudzoeker-agent-chat";
import { GoudzoekerCharacter } from "@/components/goudzoeker-character";
import { GoudzoekerPijl } from "@/components/goudzoeker-pijl";
import { laadKpi, waarLigtHetGeld, type GoudTip } from "@/lib/goudzoeker";

type Point = { x: number; y: number };

function berekenWijsHoek(from: Point, to: Point): number {
  return (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;
}

export function Goudzoeker() {
  const [tip, setTip] = useState<GoudTip | null>(null);
  const [from, setFrom] = useState<Point | null>(null);
  const [to, setTo] = useState<Point | null>(null);
  const [wijstHoek, setWijstHoek] = useState<number | null>(null);
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
      setWijstHoek(null);
      return;
    }

    const a = anchor.getBoundingClientRect();
    const tg = target.getBoundingClientRect();

    const fromPt = { x: a.left + a.width * 0.35, y: a.top + a.height * 0.35 };
    const toPt = { x: tg.left + tg.width / 2, y: tg.top + tg.height / 2 };

    setFrom(fromPt);
    setTo(toPt);
    setWijstHoek(berekenWijsHoek(fromPt, toPt));

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

      {from && to && <GoudzoekerPijl from={from} to={to} />}

      <div
        id="goudzoeker-anchor"
        className={`fixed bottom-6 z-[100] flex max-w-[240px] flex-col items-end gap-2 transition-all duration-300 sm:max-w-xs ${
          agentOpen ? "hidden sm:flex sm:right-[25.5rem]" : "right-6"
        }`}
      >
        {!agentOpen && (
          <div className="goud-tip-bubble relative rounded-2xl border border-amber-400/40 bg-[#1a1408]/95 px-4 py-3 shadow-lg shadow-amber-900/30 backdrop-blur-md">
            <div className="pointer-events-none absolute -bottom-2 right-10 h-4 w-4 rotate-45 border-b border-r border-amber-400/40 bg-[#1a1408]/95" />
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
            <p className="goud-euro-text mt-1 font-mono text-lg font-bold text-amber-300">
              {tip.euro}
            </p>
            <p className="mt-1 text-sm leading-snug text-white/70">{tip.tekst}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Link
                href={tip.href}
                className="text-sm font-bold text-amber-400 transition hover:scale-105 hover:text-amber-300"
              >
                Ga ernaartoe →
              </Link>
              <button
                type="button"
                onClick={() => setAgentOpen(true)}
                className="text-sm font-bold text-violet-400 transition hover:scale-105 hover:text-violet-300"
              >
                Vraag agent →
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setAgentOpen((o) => !o)}
          className="goudzoeker-knop group flex items-end gap-1 text-left"
          aria-label={agentOpen ? "Sluit agent" : "Open goudzoeker-agent"}
        >
          <GoudzoekerCharacter
            wijstHoek={wijstHoek}
            agentOpen={agentOpen}
            euro={tip.euro}
          />
        </button>
      </div>
    </>
  );
}