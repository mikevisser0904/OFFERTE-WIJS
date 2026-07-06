"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { GoudzoekerAgentChat } from "@/components/goudzoeker-agent-chat";
import { GoudzoekerCharacter } from "@/components/goudzoeker-character";
import { GoudzoekerOpdringer } from "@/components/goudzoeker-opdringer";
import { GoudzoekerPijl } from "@/components/goudzoeker-pijl";
import { useGoudzoekerWandel } from "@/hooks/use-goudzoeker-wandel";
import { kiesActiefGoudDoel } from "@/lib/goudzoeker-doelen";
import { laadKpi, type GoudTip } from "@/lib/goudzoeker";
import {
  GROOTTE,
  TERUG_NA_WEG_MS,
  randomMompel,
  randomMompelBijDoel,
} from "@/lib/goudzoeker-mompels";

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
  const [isSchreeuw, setIsSchreeuw] = useState(false);
  const [wegTeller, setWegTeller] = useState(0);
  const terugTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { pos, richting, wandelt, bijGoud, visueel } = useGoudzoekerWandel({
    actief: zichtbaar && !agentOpen,
    goudDoel,
    opdringerig: true,
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
    const diepte = 0.55 + (tg.top / Math.max(window.innerHeight, 1)) * 0.35;
    const toPt = { x: tg.left + tg.width / 2, y: tg.top + tg.height / 2 };
    setTo(toPt);
    setGoudDoel({ x: toPt.x, y: toPt.y, z: diepte, actief: true });

    document.querySelectorAll("[data-goud-highlight]").forEach((el) => {
      el.classList.remove("goud-pulse", "goud-pulse-heftig");
    });
    target.classList.add("goud-pulse", "goud-pulse-heftig");
  }, []);

  const updatePijl = useCallback(() => {
    const cx = pos.x + GROOTTE.w * 0.5;
    const cy = pos.y + GROOTTE.h * 0.38;
    setFrom({ x: cx, y: cy });
  }, [pos]);

  const planTerugkomst = useCallback(() => {
    if (terugTimerRef.current) clearTimeout(terugTimerRef.current);
    terugTimerRef.current = setTimeout(() => {
      setZichtbaar(true);
      setWegTeller((n) => n + 1);
      setMompel("lekker geprobeerd — ik ben TERUG");
      setIsSchreeuw(true);
      setMompelKey((k) => k + 1);
    }, TERUG_NA_WEG_MS);
  }, []);

  const sluit = useCallback(() => {
    setZichtbaar(false);
    setAgentOpen(false);
    planTerugkomst();
  }, [planTerugkomst]);

  useEffect(() => {
    update();
    const interval = setInterval(update, 6000);
    const t = setTimeout(update, 300);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      clearInterval(interval);
      clearTimeout(t);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      document.querySelectorAll("[data-goud-highlight]").forEach((el) => {
        el.classList.remove("goud-pulse", "goud-pulse-heftig");
      });
    };
  }, [update]);

  useEffect(() => {
    updatePijl();
  }, [updatePijl, pos]);

  useEffect(() => {
    if (!zichtbaar || agentOpen) return;

    let vorige = "";
    let teller = 0;
    const toon = () => {
      teller += 1;
      const schreeuw = teller % 2 === 0 || Math.random() < 0.4;
      setIsSchreeuw(schreeuw);
      const zin =
        Math.random() < 0.35 && tip
          ? randomMompelBijDoel(tip.titel, tip.euro)
          : randomMompel(vorige, schreeuw);
      vorige = zin;
      setMompel(zin);
      setMompelKey((k) => k + 1);
    };

    toon();
    const id = setInterval(toon, 900 + Math.random() * 700);
    return () => clearInterval(id);
  }, [zichtbaar, agentOpen, tip?.titel, tip?.euro, wegTeller]);

  useEffect(() => {
    if (bijGoud && tip) {
      setIsSchreeuw(true);
      const grappen = [
        `BINGO — ${tip.titel} — ${tip.euro}!!!`,
        `MIKE KOM — ${tip.euro} LIGT HIER`,
        `WIGGELRODE SLAAT ALARM: ${tip.titel}`,
      ];
      setMompel(grappen[Math.floor(Math.random() * grappen.length)]!);
      setMompelKey((k) => k + 1);
    }
  }, [bijGoud, tip]);

  useEffect(() => {
    const cls = "goud-schud-body";
    if (bijGoud && zichtbaar) document.body.classList.add(cls);
    else document.body.classList.remove(cls);
    return () => document.body.classList.remove(cls);
  }, [bijGoud, zichtbaar]);

  useEffect(() => () => {
    if (terugTimerRef.current) clearTimeout(terugTimerRef.current);
    document.body.classList.remove("goud-schud-body");
  }, []);

  if (!zichtbaar || !tip) return null;

  return (
    <>
      <GoudzoekerOpdringer actief bijGoud={bijGoud} euro={tip.euro} titel={tip.titel} />
      <GoudzoekerAgentChat open={agentOpen} onClose={() => setAgentOpen(false)} />

      {from && to && <GoudzoekerPijl from={from} to={to} />}

      <div
        id="goudzoeker-anchor"
        className={`goud-3d-wereld pointer-events-none fixed flex flex-col items-center ${
          bijGoud ? "goud-opdringer-piek" : "goud-opdringer-normaal"
        }`}
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
            className={`pointer-events-none mb-1 max-w-[14rem] self-center px-3 py-2 ${
              isSchreeuw ? "goud-mompel-schreeuw" : "goud-mompel-bubble"
            }`}
            style={{
              transform: `translateZ(${visueel.translateZ + 50}px) scale(${1 + pos.z * 0.2})`,
            }}
          >
            <p
              className={`text-center leading-snug ${
                isSchreeuw
                  ? "text-xs font-black uppercase tracking-wide text-amber-200 sm:text-sm"
                  : "text-[11px] font-medium italic text-amber-100/90"
              }`}
            >
              {isSchreeuw ? mompel : `“${mompel}”`}
            </p>
          </div>
        )}

        {!agentOpen && (
          <div
            className={`goud-tip-bubble goud-tip-opdringer pointer-events-auto relative mb-1 max-w-[15rem] rounded-2xl border-2 bg-[#1a1408]/98 px-3 py-2.5 shadow-xl backdrop-blur-md ${
              bijGoud
                ? "goud-tip-bingo border-amber-300/80 shadow-amber-500/60"
                : "border-amber-400/50 shadow-amber-900/40"
            }`}
            style={{ transform: `translateZ(${visueel.translateZ + 60}px)` }}
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 goud-tip-kop">
              {bijGoud ? "!!! GOUD !!!" : "MIKE — KIJK HIER"}
            </p>
            <p className="goud-euro-text font-mono text-base font-black text-amber-300">{tip.euro}</p>
            <p className="text-xs font-bold text-white/80">{tip.titel}</p>
            <p className="mt-0.5 text-[10px] text-white/45">{tip.tekst}</p>
            <Link
              href={tip.href}
              className="mt-2 inline-block rounded-full bg-amber-500 px-3 py-1 text-xs font-black text-slate-900 hover:bg-amber-400"
            >
              GRIJP HET →
            </Link>
          </div>
        )}

        <div
          className={`goud-3d-figuur goud-figuur-opdringer pointer-events-auto relative ${
            wandelt ? "goud-3d-loopt" : ""
          } ${bijGoud ? "goud-figuur-bingo" : ""}`}
          style={{
            width: GROOTTE.w,
            height: GROOTTE.h,
            transform: visueel.transform,
            filter: `blur(${visueel.blur}px) brightness(${visueel.brightness})`,
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="goud-3d-schaduw pointer-events-none absolute left-1/2 rounded-full bg-amber-900/40"
            style={{
              bottom: -8,
              width: `${60 + pos.z * 40}%`,
              height: 14 + pos.z * 10,
              transform: `translateX(-50%) translateZ(-20px) rotateX(90deg) scale(${0.7 + pos.z * 0.55})`,
              opacity: 0.2 + pos.z * 0.35,
              filter: `blur(${6 + (1 - pos.z) * 4}px)`,
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
                sluit();
              }}
              className="absolute -right-1 -top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-black/70 text-xs text-white/50 hover:text-white"
              aria-label="Sluit goudzoeker (komt terug)"
              title="Komt over ~18 sec terug"
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
                opdringerig
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}