"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { publicAssetUrl } from "@/lib/github-pages-base";

type EchteKlant = {
  bedrijf: string;
  plaats: string;
  telefoon: string | null;
  email: string;
  url: string;
  score: number | string;
  probleem: string;
  aanbod: string;
  whatsappUrl: string | null;
  heeftScan?: boolean;
  risicoScore?: number;
  schrikRegels?: string[];
  verkoopBericht?: string;
  verkoopKort?: string;
  whatsappSchrik?: string | null;
  bewijsUrl?: string | null;
  adminProof?: { adminType?: string; zichtbaar?: string };
  uitgesloten?: boolean;
  herstelBericht?: string;
};

export function EchteKlantenPanel() {
  const [klanten, setKlanten] = useState<EchteKlant[]>([]);
  const [meta, setMeta] = useState<{ totaal: number; metScanFeiten?: number; generatedAt: string } | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch(publicAssetUrl("/echte-klanten.json"), { cache: "no-store" });
      if (!r.ok) return;
      const d = await r.json();
      setKlanten(d.klanten || []);
      setMeta({ totaal: d.totaal, metScanFeiten: d.metScanFeiten, generatedAt: d.generatedAt });
    } catch {
      setKlanten([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function copy(text: string, key: string) {
    void navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  const herstel = klanten.filter((k) => k.uitgesloten && k.herstelBericht);
  const metSchrik = klanten.filter(
    (k) => !k.uitgesloten && k.heeftScan && k.verkoopBericht && k.adminProof?.ok,
  );

  return (
    <section className="rounded-2xl border-2 border-amber-400/40 bg-gradient-to-br from-amber-500/15 to-rose-500/10 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-300">Verkoop — echte feiten</p>
          <h2 className="mt-1 text-2xl font-bold">
            {meta ? `${meta.totaal} klanten` : "…"}
            {meta?.metScanFeiten != null && (
              <span className="text-lg font-normal text-rose-300"> · {meta.metScanFeiten} met scan in bericht</span>
            )}
          </h2>
          <p className="mt-1 text-sm text-white/55">
            Bericht + directe link naar hun open admin-inlog. Op bellen: scherm delen zodat zij het zelf zien.
          </p>
          <p className="mt-1 text-xs text-rose-300/90">Niet inloggen. Wel: “uw voordeur staat open” + bewijs-URL.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/vandaag-bellen.csv"
            download="vandaag-bellen.csv"
            className="rounded-full border border-white/20 px-4 py-2 text-sm"
          >
            CSV
          </Link>
          <Link href="/actie/" className="rounded-full bg-amber-500 px-5 py-2 text-sm font-bold text-black">
            Actie
          </Link>
        </div>
      </div>

      <p className="mt-3 text-xs text-white/40">
        Vernieuwen na scan: <code className="text-white/55">npm run lead:berichten</code>
      </p>

      {herstel.length > 0 && (
        <div className="mt-4 rounded-xl border border-sky-400/30 bg-sky-500/10 p-4">
          <p className="text-sm font-bold text-sky-200">Herstel na scan-fout ({herstel.length})</p>
          <p className="mt-1 text-xs text-white/55">Kopieer excuus-bericht — geen lek-claim meer in outreach.</p>
          <ul className="mt-3 space-y-2">
            {herstel.map((k) => (
              <li key={k.url} className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm">
                <span className="font-medium">{k.bedrijf}</span>
                <button
                  type="button"
                  className="ml-3 rounded bg-sky-500/30 px-2 py-0.5 text-xs text-sky-100"
                  onClick={() => copy(k.herstelBericht!, `herstel-${k.url}`)}
                >
                  {copied === `herstel-${k.url}` ? "Gekopieerd ✓" : "Excuus-tekst"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className="mt-5 max-h-[32rem] space-y-3 overflow-y-auto">
        {(metSchrik.length ? metSchrik : klanten).slice(0, 35).map((k) => {
          const key = k.url;
          const isOpen = open === key;
          return (
            <li key={key} className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm">
              <button type="button" className="w-full text-left" onClick={() => setOpen(isOpen ? null : key)}>
                <div className="flex flex-wrap items-center gap-2">
                  {k.heeftScan && <span className="text-rose-400">⛨</span>}
                  <span className="font-bold">{k.bedrijf}</span>
                  <span className="text-amber-300">score {k.risicoScore ?? k.score}</span>
                  {k.telefoon && <span className="font-mono text-emerald-300">{k.telefoon}</span>}
                </div>
                {k.bewijsUrl && (
                  <a href={k.bewijsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 block truncate text-xs text-amber-300 hover:underline">
                    Bewijs: {k.bewijsUrl}
                  </a>
                )}
              </button>

              {isOpen && k.verkoopBericht && (
                <div className="mt-3 border-t border-white/10 pt-3">
                  <pre className="whitespace-pre-wrap text-xs leading-relaxed text-white/75">{k.verkoopBericht}</pre>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => copy(k.verkoopBericht!, key)}
                      className="rounded-lg bg-amber-500/25 px-3 py-1.5 text-amber-100"
                    >
                      {copied === key ? "Gekopieerd ✓" : "Volledig bericht"}
                    </button>
                    {k.verkoopKort && (
                      <button
                        type="button"
                        onClick={() => copy(k.verkoopKort!, key + "k")}
                        className="rounded-lg border border-white/15 px-3 py-1.5"
                      >
                        Kort (WhatsApp)
                      </button>
                    )}
                    {k.whatsappSchrik && (
                      <a
                        href={k.whatsappSchrik}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-emerald-500/30 px-3 py-1.5 text-emerald-200"
                      >
                        WA met feiten
                      </a>
                    )}
                    {k.telefoon && (
                      <a href={`tel:${k.telefoon}`} className="rounded-lg border border-white/15 px-3 py-1.5">
                        Bel
                      </a>
                    )}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}