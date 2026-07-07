"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type Lead = {
  bedrijf: string;
  plaats: string;
  url: string;
  categorie: string;
  prioriteit: string;
};

type LeadStore = {
  generatedAt: string | null;
  bron: string;
  totaal: number;
  perPlaats: { plaats: string; count: number }[];
  leads: Lead[];
};

function leadsJsonUrl(): string {
  if (typeof window === "undefined") return "/potentiele-klanten.json";
  const base = window.location.pathname.startsWith("/OFFERTE-WIJS") ? "/OFFERTE-WIJS" : "";
  return `${window.location.origin}${base}/potentiele-klanten.json`;
}

export function LeadsPanel() {
  const [store, setStore] = useState<LeadStore | null>(null);
  const [filter, setFilter] = useState("");
  const [stad, setStad] = useState("alle");
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch(leadsJsonUrl(), { cache: "no-store" });
      if (!r.ok) return;
      setStore(await r.json());
    } catch {
      setStore(null);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const leads = (store?.leads || []).filter((l) => {
    if (stad !== "alle" && l.plaats !== stad) return false;
    const q = filter.toLowerCase();
    if (!q) return true;
    return l.bedrijf.toLowerCase().includes(q) || l.url.toLowerCase().includes(q) || l.categorie.includes(q);
  });

  const steden = ["alle", ...new Set((store?.leads || []).map((l) => l.plaats))].sort();

  function copyTop20() {
    const lines = leads.slice(0, 20).map((l) => `${l.bedrijf}|${l.plaats}|${l.url}`);
    void navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5">
        <p className="font-semibold text-emerald-200">Lead hunter agent</p>
        <p className="mt-2 text-sm text-white/55">
          Verse lijst: <code className="text-white/70">npm run lead:hunt</code> (OSM → queue). Daarna{" "}
          <code className="text-white/70">npm run scan:leaks</code> of <code className="text-white/70">LEAD_SCAN=1 npm run lead:hunt</code>.
        </p>
        <p className="mt-2 text-xs text-white/40">
          Laatste run: {store?.generatedAt ? new Date(store.generatedAt).toLocaleString("nl-NL") : "—"} ·{" "}
          {store?.totaal ?? 0} leads · bron: {store?.bron ?? "—"}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/scan/" className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black">
            VakScan
          </Link>
          <Link href="/actie/" className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/80">
            Actie / WhatsApp
          </Link>
          <button type="button" onClick={copyTop20} className="rounded-lg border border-white/15 px-4 py-2 text-sm">
            {copied ? "Gekopieerd ✓" : "Top 20 copy (import)"}
          </button>
          <button type="button" onClick={load} className="text-sm text-emerald-400">
            Vernieuwen
          </button>
        </div>
      </div>

      {store?.perPlaats && store.perPlaats.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {store.perPlaats.map((p) => (
            <span key={p.plaats} className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs">
              {p.plaats}: <strong className="text-emerald-300">{p.count}</strong>
            </span>
          ))}
        </div>
      )}

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
        <input
          className="min-w-[200px] flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
          placeholder="Zoek bedrijf, url, categorie…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {!store?.leads?.length && (
        <p className="rounded-xl border border-dashed border-white/15 p-8 text-center text-white/45">
          Nog geen leads. Run lokaal: <code className="text-white/60">npm run lead:hunt</code> en push{" "}
          <code className="text-white/60">data/potentiele-klanten.json</code>.
        </p>
      )}

      <ul className="space-y-2">
        {leads.slice(0, 150).map((l) => (
          <li
            key={`${l.url}-${l.bedrijf}`}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-white/8 bg-black/20 px-4 py-3 text-sm"
          >
            <span className="rounded bg-white/5 px-2 py-0.5 text-xs text-white/45">{l.categorie}</span>
            <span className="font-medium">{l.bedrijf}</span>
            <span className="text-white/40">{l.plaats}</span>
            <a href={l.url} target="_blank" rel="noopener noreferrer" className="ml-auto truncate text-emerald-400 hover:underline max-w-[45%]">
              {l.url.replace(/^https?:\/\//, "")}
            </a>
          </li>
        ))}
      </ul>
      {leads.length > 150 && <p className="text-xs text-white/40">+ {leads.length - 150} meer — filter of export via import-bestand</p>}
    </div>
  );
}