"use client";

import { useCallback, useEffect, useState } from "react";
import { publicAssetUrl } from "@/lib/github-pages-base";

type RisicoRij = {
  bedrijf?: string;
  plaats?: string;
  klantUrl?: string;
  url: string;
  niveau: string;
  reden?: string;
  actie?: string;
  http?: number;
};

type RisicoPayload = {
  updatedAt: string;
  uitleg?: string;
  samenvatting?: { gecontroleerd: number; kritiek: number; hoog: number };
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

  const top = (data?.resultaten || []).filter((x) => x.niveau === "kritiek" || x.niveau === "hoog").slice(0, 12);

  return (
    <section className="rounded-2xl border border-rose-400/35 bg-rose-500/10 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-rose-300">Openingen (passief)</p>
          <h2 className="mt-1 text-xl font-bold">
            {data?.samenvatting
              ? `${data.samenvatting.hoog} hoog · ${data.samenvatting.kritiek} kritiek`
              : "Laden…"}
          </h2>
          <p className="mt-1 text-sm text-white/55">
            Zonder inlog: waar de database-deur op internet staat. Jij hoeft niet in te loggen om het risico te zien.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-full border border-white/20 px-4 py-1.5 text-xs text-white/70"
        >
          Vernieuwen
        </button>
      </div>
      <p className="mt-2 text-xs text-white/40">
        Lokaal: <code className="text-white/55">npm run scan:risico-passief</code>
      </p>
      {top.length === 0 ? (
        <p className="mt-4 text-sm text-white/45">Nog geen data — draai scan:risico-passief</p>
      ) : (
        <ul className="mt-4 max-h-80 space-y-2 overflow-y-auto">
          {top.map((row) => (
            <li key={row.url} className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm">
              <span className="font-medium text-white">{row.bedrijf || row.url}</span>
              <span className="ml-2 text-xs uppercase text-rose-300">{row.niveau}</span>
              <p className="mt-1 text-xs text-white/50">{row.reden}</p>
              <a
                href={row.url}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-xs text-sky-300 hover:underline"
              >
                Open bewijs →
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}