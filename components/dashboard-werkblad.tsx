"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SITE_URL } from "@/lib/seo";
import { dashboardQuickLinks, defaultMikeActie } from "@/data/dashboard-nav";

type ManagerStatus = {
  mikeActie?: string;
  faseLabel?: string;
  updatedAt?: string;
};

const accentClass = {
  amber: "border-amber-400/30 bg-amber-400/10 hover:border-amber-400/50",
  emerald: "border-emerald-400/30 bg-emerald-400/10 hover:border-emerald-400/50",
  violet: "border-violet-400/30 bg-violet-400/10 hover:border-violet-400/50",
  sky: "border-sky-400/30 bg-sky-400/10 hover:border-sky-400/50",
};

export function DashboardWerkblad() {
  const [manager, setManager] = useState<ManagerStatus | null>(null);

  useEffect(() => {
    fetch(`${SITE_URL}/manager-status.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setManager)
      .catch(() => setManager(null));
  }, []);

  const mikeActie = manager?.mikeActie?.includes("bewijs")
    ? defaultMikeActie
    : manager?.mikeActie || defaultMikeActie;

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-emerald-400/35 bg-gradient-to-br from-emerald-500/15 to-transparent p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Jouw stap</p>
        <p className="mt-3 text-lg font-semibold leading-snug text-white">{mikeActie}</p>
        {manager?.faseLabel && (
          <p className="mt-2 text-xs text-white/40">Agent: {manager.faseLabel}</p>
        )}
        <Link
          href="/actie/"
          className="mt-5 inline-flex rounded-full bg-emerald-400 px-6 py-2.5 text-sm font-bold text-slate-900 hover:bg-emerald-300"
        >
          Naar actie →
        </Link>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/35">Snel naar</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {dashboardQuickLinks.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className={`rounded-xl border p-4 transition ${accentClass[q.accent]}`}
            >
              <p className="font-bold">{q.label}</p>
              <p className="mt-1 text-xs text-white/50">{q.sub}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}