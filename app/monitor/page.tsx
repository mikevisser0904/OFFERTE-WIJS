import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { MaartenWachtrijPanel } from "@/components/maarten-wachtrij-panel";
import { MonitorPanel } from "@/components/monitor-panel";
import { VerkoopEffectiviteitPanel } from "@/components/verkoop-effectiviteit-panel";
import { OutboundStatusPanel } from "@/components/outbound-status-panel";
import { IntegrationsPanel } from "@/components/integrations-panel";
import { monitorUitleg } from "@/data/monitoring";

export default function MonitorPage() {
  return (
    <DashboardShell
      active="/monitor/"
      title={monitorUitleg.titel}
      subtitle={monitorUitleg.sub}
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap gap-3">
          <Link
            href="/actie/"
            className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-bold text-slate-900"
          >
            Actie → contacten
          </Link>
          <Link
            href="/bestellen/"
            className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/80"
          >
            Bestelformulier
          </Link>
          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/80"
          >
            Google Search Console ↗
          </a>
        </div>
        <div className="mb-10">
          <MaartenWachtrijPanel />
        </div>
        <IntegrationsPanel />
        <div className="mt-10">
          <VerkoopEffectiviteitPanel />
        </div>
        <div className="mt-10">
          <OutboundStatusPanel />
        </div>
        <div className="mt-10">
          <MonitorPanel />
        </div>
      </div>
    </DashboardShell>
  );
}