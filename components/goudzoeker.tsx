"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { GoudzoekerAgentChat } from "@/components/goudzoeker-agent-chat";
import { GoudzoekerCharacter } from "@/components/goudzoeker-character";
import { GoudzoekerPijl } from "@/components/goudzoeker-pijl";
import { useGoudzoekerWandel } from "@/hooks/use-goudzoeker-wandel";
import { laadKpi, waarLigtHetGeld, type GoudTip } from "@/lib/goudzoeker";
import { GROOTTE, randomMompel } from "@/lib/goudzoeker-mompels";

type Point = { x: number; y: number };

export function Goudzoeker() {
  const [tip, setTip] = useState<GoudTip | null>(null);
  const [from, setFrom] = useState<Point | null>(null);
  const [to, setTo] = useState<Point | null>(null);
  const [goudDoel, setGoudDoel] = useState<Point | null>(null);
  const [zichtbaar, setZichtbaar] = useState(true);
  const [agentOpen, setAgentOpen] = useState(false);
  const [mompel, setMompel] = useState("");
  const [mompelKey, setMompelKey] = useState(0);

  const { pos, richting, wandelt, bijGoud } = useGoudzoekerWandel({
    actief: zichtbaar && !agentOpen,
    goudDoel,
  });

  const update = useCallback(() => {
    const t = waarLigtHetGeld(laadKpi());
    setTip(t);

    const target = document.querySelector(`[data-goud-target="${t.target}"]`);
    if (!target) {
      setTo(null);
      setGoudDoel(null);
      return;
    }

    const tg = target.getBoundingClientRect();
    const toPt = { x: tg.left + tg.width / 2, y: tg.top + tg.height / 2 };
    setTo(toPt);
    setGoudDoel(toPt);

    document.querySelectorAll("[data-goud-highlight]").forEach((el) => {
      el.classList.remove("goud-pulse");
    });
    target.classList.add("goud-pulse");
  }, []);

  const updatePijl = useCallback(() => {
    const cx = pos.x + GROOTTE.w * 0.5;
    const cy = pos.y + GROOTTE.h * 0.42;
    setFrom({ x: cx, y: cy });
  }, [pos]);

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

  useEffect(() => {
    updatePijl();
  }, [updatePijl, pos]);

  useEffect(() => {
    if (!zichtbaar || agentOpen) return;

    let vorige = "";
    const toon = () => {
      const zin = randomMompel(vorige);
      vorige = zin;
      setMompel(zin);
      setMompelKey((k) => k + 1);
    };

    toon();
    const id = setInterval(toon, 2200 + Math.random() * 1800);
    return () => clearInterval(id);
  }, [zichtbaar, agentOpen, bijGoud]);

  useEffect(() => {
    if (bijGoud && tip) {
      setMompel(`${tip.titel} — ${tip.euro}!`);
      setMompelKey((k) => k + 1);
    }
  }, [bijGoud, tip]);

  if (!zichtbaar || !tip) return null;

  return (
    <>
      <GoudzoekerAgentChat open={agentOpen} onClose={() => setAgentOpen(false)} />

      {from && to && (bijGoud || wandelt) && <GoudzoekerPijl from={from} to={to} />}

      <div
        id="goudzoeker-anchor"
        className="pointer-events-none fixed z-[100] flex flex-col items-center"
        style={{
          left: pos.x,
          top: pos.y,
          width: GROOTTE.w,
          transition: agentOpen ? "none" : undefined,
        }}
      >
        {/* mompel */}
        {mompel && !agentOpen && (
          <div
            key={mompelKey}
            className="goud-mompel-bubble pointer-events-none mb-1 max-w-[11rem] self-center px-3 py-1.5"
          >
            <p className="text-center text-[11px] font-medium italic leading-snug text-amber-100/90">
              &ldquo;{mompel}&rdquo;
            </p>
          </div>
        )}

        {!agentOpen && bijGoud && (
          <div className="goud-tip-bubble pointer-events-auto relative mb-1 max-w-[13rem] rounded-2xl border border-amber-400/40 bg-[#1a1408]/95 px-3 py-2 shadow-lg shadow-amber-900/30 backdrop-blur-md">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">{tip.titel}</p>
            <p className="goud-euro-text font-mono text-sm font-bold text-amber-300">{tip.euro}</p>
            <Link href={tip.href} className="mt-1 inline-block text-xs font-bold text-amber-400 hover:text-amber-300">
              Pak het →
            </Link>
          </div>
        )}

        <div
          className={`goudzoeker-knop pointer-events-auto relative ${richting === "links" ? "goud-flip-links" : ""}`}
          style={{ width: GROOTTE.w, height: GROOTTE.h }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setZichtbaar(false);
            }}
            className="absolute -right-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-[10px] text-white/60 hover:bg-black/80"
            aria-label="Sluit goudzoeker"
          >
            ×
          </button>
          <button
            type="button"
            onClick={() => setAgentOpen((o) => !o)}
            className="group h-full w-full text-left"
            aria-label={agentOpen ? "Sluit agent" : "Open goudzoeker-agent"}
          >
            <GoudzoekerCharacter
              agentOpen={agentOpen}
              euro={tip.euro}
              wandelt={wandelt && !agentOpen}
              bijGoud={bijGoud}
            />
          </button>
        </div>
      </div>
    </>
  );
}