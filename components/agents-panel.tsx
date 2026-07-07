"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  agentsRegistryUrl,
  agentsStatusUrl,
  outreachVandaagUrl,
  potentieleKlantenUrl,
  type AgentRegistryEntry,
  type OutreachVandaag,
} from "@/lib/agents";

type AgentsStatus = {
  updatedAt?: string;
  agents?: Record<
    string,
    {
      lastRun?: string;
      agentPrompt?: string;
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
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [reg, st, out, ld] = await Promise.all([
      fetch(agentsRegistryUrl()).then((r) => (r.ok ? r.json() : { agents: [] })),
      fetch(agentsStatusUrl()).then((r) => (r.ok ? r.json() : null)),
      fetch(outreachVandaagUrl()).then((r) => (r.ok ? r.json() : null)),
      fetch(potentieleKlantenUrl()).then((r) => (r.ok ? r.json() : null)),
    ]);
    setRegistry(reg.agents || []);
    setStatus(st);
    setOutreach(out);
    setLeads(ld);
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

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-violet-400/25 bg-violet-500/10 p-5">
        <h2 className="text-lg font-semibold text-violet-200">Agent-team</h2>
        <p className="mt-1 text-sm text-white/55">
          <strong className="text-white">Lead Hunter</strong> vindt klanten → <strong className="text-white">VakScan</strong>{" "}
          scant → <strong className="text-white">Outreach</strong> zegt wie Mike belt. Jij opent Grok en zegt de trigger.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-black/40 p-3 text-xs text-emerald-200/90">
          npm run agent:pipeline
        </pre>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {registry.map((a) => (
          <div key={a.id} className="rounded-xl border border-white/10 bg-black/25 p-4">
            <p className="font-semibold text-white">{a.naam}</p>
            <p className="mt-1 text-sm text-white/50">{a.rol}</p>
            <p className="mt-2 font-mono text-xs text-emerald-300/80">{a.script}</p>
            <p className="mt-2 text-xs text-white/35">Zeg tegen Grok: {a.trigger.slice(0, 3).join(" · ")}</p>
          </div>
        ))}
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
          <p className="mt-1 text-sm text-sky-200">{or?.agentPrompt || lh?.agentPrompt || "Draai agent:pipeline"}</p>
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
            Lijst leeg. Lokaal of in CI: <code className="text-white/60">npm run agent:pipeline</code>
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
                <button
                  type="button"
                  onClick={() => copy(c.whatsapp, c.url)}
                  className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-sm text-emerald-200"
                >
                  {copied === c.url ? "Gekopieerd ✓" : "WhatsApp"}
                </button>
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
        Skills: <code>.grok/skills/lead-hunter</code> · <code>.grok/skills/outreach-agent</code>
      </p>
    </div>
  );
}