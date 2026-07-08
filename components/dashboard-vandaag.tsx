"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { berekenSlagingskans } from "@/data/monitoring";
import { hoofddoel } from "@/data/doel";
import { KPI_CHANGE_EVENT, laadKpiMetMeta } from "@/lib/goudzoeker";

export function DashboardVandaag() {
  const [geladen, setGeladen] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof berekenSlagingskans> | null>(null);

  useEffect(() => {
    function refresh() {
      const { kpi } = laadKpiMetMeta();
      setResult(berekenSlagingskans(kpi));
      setGeladen(true);
    }
    refresh();
    window.addEventListener(KPI_CHANGE_EVENT, refresh);
    return () => window.removeEventListener(KPI_CHANGE_EVENT, refresh);
  }, []);

  if (!geladen || !result) {
    return <div className="h-32 animate-pulse rounded-2xl bg-white/[0.03]" />;
  }

  const kleur =
    result.kleur === "emerald"
      ? "border-emerald-400/30 bg-emerald-400/[0.07]"
      : result.kleur === "amber"
        ? "border-amber-400/30 bg-amber-400/[0.07]"
        : "border-rose-400/30 bg-rose-400/[0.07]";

  return (
    <section className={`rounded-2xl border p-6 ${kleur}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/45">
            Vandaag · week {result.week}/12
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Slagingskans {result.totaal}% — {result.label}
          </h2>
          <p className="mt-1 text-sm text-white/55">
            {hoofddoel.realistisch.slice(0, 72)}…
          </p>
        </div>
        <Link
          href="/actie/"
          className="rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white/70 hover:text-white"
        >
          Actie
        </Link>
        <Link
          href="/monitor/"
          className="shrink-0 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-slate-900 hover:bg-white/90"
        >
          Open monitor →
        </Link>
      </div>

      {result.acties.length > 0 && (
        <ul className="mt-5 space-y-2 text-sm text-white/75">
          {result.acties.slice(0, 4).map((a) => (
            <li key={a}>→ {a}</li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href="/actie/"
          className="rounded-full bg-amber-400 px-4 py-1.5 text-xs font-bold text-slate-900"
        >
          Vandaag geld →
        </Link>
        <Link
          href="/bestellen/"
          className="rounded-full border border-white/20 px-4 py-1.5 text-xs text-white/80"
        >
          Bestelformulier
        </Link>
      </div>
    </section>
  );
}