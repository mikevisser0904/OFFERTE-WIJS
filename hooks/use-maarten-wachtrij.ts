"use client";

import { useCallback, useEffect, useState } from "react";
import { haalWachtrijOp } from "@/lib/maarten-ideeen";
import { pendingIdeeen, type MaartenWachtrij } from "@/lib/maarten-wachtrij";

const LEEG: MaartenWachtrij = {
  versie: 1,
  repo: "OFFERTE-WIJS",
  lastSync: null,
  lastNtfyId: null,
  ideeen: [],
};

export function useMaartenWachtrij(actief = true, intervalMs = 8000) {
  const [wachtrij, setWachtrij] = useState<MaartenWachtrij>(LEEG);
  const [laden, setLaden] = useState(true);

  const ververs = useCallback(async () => {
    const data = await haalWachtrijOp();
    setWachtrij(data);
    setLaden(false);
    return data;
  }, []);

  useEffect(() => {
    if (!actief) return;
    void ververs();
    const interval = setInterval(() => void ververs(), intervalMs);
    return () => clearInterval(interval);
  }, [actief, intervalMs, ververs]);

  return {
    wachtrij,
    pending: pendingIdeeen(wachtrij),
    laden,
    ververs,
  };
}