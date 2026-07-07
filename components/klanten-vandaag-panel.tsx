"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type TopLead = {
  bedrijf: string;
  plaats: string;
  url: string;
  telefoon?: string | null;
  score: number;
  redenen: string[];
  aanbod: string;
  actie: string;
  whatsappUrl?: string | null;
};

type VandaagStore = {
  generatedAt: string;
  instructie: string;
  top: TopLead[];
};

function vandaagUrl(): string {
  if (typeof window === "undefined") return "/klanten-vandaag.json";
  const base = window.location.pathname.startsWith("/OFFERTE-WIJS") ? "/OFFERTE-WIJS" : "";
  return `${window.location.origin}${base}/klanten-vandaag.json`;
}

export function KlantenVandaagPanel() {
  const [data, setData] = useState<VandaagStore | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch(vandaagUrl(), { cache: "no-store" });
      if (r.ok) setData(await r.json());
    } catch {
      setData(null);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (!data?.top?.length) {
    return (
      <section className="rounded-2xl border border-amber-400/25 bg-amber-400/5 p-6">
        <h2 className="text-lg font-bold text-amber-200">Potentiële klanten vandaag</h2>
        <p className="mt-2 text-sm text-white/50">
          Nog geen scores. Run: <code className="text-white/70">npm run lead:hunt</code> en daarna{" "}
          <code className="text-white/70">npm run scan:leaks</code> → opnieuw{" "}
          <code className="text-white/70">npm run lead:score</code>
        </p>
        <Link href="/leads/" className="mt-3 inline-block text-sm font-medium text-emerald-400 hover:underline">
          Alle leads →
        </Link>
      </section>
    );
  }

  const belNu = data.top.filter((t) => t.actie === "bel-nu");
  const rest = data.top.filter((t) => t.actie !== "bel-nu").slice(0, 12);

  return (
    <section className="rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 to-emerald-500/5 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">Geld vandaag</p>
          <h2 className="mt-1 text-2xl font-bold">Top {data.top.length} potentiële klanten</h2>
          <p className="mt-1 text-sm text-white/50">{data.instructie}</p>
          <p className="mt-1 text-xs text-white/35">
            Bijgewerkt: {new Date(data.generatedAt).toLocaleString("nl-NL")}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/actie/"
            className="rounded-full bg-amber-500 px-5 py-2 text-sm font-bold text-black hover:bg-amber-400"
          >
            Actie →
          </Link>
          <Link href="/leads/" className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/80">
            Alle leads
          </Link>
        </div>
      </div>

      {belNu.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-semibold text-rose-300">⚠ Eerst bellen ({belNu.length} lekken)</p>
          <ul className="mt-2 space-y-2">
            {belNu.map((t) => (
              <li key={t.url} className="rounded-xl border border-rose-400/30 bg-black/25 px-4 py-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold">{t.bedrijf}</span>
                  <span className="text-rose-300">score {t.score}</span>
                  <span className="text-white/40">{t.plaats}</span>
                </div>
                <p className="mt-1 text-xs text-white/55">{t.redenen.join(" · ")}</p>
                <p className="mt-1 text-xs text-emerald-300">{t.aanbod}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className="mt-5 space-y-2">
        {rest.map((t) => (
          <li
            key={t.url}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm"
          >
            <span className="w-8 font-mono text-amber-300">{t.score}</span>
            <span className="min-w-0 flex-1 font-medium">{t.bedrijf}</span>
            <span className="text-white/40">{t.categorie ?? t.plaats}</span>
            {t.whatsappUrl ? (
              <a
                href={t.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-emerald-500/20 px-3 py-1 text-emerald-200 hover:bg-emerald-500/30"
              >
                WhatsApp
              </a>
            ) : (
              <a href={t.url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
                Site
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}