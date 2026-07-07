"use client";

import { useCallback, useEffect, useState } from "react";
import { publicAssetUrl } from "@/lib/github-pages-base";

type RisicoRij = {
  bedrijf?: string;
  url: string;
  niveau: string;
  reden?: string;
};

type RisicoPayload = {
  samenvatting?: { hoog: number; kritiek: number };
  resultaten: RisicoRij[];
};

export function RisicoPassiefPanel() {
  const [data, setData] = useState<RisicoPayload | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch(publicAssetUrl("/risico-passief.json"), { cache: "no-store" });
      if (r.ok) setData(await r.json());
    } catch {
      setData(null);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const top = (data?.resultaten || []).filter((x) => x.niveau === "kritiek" || x.niveau === "hoog").slice(0, 8);

  return (
    <section className="rounded-2xl border border-rose-400/35 bg-rose-500/10 p-6">
      <p className="text-xs font-bold uppercase tracking-widest text-rose-300">Deur open (passief)</p>
      <h2 className="mt-1 text-xl font-bold">
        {data?.samenvatting ? `${data.samenvatting.hoog} hoog` : "…"}
      </h2>
      <p className="mt-1 text-xs text-white/40">npm run scan:risico-passief</p>
      <ul className="mt-3 space-y-2">
        {top.map((row) => (
          <li key={row.url} className="text-sm">
            <a href={row.url} target="_blank" rel="noreferrer" className="text-sky-300 hover:underline">
              {row.bedrijf}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}