"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type EchteKlant = {
  bedrijf: string;
  plaats: string;
  telefoon: string;
  email: string;
  url: string;
  score: number | string;
  probleem: string;
  aanbod: string;
  whatsappUrl: string | null;
};

function urlJson() {
  const base = typeof window !== "undefined" && window.location.pathname.startsWith("/OFFERTE-WIJS") ? "/OFFERTE-WIJS" : "";
  return `${typeof window !== "undefined" ? window.location.origin : ""}${base}/echte-klanten.json`;
}

export function EchteKlantenPanel() {
  const [klanten, setKlanten] = useState<EchteKlant[]>([]);
  const [meta, setMeta] = useState<{ totaal: number; generatedAt: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch(urlJson(), { cache: "no-store" });
      if (!r.ok) return;
      const d = await r.json();
      setKlanten(d.klanten || []);
      setMeta({ totaal: d.totaal, generatedAt: d.generatedAt });
    } catch {
      setKlanten([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className="rounded-2xl border-2 border-emerald-400/40 bg-emerald-500/10 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Echte klanten</p>
          <h2 className="mt-1 text-2xl font-bold">
            {meta ? `${meta.totaal} bedrijven met telefoon of mail` : "Laden…"}
          </h2>
          <p className="mt-1 text-sm text-white/55">Geen URL-lijst — alleen wie je nu kunt bellen of appen.</p>
        </div>
        <a
          href={`${typeof window !== "undefined" && window.location.pathname.startsWith("/OFFERTE-WIJS") ? "/OFFERTE-WIJS" : ""}/vandaag-bellen.csv`}
          className="rounded-full border border-white/20 px-5 py-2.5 text-sm text-white/80"
        >
          CSV
        </a>
        <Link href="/actie/" className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-bold text-black">
          Actie →
        </Link>
      </div>

      {klanten.length === 0 && (
        <p className="mt-4 text-sm text-white/45">
          Run lokaal: <code className="text-white/70">npm run lead:contact</code> (scrapet nummers van websites).
        </p>
      )}

      <ul className="mt-5 max-h-[28rem] space-y-2 overflow-y-auto">
        {klanten.slice(0, 40).map((k) => (
          <li key={`${k.url}-${k.telefoon}`} className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold">{k.bedrijf}</span>
              <span className="text-white/40">{k.plaats}</span>
              {k.telefoon && <a href={`tel:${k.telefoon}`} className="font-mono text-emerald-300">{k.telefoon}</a>}
            </div>
            <p className="mt-1 text-xs text-amber-200/90">{k.probleem} → {k.aanbod}</p>
            <div className="mt-2 flex gap-2">
              {k.whatsappUrl && (
                <a href={k.whatsappUrl} target="_blank" rel="noopener noreferrer" className="rounded bg-emerald-500/30 px-3 py-1 text-emerald-200">
                  WhatsApp
                </a>
              )}
              {k.email && (
                <a href={`mailto:${k.email}`} className="text-white/50 hover:underline">
                  {k.email}
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-white/35">
        CSV: download <code className="text-white/50">vandaag-bellen.csv</code> uit repo na{" "}
        <code className="text-white/50">npm run lead:contact</code>
        {meta?.generatedAt && ` · ${new Date(meta.generatedAt).toLocaleString("nl-NL")}`}
      </p>
    </section>
  );
}