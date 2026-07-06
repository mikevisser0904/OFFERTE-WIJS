"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CENTRUM_KANS,
  GOUD_NAAR_INTERVAL_MS,
  GOUD_PAUSE_MS,
  GROOTTE,
  MARGIN,
  MUIS_VOLG_KANS,
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
    z: Math.min(0.98, Math.max(0.35, z)),
  };
}

function centrumPunt(): WandelPos {
  if (typeof window === "undefined") return { x: 100, y: 100, z: 0.75 };
  return clampPos(
    window.innerWidth / 2 - GROOTTE.w / 2 + (Math.random() - 0.5) * 80,
    window.innerHeight / 2 - GROOTTE.h / 2 + (Math.random() - 0.5) * 60,
    0.7 + Math.random() * 0.25
  );
}

function randomPunt(muis?: { x: number; y: number } | null): WandelPos {
  if (typeof window === "undefined") return { x: MARGIN, y: MARGIN, z: 0.6 };

  if (muis && Math.random() < MUIS_VOLG_KANS) {
    return clampPos(
      muis.x - GROOTTE.w / 2 + (Math.random() - 0.5) * 40,
      muis.y - GROOTTE.h / 2 + (Math.random() - 0.5) * 40,
      0.75 + Math.random() * 0.2
    );
  }

  if (Math.random() < CENTRUM_KANS) return centrumPunt();

  const maxX = window.innerWidth - GROOTTE.w - MARGIN;
  const maxY = window.innerHeight - GROOTTE.h - MARGIN;
  const y = MARGIN + Math.random() * Math.max(0, maxY - MARGIN);
  const z = 0.45 + ((y - MARGIN) / Math.max(1, maxY - MARGIN)) * 0.45 + Math.random() * 0.15;
  return clampPos(MARGIN + Math.random() * Math.max(0, maxX - MARGIN), y, z);
}

export function diepteNaar3D(z: number, richting: "links" | "rechts", opdringerig = false) {
  const boost = opdringerig ? 0.14 : 0;
  const scale = 0.82 + z * 0.48 + boost;
  const rotateY = richting === "links" ? 28 * z : -28 * z;
  const rotateX = -10 + z * 14;
  const translateZ = -40 + z * 200;
  const blur = Math.max(0, (1 - z) * 0.8);
  const brightness = 0.9 + z * 0.15;
  const zIndex = 9800 + Math.round(z * 80);

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
  opdringerig = true,
}: {
  actief: boolean;
  goudDoel: (WandelPos & { actief?: boolean }) | null;
  opdringerig?: boolean;
}) {
  const reducedRef = useRef(false);
  const muisRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => {
      reducedRef.current = mq.matches;
    };
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      muisRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const [pos, setPos] = useState<WandelPos>({ x: MARGIN, y: 200, z: 0.65 });
  const [richting, setRichting] = useState<"links" | "rechts">("rechts");
  const [wandelt, setWandelt] = useState(true);
  const [bijGoud, setBijGoud] = useState(false);

  const posRef = useRef(pos);
  const doelRef = useRef<WandelPos>(randomPunt());
  const pauseTotRef = useRef(0);
  const goudModusRef = useRef(false);
  const frameRef = useRef<number>(0);
  const hoekRef = useRef(0);

  const kiesNieuwDoel = useCallback(
    (naarGoud = false, naarMuis = false) => {
      if (naarGoud && goudDoel?.actief) {
        goudModusRef.current = true;
        doelRef.current = clampPos(
          goudDoel.x - GROOTTE.w / 2,
          goudDoel.y - GROOTTE.h / 2,
          Math.max(0.7, goudDoel.z ?? 0.75)
        );
        return;
      }
      goudModusRef.current = false;
      doelRef.current = randomPunt(naarMuis ? muisRef.current : null);
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
        window.innerWidth / 2 - GROOTTE.w / 2,
        window.innerHeight / 2 - GROOTTE.h / 2,
        0.8
      )
    );
    doelRef.current = centrumPunt();
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

      hoekRef.current += 0.012;
      const p = posRef.current;
      const d = doelRef.current;

      const orbitX = Math.cos(hoekRef.current) * 0.65;
      const orbitY = Math.sin(hoekRef.current * 0.7) * 0.25;
      const orbitZ = Math.sin(hoekRef.current) * 0.12;

      const dx = d.x - p.x + orbitX;
      const dy = d.y - p.y + orbitY;
      const dz = d.z - p.z + orbitZ;
      const afstand = Math.hypot(dx, dy, dz * 60);

      if (afstand < 16) {
        if (goudModusRef.current) {
          setBijGoud(true);
          setWandelt(false);
          pauseTotRef.current = t + GOUD_PAUSE_MS;
          goudModusRef.current = false;
          setTimeout(() => setBijGoud(false), GOUD_PAUSE_MS);
        } else {
          pauseTotRef.current = t + 120 + Math.random() * 280;
        }
        kiesNieuwDoel(false, Math.random() < 0.5);
        frameRef.current = requestAnimationFrame(loop);
        return;
      }

      setWandelt(true);
      setBijGoud(false);
      const stap = Math.min(SNELHEID, afstand);
      const nx = p.x + (dx / afstand) * stap;
      const ny = p.y + (dy / afstand) * stap;
      const nz = p.z + (dz / afstand) * (stap / 70);
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

    const naarMuis = () => kiesNieuwDoel(false, true);

    const goudId = setInterval(naarGoud, GOUD_NAAR_INTERVAL_MS);
    const muisId = setInterval(naarMuis, 7000);
    const eerste = setTimeout(naarGoud, 1500);
    return () => {
      clearInterval(goudId);
      clearInterval(muisId);
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

  const visueel = diepteNaar3D(pos.z, richting, opdringerig);

  return { pos, richting, wandelt, bijGoud, visueel };
}