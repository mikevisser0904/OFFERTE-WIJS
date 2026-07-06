"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  GOUD_NAAR_INTERVAL_MS,
  GOUD_PAUSE_MS,
  GROOTTE,
  MARGIN,
  SNELHEID,
} from "@/lib/goudzoeker-mompels";

export type WandelPos = { x: number; y: number; z: number };

function clampPos(x: number, y: number, z: number): WandelPos {
  if (typeof window === "undefined") return { x, y, z };
  const maxX = Math.max(MARGIN, window.innerWidth - GROOTTE.w - MARGIN);
  const maxY = Math.max(MARGIN, window.innerHeight - GROOTTE.h - MARGIN);
  return {
    x: Math.min(maxX, Math.max(MARGIN, x)),
    y: Math.min(maxY, Math.max(MARGIN, y)),
    z: Math.min(0.95, Math.max(0.12, z)),
  };
}

function randomPunt(): WandelPos {
  if (typeof window === "undefined") return { x: MARGIN, y: MARGIN, z: 0.5 };
  const maxX = window.innerWidth - GROOTTE.w - MARGIN;
  const maxY = window.innerHeight - GROOTTE.h - MARGIN;
  const y = MARGIN + Math.random() * Math.max(0, maxY - MARGIN);
  const z = 0.25 + ((y - MARGIN) / Math.max(1, maxY - MARGIN)) * 0.55 + (Math.random() - 0.5) * 0.15;
  return clampPos(
    MARGIN + Math.random() * Math.max(0, maxX - MARGIN),
    y,
    z
  );
}

export function diepteNaar3D(z: number, richting: "links" | "rechts") {
  const scale = 0.72 + z * 0.42;
  const rotateY = richting === "links" ? 22 * z : -22 * z;
  const rotateX = -14 + z * 12;
  const translateZ = -80 + z * 160;
  const blur = (1 - z) * 1.4;
  const brightness = 0.82 + z * 0.2;
  const zIndex = 90 + Math.round(z * 60);

  return {
    scale,
    rotateY,
    rotateX,
    translateZ,
    blur,
    brightness,
    zIndex,
    transform: `perspective(900px) translateZ(${translateZ}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${scale})`,
  };
}

export function useGoudzoekerWandel({
  actief,
  goudDoel,
}: {
  actief: boolean;
  goudDoel: (WandelPos & { actief?: boolean }) | null;
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

  const [pos, setPos] = useState<WandelPos>({ x: MARGIN, y: 200, z: 0.5 });
  const [richting, setRichting] = useState<"links" | "rechts">("rechts");
  const [wandelt, setWandelt] = useState(true);
  const [bijGoud, setBijGoud] = useState(false);
  const [hoek, setHoek] = useState(0);

  const posRef = useRef(pos);
  const doelRef = useRef<WandelPos>(randomPunt());
  const pauseTotRef = useRef(0);
  const goudModusRef = useRef(false);
  const frameRef = useRef<number>(0);
  const hoekRef = useRef(0);

  const kiesNieuwDoel = useCallback(
    (naarGoud = false) => {
      if (naarGoud && goudDoel?.actief) {
        goudModusRef.current = true;
        doelRef.current = clampPos(
          goudDoel.x - GROOTTE.w / 2,
          goudDoel.y - GROOTTE.h / 2,
          goudDoel.z ?? 0.55
        );
        return;
      }
      goudModusRef.current = false;
      doelRef.current = randomPunt();
    },
    [goudDoel]
  );

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setPos(
      clampPos(
        window.innerWidth - GROOTTE.w - MARGIN - 24,
        window.innerHeight - GROOTTE.h - MARGIN - 24,
        0.65
      )
    );
    doelRef.current = randomPunt();
    hoekRef.current = Math.random() * Math.PI * 2;
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

      hoekRef.current += 0.006;
      setHoek(hoekRef.current);

      const p = posRef.current;
      const d = doelRef.current;

      const orbitX = Math.cos(hoekRef.current) * 0.35;
      const orbitZ = Math.sin(hoekRef.current) * 0.08;

      const dx = d.x - p.x + orbitX;
      const dy = d.y - p.y;
      const dz = d.z - p.z + orbitZ;
      const afstand = Math.hypot(dx, dy, dz * 80);

      if (afstand < 14) {
        if (goudModusRef.current) {
          setBijGoud(true);
          setWandelt(false);
          pauseTotRef.current = t + GOUD_PAUSE_MS;
          goudModusRef.current = false;
          setTimeout(() => setBijGoud(false), GOUD_PAUSE_MS);
        } else {
          pauseTotRef.current = t + 300 + Math.random() * 500;
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
      const nz = p.z + (dz / afstand) * (stap / 90);
      const nieuw = clampPos(nx, ny, nz);
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
      if (goudDoel?.actief) kiesNieuwDoel(true);
    };

    const id = setInterval(naarGoud, GOUD_NAAR_INTERVAL_MS);
    const eerste = setTimeout(naarGoud, 3500);
    return () => {
      clearInterval(id);
      clearTimeout(eerste);
    };
  }, [actief, goudDoel, kiesNieuwDoel]);

  useEffect(() => {
    const onResize = () => {
      const clamped = clampPos(posRef.current.x, posRef.current.y, posRef.current.z);
      posRef.current = clamped;
      setPos(clamped);
      doelRef.current = clampPos(doelRef.current.x, doelRef.current.y, doelRef.current.z);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const visueel = diepteNaar3D(pos.z, richting);

  return { pos, richting, wandelt, bijGoud, visueel, hoek };
}