"use client";

import { useCallback, useEffect, useState } from "react";
import { publicAssetUrl } from "@/lib/github-pages-base";

type ToegangRij = {
  bedrijf?: string;
  siteUrl?: string;
  erin: boolean;
  methode?: string | null;
  detail?: string | null;
  pmaUrl?: string | null;
};

export function ToegangScanPanel() {
  const [rows, setRows] = useState<ToegangRij[]>([]);
  const [meta, setMeta] = useState<{ erin: number; sites: number } | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch(publicAssetUrl("/toegang-scan.json"), { cache: "no-store" });
      if (!r.ok) return;
      const d = await r.json();
      setRows(d.resultaten || []);
      setMeta(d.samenvatting || null);
    } catch {
      setRows([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const erin = rows.filter((x) => x.erin);
  const deur = rows.filter((x) => !x.erin && x.methode === "alleen_inlogscherm").slice(0, 6);

  return (
    <section className="rounded-2xl border-2 border-violet-400/40 bg-violet-500/10 p-6">
      <p className="text-xs font-bold uppercase tracking-widest text-violet-300">Toegang-scan — echt erin?</p>
      <h2 className="mt-1 text-2xl font-bold">
        {meta ? `${meta.erin} erin · ${meta.sites} sites` : "…"}
      </h2>
      <p className="mt-1 text-sm text-white/55">
        Open dashboard, klant-inlog (local.json), of .env+toestemming. Geen brute force.
      </p>
      <p className="mt-2 text-xs text-white/40">
        <code className="text-white/55">npm run scan:toegang</code>
      </p>
      {erin.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {erin.map((row) => (
            <li key={row.siteUrl} className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm">
              <strong>{row.bedrijf}</strong> — {row.methode}
              <p className="text-xs text-white/55">{row.detail}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-amber-200/90">
          Nog niemand “erin” zonder wachtwoord of zonder inlog in local.json. Wel: {deur.length}+ inlogschermen open.
        </p>
      )}
      {deur.length > 0 && (
        <ul className="mt-3 space-y-1 text-xs text-white/50">
          {deur.map((row) => (
            <li key={row.siteUrl}>
              {row.bedrijf} —{" "}
              {row.pmaUrl ? (
                <a href={row.pmaUrl} target="_blank" rel="noreferrer" className="text-sky-300">
                  inlogscherm
                </a>
              ) : (
                "geen pma-url"
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}