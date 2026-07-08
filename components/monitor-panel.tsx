"use client";

import { useEffect, useState } from "react";
import {
  defaultKpi,
  berekenSlagingskans,
  monitorUitleg,
  type KpiInput,
} from "@/data/monitoring";
import Link from "next/link";
import { hoofddoel } from "@/data/doel";
import { SITE_URL } from "@/lib/seo";
import { laadKpiMetMeta, slaKpi } from "@/lib/goudzoeker";
import { MonitorDienstenLadder } from "@/components/monitor-diensten-ladder";

type HealthStatus = {
  checkedAt: string;
  healthy: boolean;
  avgResponseMs: number;
  checks: { name: string; ok: boolean; status: number; ms: number }[];
};

export function MonitorPanel() {
  const [kpi, setKpi] = useState<KpiInput>(defaultKpi);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [geladen, setGeladen] = useState(false);

  useEffect(() => {
    const local = laadKpiMetMeta();
    setKpi(local.kpi);
    setGeladen(true);

    fetch(`${SITE_URL}/kpi-snapshot.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((snap) => {
        if (snap?.kpi && !local.opgeslagen) {
          setKpi({ ...defaultKpi, ...snap.kpi });
        }
      })
      .catch(() => {});

    fetch(`${SITE_URL}/health.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  function save(next: KpiInput) {
    setKpi(next);
    slaKpi(next);
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(kpi, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `doekoewijs-monitor-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  }

  if (!geladen) {
    return <div className="h-64 animate-pulse rounded-2xl bg-white/[0.03]" />;
  }

  const result = berekenSlagingskans(kpi);
  const kleurMap = {
    emerald: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10",
    amber: "text-amber-300 border-amber-400/30 bg-amber-400/10",
    rose: "text-rose-300 border-rose-400/30 bg-rose-400/10",
  };

  const week1Start =
    kpi.contactenDezeWeek === 0 &&
    kpi.omzet === 0 &&
    kpi.bestellingen === 0 &&
    result.week <= 2;

  return (
    <div className="space-y-8">
      {week1Start && (
        <section className="rounded-2xl border border-sky-400/25 bg-sky-400/5 p-5 text-sm text-white/70">
          <p className="font-bold text-sky-200">Nog niet gestart?</p>
          <p className="mt-2">{monitorUitleg.week1Hint}</p>
          <Link href="/actie/" className="mt-3 inline-block font-semibold text-emerald-300 hover:underline">
            Naar actie →
          </Link>
        </section>
      )}
      <section className={`rounded-2xl border p-8 ${kleurMap[result.kleur]}`}>
        <p className="text-xs font-semibold uppercase tracking-widest opacity-70">
          Slagingskans · week {result.week}/{12}
        </p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-5xl font-bold">{result.totaal}%</p>
            <p className="mt-1 text-lg font-semibold">{result.label}</p>
          </div>
          <div className="text-right text-sm opacity-80">
            <p>Doel: {hoofddoel.label}</p>
            <p>
              Omzet: €{kpi.omzet.toLocaleString("nl-NL")} / €
              {hoofddoel.bedrag.toLocaleString("nl-NL")}
            </p>
          </div>
        </div>
        <div className="mt-6 h-3 overflow-hidden rounded-full bg-black/20">
          <div
            className="h-full rounded-full bg-current transition-all"
            style={{ width: `${result.totaal}%` }}
          />
        </div>
      </section>

      {health && (
        <section className="rounded-2xl border border-white/8 bg-white/[0.02] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-bold">Site status (auto, elke 4 uur)</h2>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                health.healthy
                  ? "bg-emerald-400/20 text-emerald-300"
                  : "bg-rose-400/20 text-rose-300"
              }`}
            >
              {health.healthy ? "Online" : "Probleem"}
            </span>
          </div>
          <p className="mt-2 text-xs text-white/40">
            Laatste check: {new Date(health.checkedAt).toLocaleString("nl-NL")} · gem.{" "}
            {health.avgResponseMs}ms
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {health.checks.map((c) => (
              <div
                key={c.name}
                className="flex items-center justify-between rounded-lg border border-white/5 px-3 py-2 text-sm"
              >
                <span>{c.name}</span>
                <span className={c.ok ? "text-emerald-400" : "text-rose-400"}>
                  {c.ok ? `✓ ${c.ms}ms` : `✗ ${c.status}`}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <MonitorDienstenLadder />

      {result.acties.length > 0 && (
        <section className="rounded-2xl border border-rose-400/20 bg-rose-400/5 p-6">
          <h2 className="font-bold text-rose-300">Actie nu</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/65">
            {result.acties.map((a) => (
              <li key={a}>→ {a}</li>
            ))}
          </ul>
          <Link href="/actie/" className="mt-4 inline-block text-sm font-semibold text-emerald-300 hover:underline">
            Naar /actie/ →
          </Link>
        </section>
      )}

      <section>
        <h2 className="mb-4 font-bold">KPI&apos;s bijwerken (wekelijks)</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              ["omzet", "Omzet totaal (€)", "number"],
              ["bestellingen", "Bestellingen", "number"],
              ["contactenDezeWeek", "Contacten deze week", "number"],
              ["sitesGeleverd", "Opdrachten geleverd (alle diensten)", "number"],
              ["reacties", "Reacties op contacten", "number"],
              ["startDatum", "Startdatum", "date"],
            ] as const
          ).map(([key, label, type]) => (
            <div key={key}>
              <label className="text-xs text-white/40">{label}</label>
              <input
                type={type}
                value={kpi[key]}
                onChange={(e) =>
                  save({
                    ...kpi,
                    [key]:
                      type === "number" ? Number(e.target.value) || 0 : e.target.value,
                  })
                }
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={exportData}
            className="rounded-full border border-white/15 px-5 py-2 text-sm hover:bg-white/5"
          >
            Exporteer JSON
          </button>
          <p className="text-xs text-white/40 self-center">
            Team: <code className="text-white/55">npm run kpi:snapshot -- bestand.json</code> → commit → push
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-bold">Score per KPI</h2>
        <div className="space-y-3">
          {result.kpiScores.map((k) => (
            <div
              key={k.id}
              className="rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">{k.label}</span>
                <span
                  className={`text-xs font-bold ${
                    k.status === "goed"
                      ? "text-emerald-400"
                      : k.status === "let-op"
                        ? "text-amber-400"
                        : "text-rose-400"
                  }`}
                >
                  {k.score}% · {k.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-white/45">
                {k.eenheid === "€"
                  ? `€${k.huidig.toLocaleString("nl-NL")} / €${k.doel.toLocaleString("nl-NL")}`
                  : `${k.huidig} / ${k.doel}`}
              </p>
              <p className="mt-1 text-xs text-white/35">{k.tip}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-white/30">{monitorUitleg.opslag}</p>
    </div>
  );
}