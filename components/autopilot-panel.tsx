"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SITE_URL } from "@/lib/seo";

type AutopilotStatus = {
  updatedAt: string | null;
  healthy: boolean;
  pendingMaarten: number;
  nextAgentPrompt: string;
  eerstePending?: { id: string; tekst: string; euro?: string } | null;
  avgResponseMs?: number | null;
};

export function AutopilotPanel() {
  const [status, setStatus] = useState<AutopilotStatus | null>(null);

  useEffect(() => {
    fetch(`${SITE_URL}/autopilot-status.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setStatus)
      .catch(() => setStatus(null));
  }, []);

  if (!status) {
    return (
      <section className="rounded-2xl border border-violet-400/25 bg-violet-400/5 p-6">
        <p className="text-sm text-white/50">Autopilot-status laden…</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-violet-400/30 bg-violet-400/[0.08] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-300">
            Autopilot · elke 4 uur
          </p>
          <h2 className="mt-2 text-lg font-bold">Autopilot</h2>
          <p className="mt-1 text-sm text-white/55">Health · sync · ntfy (elke 4u)</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            status.healthy ? "bg-emerald-400/20 text-emerald-300" : "bg-rose-400/20 text-rose-300"
          }`}
        >
          {status.healthy ? "Site online" : "Site probleem"}
        </span>
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-lg border border-white/8 bg-black/20 px-3 py-2">
          <dt className="text-white/40">Laatste run</dt>
          <dd className="font-mono text-xs text-white/80">
            {status.updatedAt
              ? new Date(status.updatedAt).toLocaleString("nl-NL")
              : "Nog niet gedraaid"}
          </dd>
        </div>
        <div className="rounded-lg border border-white/8 bg-black/20 px-3 py-2">
          <dt className="text-white/40">Pending ideeën (agent)</dt>
          <dd className="text-lg font-bold text-amber-300">{status.pendingMaarten}</dd>
        </div>
      </dl>

      <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3">
        <p className="text-xs text-white/45">Grok/Cursor zeg:</p>
        <p className="mt-1 font-mono text-sm text-amber-200">{status.nextAgentPrompt}</p>
        {status.eerstePending && (
          <p className="mt-2 text-xs text-white/50">
            {status.eerstePending.euro ? `${status.eerstePending.euro} — ` : ""}
            {status.eerstePending.tekst}
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href="/monitor/"
          className="rounded-full bg-violet-400 px-4 py-2 text-xs font-bold text-slate-900"
        >
          Monitor
        </Link>
        <Link
          href="/ideeen/"
          className="rounded-full border border-white/15 px-4 py-2 text-xs text-white/80"
        >
          Ideeën / wachtrij
        </Link>
        <a
          href="https://github.com/mikevisser0904/OFFERTE-WIJS/actions/workflows/autopilot.yml"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-white/15 px-4 py-2 text-xs text-white/80"
        >
          GitHub Actions ↗
        </a>
      </div>
    </section>
  );
}