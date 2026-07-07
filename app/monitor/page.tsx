import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { MonitorPanel } from "@/components/monitor-panel";
import { integrations } from "@/data/integrations";
import { monitorUitleg } from "@/data/monitoring";

export default function MonitorPage() {
  return (
    <DashboardShell
      active="/monitor/"
      title={monitorUitleg.titel}
      subtitle="KPI + Search Console — verkoopactie blijft op /actie/"
    >
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/actie/"
            className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-bold text-slate-900"
          >
            Actie →
          </Link>
          <a
            href={integrations.googleSearchConsole.urls.welcome}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-sky-400/40 px-5 py-2 text-sm text-sky-200"
          >
            Search Console ↗
          </a>
        </div>

        <MonitorPanel />

        <section className="rounded-xl border border-sky-400/25 bg-sky-400/5 p-5 text-sm text-white/60">
          <p className="font-bold text-sky-200">GSC — eenmalig</p>
          <ol className="mt-3 list-decimal space-y-1 pl-5">
            {integrations.googleSearchConsole.stappen.slice(0, 4).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-white/40">
            Sitemap:{" "}
            <code className="text-white/55">{integrations.googleSearchConsole.sitemap}</code>
          </p>
        </section>
      </div>
    </DashboardShell>
  );
}