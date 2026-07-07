"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  agentsRegistryUrl,
  agentsStatusUrl,
  outreachVandaagUrl,
  potentieleKlantenUrl,
  managerStatusUrl,
  optimizerStatusUrl,
  dataFlowStatusUrl,
  funnelStatusUrl,
  type AgentRegistryEntry,
  type DataFlowStatus,
  type FunnelStatus,
  type OptimizerStatus,
  type OutreachVandaag,
  type ManagerStatus,
} from "@/lib/agents";

type AgentsStatus = {
  updatedAt?: string;
  agents?: Record<
    string,
    {
      lastRun?: string;
      agentPrompt?: string;
      ok?: boolean;
      leadsTotaal?: number;
      queuePending?: number;
      contactenVandaag?: number;
      lekkenEerst?: number;
      top3?: string[];
    }
  >;
};

type LeadsPayload = { totaal?: number; perPlaats?: { plaats: string; count: number }[] };

export function AgentsPanel() {
  const [registry, setRegistry] = useState<AgentRegistryEntry[]>([]);
  const [status, setStatus] = useState<AgentsStatus | null>(null);
  const [outreach, setOutreach] = useState<OutreachVandaag | null>(null);
  const [leads, setLeads] = useState<LeadsPayload | null>(null);
  const [manager, setManager] = useState<ManagerStatus | null>(null);
  const [optimizer, setOptimizer] = useState<OptimizerStatus | null>(null);
  const [dataFlow, setDataFlow] = useState<DataFlowStatus | null>(null);
  const [funnel, setFunnel] = useState<FunnelStatus | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [reg, st, out, ld, mgr, opt, df, fn] = await Promise.all([
      fetch(agentsRegistryUrl()).then((r) => (r.ok ? r.json() : { agents: [] })),
      fetch(agentsStatusUrl()).then((r) => (r.ok ? r.json() : null)),
      fetch(outreachVandaagUrl()).then((r) => (r.ok ? r.json() : null)),
      fetch(potentieleKlantenUrl()).then((r) => (r.ok ? r.json() : null)),
      fetch(managerStatusUrl()).then((r) => (r.ok ? r.json() : null)),
      fetch(optimizerStatusUrl()).then((r) => (r.ok ? r.json() : null)),
      fetch(dataFlowStatusUrl()).then((r) => (r.ok ? r.json() : null)),
      fetch(funnelStatusUrl()).then((r) => (r.ok ? r.json() : null)),
    ]);
    setRegistry(reg.agents || []);
    setStatus(st);
    setOutreach(out);
    setLeads(ld);
    setManager(mgr);
    setOptimizer(opt);
    setDataFlow(df);
    setFunnel(fn);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function copy(text: string, id: string) {
    void navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  const lh = status?.agents?.["lead-hunter"];
  const or = status?.agents?.outreach;

  const faseKleur =
    manager?.fase === "site"
      ? "border-rose-400/40 bg-rose-500/15"
      : manager?.fase === "verkopen"
        ? "border-amber-400/35 bg-amber-500/10"
        : "border-violet-400/30 bg-violet-500/10";

  return (
    <div className="space-y-8">
      <section className={`rounded-2xl border p-5 ${faseKleur}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-white/45">Manager Agent</p>
            <h2 className="text-xl font-bold text-white">{manager?.faseLabel ?? "Nog geen run"}</h2>
            <p className="mt-2 text-sm text-white/60">
              <span className="text-violet-200">Mike:</span> {manager?.mikeActie ?? "Open /agents/ na npm run agent:manager"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => manager?.grokPrompt && copy(manager.grokPrompt, "grok")}
            className="rounded-lg bg-violet-500/25 px-4 py-2 text-sm font-medium text-violet-100"
          >
            {copied === "grok" ? "Prompt gekopieerd ✓" : "Grok-prompt kopiëren"}
          </button>
        </div>
        {manager?.grokPrompt && (
          <p className="mt-3 rounded-lg bg-black/35 p-3 font-mono text-xs text-emerald-200/90">{manager.grokPrompt}</p>
        )}
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {(manager?.cards || []).map((c) => (
            <div
              key={c.id}
              className={`rounded-lg border px-3 py-2 text-xs ${
                c.status === "ok" ? "border-emerald-400/25 bg-emerald-400/5" : "border-amber-400/30 bg-amber-400/10"
              }`}
            >
              <p className="font-semibold text-white">{c.naam}</p>
              <p className="text-white/50">{c.detail}</p>
            </div>
          ))}
        </div>
        {optimizer && (
          <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
            <p className="text-sm font-semibold text-emerald-200">Optimizer (continu)</p>
            <p className="mt-1 text-xs text-white/50">{optimizer.grokPrompt}</p>
            <ul className="mt-2 space-y-1 text-xs text-white/45">
              {(optimizer.uitgevoerd || []).slice(0, 4).map((u) => (
                <li key={u.titel}>
                  {u.titel}: <span className="text-white/70">{u.status}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 font-mono text-[10px] text-white/35">npm run agent:optimizer:apply · elke 6u in CI</p>
          </div>
        )}
        <pre className="mt-4 overflow-x-auto rounded-lg bg-black/40 p-3 text-xs text-white/50">
          npm run funnel · npm run agent:manager · npm run agent:dataflow
        </pre>
      </section>

      {funnel && (
        <section
          className={`rounded-2xl border p-5 ${
            funnel.ok ? "border-emerald-400/25 bg-emerald-500/5" : "border-amber-400/30 bg-amber-500/10"
          }`}
        >
          <p className="text-xs font-medium uppercase tracking-wider text-white/45">Funnel · één commando</p>
          <h2 className="text-lg font-bold text-white">
            {funnel.ok ? "Laatste run OK" : "Laatste run met waarschuwingen"} · {funnel.mode}
          </h2>
          <p className="mt-1 text-xs text-white/50">
            {funnel.finishedAt ? new Date(funnel.finishedAt).toLocaleString("nl-NL") : "—"}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {(funnel.steps || []).map((s) => (
              <li
                key={s.id}
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  s.ok ? "bg-emerald-400/15 text-emerald-200" : "bg-amber-400/15 text-amber-200"
                }`}
              >
                {s.id}
              </li>
            ))}
          </ul>
          <p className="mt-3 font-mono text-xs text-white/45">{funnel.next}</p>
        </section>
      )}

      {dataFlow && (
        <section
          className={`rounded-2xl border p-5 ${
            dataFlow.healthy ? "border-sky-400/25 bg-sky-500/5" : "border-amber-400/30 bg-amber-500/10"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/45">Data-flow</p>
              <h2 className="text-lg font-bold text-white">
                {dataFlow.healthy ? "Alle streams live" : "Sync nodig"}
              </h2>
              <p className="mt-1 text-sm text-white/55">{dataFlow.agentPrompt}</p>
            </div>
            <p className="font-mono text-xs text-white/40">
              {dataFlow.summary.ok}/{dataFlow.summary.streams} OK
              {dataFlow.summary.synced > 0 ? ` · ${dataFlow.summary.synced} gesynced` : ""}
            </p>
          </div>
          {!dataFlow.healthy && (
            <ul className="mt-3 max-h-32 space-y-1 overflow-y-auto text-xs text-amber-200/80">
              {(dataFlow.streams || [])
                .filter((s) => s.status !== "ok")
                .slice(0, 10)
                .map((s) => (
                  <li key={s.id}>
                    {s.naam}: {s.detail}
                  </li>
                ))}
            </ul>
          )}
        </section>
      )}

      <section className="rounded-2xl border border-white/10 bg-black/20 p-5">
        <h2 className="text-lg font-semibold text-violet-200">Agent-team</h2>
        <p className="mt-1 text-sm text-white/55">
          Eén keten: <strong>npm run funnel</strong> (dataflow → leads → scan → outreach → manager). Zeg:{" "}
          <strong>manager check</strong>
        </p>
      </section>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {registry.map((a) => {
          const st = status?.agents?.[a.id];
          const ok = st?.ok !== false && st?.ok !== undefined ? st.ok : null;
          return (
            <div key={a.id} className="rounded-xl border border-white/10 bg-black/25 p-4">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    ok === null ? "bg-white/25" : ok ? "bg-emerald-400" : "bg-amber-400"
                  }`}
                />
                <p className="font-semibold text-white">{a.naam}</p>
                {a.taak && (
                  <span className="rounded bg-white/5 px-1.5 text-[10px] uppercase text-white/35">{a.taak}</span>
                )}
              </div>
              <p className="mt-1 text-sm text-white/50">{a.rol}</p>
              <p className="mt-2 font-mono text-xs text-emerald-300/80">{a.script}</p>
              {st?.agentPrompt && <p className="mt-2 text-xs text-white/40">{st.agentPrompt}</p>}
              <p className="mt-2 text-xs text-white/35">{a.trigger[0]}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
          <p className="text-xs uppercase text-white/40">Leads (OSM)</p>
          <p className="text-2xl font-bold text-emerald-300">{leads?.totaal ?? "—"}</p>
          <p className="text-xs text-white/45">Queue pending: {lh?.queuePending ?? "—"}</p>
        </div>
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
          <p className="text-xs uppercase text-white/40">Outreach vandaag</p>
          <p className="text-2xl font-bold text-amber-300">{or?.contactenVandaag ?? outreach?.vandaag?.length ?? "—"}</p>
          <p className="text-xs text-white/45">Lekken eerst: {or?.lekkenEerst ?? outreach?.samenvatting?.lekken ?? "—"}</p>
        </div>
        <div className="rounded-xl border border-sky-400/20 bg-sky-400/5 p-4">
          <p className="text-xs uppercase text-white/40">Laatste prompt</p>
          <p className="mt-1 text-sm text-sky-200">{or?.agentPrompt || lh?.agentPrompt || "Draai npm run funnel"}</p>
        </div>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Outreach — bel/WhatsApp vandaag</h2>
          <button type="button" onClick={() => void load()} className="text-sm text-emerald-400 hover:underline">
            Vernieuwen
          </button>
        </div>
        {!outreach?.vandaag?.length && (
          <p className="rounded-xl border border-dashed border-white/15 p-6 text-center text-white/45">
            Lijst leeg. Lokaal of in CI: <code className="text-white/60">npm run funnel</code>
          </p>
        )}
        <ul className="space-y-3">
          {(outreach?.vandaag || []).map((c, i) => (
            <li key={`${c.url}-${i}`} className="rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-rose-400/15 px-2 py-0.5 text-xs text-rose-200">P{c.prioriteit}</span>
                <span className="font-medium">{c.bedrijf}</span>
                {c.plaats && <span className="text-sm text-white/40">{c.plaats}</span>}
              </div>
              <p className="mt-1 text-sm text-white/55">{c.reden}</p>
              <p className="text-xs text-emerald-300/80">{c.actie}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {c.whatsappUrl ? (
                  <a
                    href={c.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-sm text-emerald-200"
                  >
                    WhatsApp openen →
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => copy(c.whatsapp, c.url)}
                    className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-sm text-emerald-200"
                  >
                    {copied === c.url ? "Gekopieerd ✓" : "WhatsApp tekst"}
                  </button>
                )}
                <Link href="/actie/" className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/70">
                  /actie/
                </Link>
                <a href={c.url} target="_blank" rel="noreferrer" className="text-sm text-white/40 hover:text-white">
                  site ↗
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-white/35">
        Skills: <code>manager-agent</code> · <code>lead-hunter</code> · <code>outreach-agent</code>
      </p>
    </div>
  );
}