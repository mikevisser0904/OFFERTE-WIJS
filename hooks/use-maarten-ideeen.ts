"use client";

import { useCallback, useEffect, useState } from "react";
import {
  MAARTEN_IDEE_EVENT,
  haalIdeeenOp,
  nieuwsteIdee,
  type MaartenIdee,
} from "@/lib/maarten-ideeen";

export function useMaartenIdeeen(actief = true) {
  const [ideeen, setIdeeen] = useState<MaartenIdee[]>([]);
  const [nieuw, setNieuw] = useState<MaartenIdee | null>(null);

  const ververs = useCallback(async () => {
    const lijst = await haalIdeeenOp();
    setIdeeen(lijst);
    return lijst;
  }, []);

  useEffect(() => {
    if (!actief) return;
    void ververs();
    const interval = setInterval(() => void ververs(), 8000);
    return () => clearInterval(interval);
  }, [actief, ververs]);

  useEffect(() => {
    const onNieuw = (e: Event) => {
      const idee = (e as CustomEvent<MaartenIdee>).detail;
      setNieuw(idee);
      setIdeeen((prev) => {
        if (prev.some((p) => p.id === idee.id)) return prev;
        return [idee, ...prev];
      });
      setTimeout(() => setNieuw(null), 12000);
    };
    window.addEventListener(MAARTEN_IDEE_EVENT, onNieuw);
    return () => window.removeEventListener(MAARTEN_IDEE_EVENT, onNieuw);
  }, []);

  return {
    ideeen,
    nieuwste: nieuwsteIdee(ideeen),
    versBinnen: nieuw,
    ververs,
  };
}