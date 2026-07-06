"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { GoudzoekerAgentChat } from "@/components/goudzoeker-agent-chat";
import { GoudzoekerCharacter } from "@/components/goudzoeker-character";
import { GoudzoekerPijl } from "@/components/goudzoeker-pijl";
import { useGoudzoekerWandel } from "@/hooks/use-goudzoeker-wandel";
import { kiesActiefGoudDoel } from "@/lib/goudzoeker-doelen";
import { laadKpi, type GoudTip } from "@/lib/goudzoeker";
import { GROOTTE, randomMompel, randomMompelBijDoel } from "@/lib/goudzoeker-mompels";

type Point = { x: number; y: number };

export function Goudzoeker() {
  const [tip, setTip] = useState<GoudTip | null>(null);
  const [from, setFrom] = useState<Point | null>(null);
  const [to, setTo] = useState<Point | null>(null);
  const [goudDoel, setGoudDoel] = useState<{
    x: number;
    y: number;
    z: number;
    actief: boolean;
  } | null>(null);
  const [zichtbaar, setZichtbaar] = useState(true);
  const [agentOpen, setAgentOpen] = useState(false);
  const [mompel, setMompel] = useState("");
  const [mompelKey, setMompelKey] = useState(0);

  const { pos, richting, wandelt, bijGoud, visueel } = useGoudzoekerWandel({
    actief: zichtbaar && !agentOpen,
    goudDoel,
  });

  const update = useCallback(() => {
    const t = kiesActiefGoudDoel(laadKpi());
    setTip(t);

    const target = document.querySelector(`[data-goud-target="${t.target}"]`);
    if (!target) {
      setTo(null);
      setGoudDoel(null);
      return;
    }

    const tg = target.getBoundingClientRect();
    const diepte = 0.35 + (tg.top / Math.max(window.innerHeight, 1)) * 0.45;
    const toPt = { x: tg.left + tg.width / 2, y: tg.top + tg.height / 2 };
    setTo(toPt);
    setGoudDoel({ x: toPt.x, y: toPt.y, z: diepte, actief: true });

    document.querySelectorAll("[data-goud-highlight]").forEach((el) => {
      el.classList.remove("goud-pulse");
    });
    target.classList.add("goud-pulse");
  }, []);

  const updatePijl = useCallback(() => {
    const cx = pos.x + GROOTTE.w * 0.5;
    const cy = pos.y + GROOTTE.h * 0.4;
    setFrom({ x: cx, y: cy });
  }, [pos]);

  useEffect(() => {
    update();
    const interval = setInterval(update, 9000);
    const t = setTimeout(update, 400);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      clearInterval(interval);
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
      const zin = Math.random() < 0.25 && tip
        ? randomMompelBijDoel(tip.titel)
        : randomMompel(vorige);
      vorige = zin;
      setMompel(zin);
      setMompelKey((k) => k + 1);
    };

    toon();
    const id = setInterval(toon, 1800 + Math.random() * 1400);
    return () => clearInterval(id);
  }, [zichtbaar, agentOpen, tip?.titel]);

  useEffect(() => {
    if (bijGoud && tip) {
      const grappen = [
        `${tip.titel} — ${tip.euro}!`,
        `BINGO bij ${tip.titel}`,
        `wiggel was gelijk: ${tip.euro}`,
      ];
      setMompel(grappen[Math.floor(Math.random() * grappen.length)]!);
      setMompelKey((k) => k + 1);
    }
  }, [bijGoud, tip]);

  if (!zichtbaar || !tip) return null;

  return (
    <>
      <GoudzoekerAgentChat open={agentOpen} onClose={() => setAgentOpen(false)} />

      {from && to && <GoudzoekerPijl from={from} to={to} />}

      <div
        id="goudzoeker-anchor"
        className="goud-3d-wereld pointer-events-none fixed flex flex-col items-center"
        style={{
          left: pos.x,
          top: pos.y,
          width: GROOTTE.w,
          zIndex: visueel.zIndex,
          perspective: "900px",
        }}
      >
        {mompel && !agentOpen && (
          <div
            key={mompelKey}
            className="goud-mompel-bubble pointer-events-none mb-1 max-w-[12rem] self-center px-3 py-1.5"
            style={{
              transform: `translateZ(${visueel.translateZ + 40}px) scale(${0.9 + pos.z * 0.15})`,
              filter: `blur(${visueel.blur * 0.3}px)`,
            }}
          >
            <p className="text-center text-[11px] font-medium italic leading-snug text-amber-100/90">
              &ldquo;{mompel}&rdquo;
            </p>
          </div>
        )}

        {!agentOpen && bijGoud && (
          <div
            className="goud-tip-bubble pointer-events-auto relative mb-1 max-w-[13rem] rounded-2xl border border-amber-400/40 bg-[#1a1408]/95 px-3 py-2 shadow-lg shadow-amber-900/30 backdrop-blur-md"
            style={{ transform: `translateZ(${visueel.translateZ + 50}px)` }}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">{tip.titel}</p>
            <p className="goud-euro-text font-mono text-sm font-bold text-amber-300">{tip.euro}</p>
            <p className="mt-0.5 text-[10px] text-white/45">{tip.tekst}</p>
            <Link href={tip.href} className="mt-1 inline-block text-xs font-bold text-amber-400 hover:text-amber-300">
              Kijk hier →
            </Link>
          </div>
        )}

        <div
          className={`goud-3d-figuur pointer-events-auto relative ${wandelt ? "goud-3d-loopt" : ""}`}
          style={{
            width: GROOTTE.w,
            height: GROOTTE.h,
            transform: visueel.transform,
            filter: `blur(${visueel.blur}px) brightness(${visueel.brightness})`,
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="goud-3d-schaduw pointer-events-none absolute left-1/2 rounded-full bg-black/50"
            style={{
              bottom: -6,
              width: `${55 + pos.z * 35}%`,
              height: 10 + pos.z * 8,
              transform: `translateX(-50%) translateZ(-20px) rotateX(90deg) scale(${0.6 + pos.z * 0.5})`,
              opacity: 0.15 + pos.z * 0.25,
              filter: `blur(${4 + (1 - pos.z) * 6}px)`,
            }}
          />

          <div
            className={`goudzoeker-knop relative h-full w-full ${richting === "links" ? "goud-flip-links" : ""}`}
            style={{ transformStyle: "preserve-3d" }}
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
                diepte={pos.z}
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}