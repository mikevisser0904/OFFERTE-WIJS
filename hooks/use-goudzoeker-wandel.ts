"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  GOUD_NAAR_INTERVAL_MS,
  GOUD_PAUSE_MS,
  GROOTTE,
  MARGIN,
  SNELHEID,
} from "@/lib/goudzoeker-mompels";

export type WandelPos = { x: number; y: number };

function clampPos(x: number, y: number): WandelPos {
  if (typeof window === "undefined") return { x, y };
  const maxX = Math.max(MARGIN, window.innerWidth - GROOTTE.w - MARGIN);
  const maxY = Math.max(MARGIN, window.innerHeight - GROOTTE.h - MARGIN);
  return {
    x: Math.min(maxX, Math.max(MARGIN, x)),
    y: Math.min(maxY, Math.max(MARGIN, y)),
  };
}

function randomPunt(): WandelPos {
  if (typeof window === "undefined") return { x: MARGIN, y: MARGIN };
  const maxX = window.innerWidth - GROOTTE.w - MARGIN;
  const maxY = window.innerHeight - GROOTTE.h - MARGIN;
  return clampPos(
    MARGIN + Math.random() * Math.max(0, maxX - MARGIN),
    MARGIN + Math.random() * Math.max(0, maxY - MARGIN)
  );
}

export function useGoudzoekerWandel({
  actief,
  goudDoel,
}: {
  actief: boolean;
  goudDoel: WandelPos | null;
}) {
  const reducedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => {
      reducedRef.current = mq.matches;
    };
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  const [pos, setPos] = useState<WandelPos>({ x: MARGIN, y: 200 });
  const [richting, setRichting] = useState<"links" | "rechts">("rechts");
  const [wandelt, setWandelt] = useState(true);
  const [bijGoud, setBijGoud] = useState(false);

  const posRef = useRef(pos);
  const doelRef = useRef<WandelPos>(randomPunt());
  const pauseTotRef = useRef(0);
  const goudModusRef = useRef(false);
  const frameRef = useRef<number>(0);

  const kiesNieuwDoel = useCallback((naarGoud = false) => {
    if (naarGoud && goudDoel) {
      goudModusRef.current = true;
      doelRef.current = clampPos(
        goudDoel.x - GROOTTE.w / 2,
        goudDoel.y - GROOTTE.h / 2
      );
      return;
    }
    goudModusRef.current = false;
    doelRef.current = randomPunt();
  }, [goudDoel]);

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setPos(clampPos(window.innerWidth - GROOTTE.w - MARGIN - 24, window.innerHeight - GROOTTE.h - MARGIN - 24));
    doelRef.current = randomPunt();
  }, []);

  useEffect(() => {
    if (!actief) {
      setWandelt(false);
      return;
    }

    setWandelt(true);

    const loop = (t: number) => {
      if (reducedRef.current) {
        setWandelt(false);
        frameRef.current = requestAnimationFrame(loop);
        return;
      }

      if (pauseTotRef.current > t) {
        frameRef.current = requestAnimationFrame(loop);
        return;
      }

      const p = posRef.current;
      const d = doelRef.current;
      const dx = d.x - p.x;
      const dy = d.y - p.y;
      const afstand = Math.hypot(dx, dy);

      if (afstand < 14) {
        if (goudModusRef.current) {
          setBijGoud(true);
          setWandelt(false);
          pauseTotRef.current = t + GOUD_PAUSE_MS;
          goudModusRef.current = false;
          setTimeout(() => setBijGoud(false), GOUD_PAUSE_MS);
        } else {
          pauseTotRef.current = t + 400 + Math.random() * 600;
        }
        kiesNieuwDoel(false);
        frameRef.current = requestAnimationFrame(loop);
        return;
      }

      setWandelt(true);
      setBijGoud(false);
      const stap = Math.min(SNELHEID, afstand);
      const nx = p.x + (dx / afstand) * stap;
      const ny = p.y + (dy / afstand) * stap;
      const nieuw = clampPos(nx, ny);
      posRef.current = nieuw;
      setPos(nieuw);
      setRichting(dx < 0 ? "links" : "rechts");

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [actief, kiesNieuwDoel]);

  useEffect(() => {
    if (!actief) return;

    const naarGoud = () => {
      if (goudDoel) kiesNieuwDoel(true);
    };

    const id = setInterval(naarGoud, GOUD_NAAR_INTERVAL_MS);
    const eerste = setTimeout(naarGoud, 4000);
    return () => {
      clearInterval(id);
      clearTimeout(eerste);
    };
  }, [actief, goudDoel, kiesNieuwDoel]);

  useEffect(() => {
    const onResize = () => {
      const clamped = clampPos(posRef.current.x, posRef.current.y);
      posRef.current = clamped;
      setPos(clamped);
      doelRef.current = clampPos(doelRef.current.x, doelRef.current.y);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return { pos, richting, wandelt, bijGoud };
}