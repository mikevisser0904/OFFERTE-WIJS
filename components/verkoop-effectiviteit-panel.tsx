"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { publicAssetUrl } from "@/lib/github-pages-base";

type Effectiviteit = {
  generatedAt: string;
  totaalScore: number;
  label: string;
  dimensies: {
    tekstKwaliteit: { score: number; berichten: number; angstHits: number };
    pipeline: { score: number; verkoopVandaag: number; outreachVandaag: number; metTelefoon: number };
    bewijsDekking: { score: number; metAdminBewijs: number };
    outbound: { contactenDezeWeek: number; reacties: number; conversiePct: number | null; gemeten: boolean };
  };
  aanbevelingen: string[];
  agentPrompt?: string;
};

export function VerkoopEffectiviteitPanel() {
  const [data, setData] = useState<Effectiviteit | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch(publicAssetUrl("/verkoop-effectiviteit.json"), { cache: "no-store" });
      if (r.ok) setData(await r.json());
    } catch {
      setData(null);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (!data) {
    return (
      <section className="rounded-2xl border border-dashed border-white/15 p-6 text-center text-sm text-white/45">
        Nog geen test. Lokaal: <code className="text-white/60">npm run test:effectiviteit</code>
      </section>
    );
  }

  const kleur =
    data.totaalScore >= 70 ? "border-emerald-400/30 bg-emerald-500/10" : data.totaalScore >= 45 ? "border-amber-400/30 bg-amber-500/10" : "border-rose-400/30 bg-rose-500/10";

  return (
    <section className={`rounded-2xl border p-6 ${kleur}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/45">Verkoop-effectiviteit</p>
          <p className="mt-1 text-4xl font-bold">{data.totaalScore}%</p>
          <p className="text-sm text-white/70">{data.label}</p>
          <p className="mt-1 text-xs text-white/40">
            {data.generatedAt ? new Date(data.generatedAt).toLocaleString("nl-NL") : ""}
          </p>
        </div>
        <button type="button" onClick={() => void load()} className="text-xs text-sky-300 hover:underline">
          Vernieuwen
        </button>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Tekst (feit)", data.dimensies.tekstKwaliteit.score, `${data.dimensies.tekstKwaliteit.angstHits} angst`],
          ["Pipeline", data.dimensies.pipeline.score, `${data.dimensies.pipeline.verkoopVandaag} bewijs`],
          ["Bewijs", data.dimensies.bewijsDekking.score, `${data.dimensies.bewijsDekking.metAdminBewijs} klanten`],
          [
            "Outbound",
            data.dimensies.outbound.gemeten ? (data.dimensies.outbound.conversiePct ?? 0) : "—",
            data.dimensies.outbound.gemeten
              ? `${data.dimensies.outbound.reacties}/${data.dimensies.outbound.contactenDezeWeek} reacties`
              : "log in /monitor/",
          ],
        ].map(([label, val, sub]) => (
          <div key={String(label)} className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm">
            <p className="text-white/45">{label}</p>
            <p className="text-xl font-semibold text-white">{val}</p>
            <p className="text-xs text-white/40">{sub}</p>
          </div>
        ))}
      </div>

      <ul className="mt-4 space-y-1 text-sm text-white/75">
        {data.aanbevelingen.map((a) => (
          <li key={a}>• {a}</li>
        ))}
      </ul>

      <p className="mt-4 font-mono text-[10px] text-white/35">
        npm run test:effectiviteit · na berichten-wijziging opnieuw draaien
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link href="/actie/" className="rounded-full bg-emerald-500/25 px-4 py-1.5 text-xs font-medium text-emerald-100">
          Actie
        </Link>
        <Link href="/monitor/" className="rounded-full border border-white/15 px-4 py-1.5 text-xs text-white/70">
          KPI loggen
        </Link>
      </div>
    </section>
  );
}