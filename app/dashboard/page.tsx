import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { AutopilotPanel } from "@/components/autopilot-panel";
import { DashboardVandaag } from "@/components/dashboard-vandaag";
import { DashboardWerkblad } from "@/components/dashboard-werkblad";
import { hoofddoel } from "@/data/doel";
import { seoLandingen } from "@/data/seo-landingen";

export default function DashboardPage() {
  return (
    <DashboardShell
      active="/dashboard/"
      title="Werkblad"
      subtitle={`${hoofddoel.label} · actie eerst`}
    >
      <div className="mx-auto max-w-4xl space-y-8">
        <DashboardWerkblad />
        <DashboardVandaag />

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
            <p className="text-xs text-white/40">SEO live</p>
            <p className="mt-1 text-2xl font-bold text-emerald-300">{seoLandingen.length}</p>
            <p className="text-sm text-white/50">landingspagina&apos;s</p>
            <Link href="/land/" className="mt-3 inline-block text-xs text-emerald-400 hover:underline">
              Overzicht →
            </Link>
          </div>
          <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
            <p className="text-xs text-white/40">Achtergrond</p>
            <p className="mt-1 text-sm text-white/70">Traffic · Autopilot · VakScan via Tools</p>
            <Link href="/tools/" className="mt-3 inline-block text-xs text-sky-300 hover:underline">
              Tools →
            </Link>
          </div>
        </section>

        <AutopilotPanel />
      </div>
    </DashboardShell>
  );
}