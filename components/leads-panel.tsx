"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { KlantenLekPanel } from "@/components/klanten-lek-panel";

type ScoredLead = {
  bedrijf: string;
  plaats: string;
  url: string;
  categorie: string;
  telefoon?: string | null;
  score: number;
  redenen: string[];
  aanbod: string;
  actie: string;
  whatsappUrl?: string | null;
};

type GescoordStore = {
  generatedAt: string;
  totaal: number;
  metTelefoon: number;
  leakMatches: number;
  leads: ScoredLead[];
};

function gescoordUrl(): string {
  if (typeof window === "undefined") return "/klanten-gescoord.json";
  const base = window.location.pathname.startsWith("/OFFERTE-WIJS") ? "/OFFERTE-WIJS" : "";
  return `${window.location.origin}${base}/klanten-gescoord.json`;
}

export function LeadsPanel() {
  const [store, setStore] = useState<GescoordStore | null>(null);
  const [filter, setFilter] = useState("");
  const [stad, setStad] = useState("alle");
  const [onlyPhone, setOnlyPhone] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch(gescoordUrl(), { cache: "no-store" });
      if (r.ok) setStore(await r.json());
    } catch {
      setStore(null);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const leads = (store?.leads || []).filter((l) => {
    if (stad !== "alle" && l.plaats !== stad) return false;
    if (onlyPhone && !l.telefoon) return false;
    const q = filter.toLowerCase();
    if (!q) return true;
    return (
      l.bedrijf.toLowerCase().includes(q) ||
      l.url.toLowerCase().includes(q) ||
      l.categorie.includes(q) ||
      (l.telefoon || "").includes(q)
    );
  });

  const steden = ["alle", ...new Set((store?.leads || []).map((l) => l.plaats))].sort();

  return (
    <div className="space-y-6">
      <KlantenLekPanel />
      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5">
        <p className="font-semibold text-emerald-200">Lead machine</p>
        <p className="mt-2 text-sm text-white/55">
          <code className="text-white/70">npm run lead:hunt</code> → OSM + queue + score. Daarna{" "}
          <code className="text-white/70">npm run scan:leaks</code> →{" "}
          <code className="text-white/70">npm run lead:score</code> (lekken meenemen in score).
        </p>
        {store && (
          <p className="mt-2 text-xs text-white/40">
            {store.totaal} leads · {store.metTelefoon} met telefoon · {store.leakMatches} met lek ·{" "}
            {new Date(store.generatedAt).toLocaleString("nl-NL")}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/dashboard/" className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black">
            Top vandaag (dashboard)
          </Link>
          <Link href="/scan/" className="rounded-lg border border-white/15 px-4 py-2 text-sm">
            VakScan
          </Link>
          <button type="button" onClick={load} className="text-sm text-emerald-400">
            Vernieuwen
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
          value={stad}
          onChange={(e) => setStad(e.target.value)}
        >
          {steden.map((s) => (
            <option key={s} value={s}>
              {s === "alle" ? "Alle plaatsen" : s}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-white/60">
          <input type="checkbox" checked={onlyPhone} onChange={(e) => setOnlyPhone(e.target.checked)} />
          Alleen met telefoon
        </label>
        <input
          className="min-w-[200px] flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
          placeholder="Zoek…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {!store?.leads?.length && (
        <p className="rounded-xl border border-dashed border-white/15 p-8 text-center text-white/45">
          Run <code className="text-white/60">npm run lead:score</code> (na lead:hunt).
        </p>
      )}

      <ul className="space-y-2">
        {leads.slice(0, 200).map((l) => (
          <li
            key={l.url}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-white/8 bg-black/20 px-4 py-3 text-sm"
          >
            <span
              className={`w-10 text-center font-mono font-bold ${l.score >= 70 ? "text-rose-300" : l.score >= 55 ? "text-amber-300" : "text-white/50"}`}
            >
              {l.score}
            </span>
            <span className="rounded bg-white/5 px-2 py-0.5 text-xs">{l.categorie}</span>
            <span className="font-medium">{l.bedrijf}</span>
            <span className="text-white/40">{l.plaats}</span>
            {l.telefoon && <span className="text-xs text-white/35">{l.telefoon}</span>}
            <span className="hidden text-xs text-white/30 lg:inline">{l.aanbod}</span>
            <div className="ml-auto flex gap-2">
              {l.whatsappUrl && (
                <a
                  href={l.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-emerald-500/25 px-3 py-1 text-emerald-200"
                >
                  WA
                </a>
              )}
              <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
                site
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}