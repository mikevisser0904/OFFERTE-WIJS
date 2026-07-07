import { DashboardShell } from "@/components/dashboard-shell";
import { ActiePanel } from "@/components/actie-panel";
import { VandaagGeldPanel } from "@/components/vandaag-geld-panel";
import { Spoed50Panel } from "@/components/spoed-50-panel";
import Link from "next/link";

export default function ActiePage() {
  return (
    <DashboardShell
      active="/actie/"
      title="Vandaag geld"
      subtitle="5 WhatsApps · 1 gesprek · €299 Google Start is de snelste ja"
    >
      <div className="mx-auto max-w-3xl">
        <Spoed50Panel />
        <VandaagGeldPanel />

        <p className="mt-10 text-xs font-semibold uppercase tracking-widest text-white/35">Extra</p>
        <div className="mt-3">
          <ActiePanel />
        </div>

        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          <Link
            href="/demo/"
            className="rounded-xl border border-white/8 bg-white/[0.02] p-4 hover:border-emerald-400/30"
          >
            <p className="font-bold">Demo-site</p>
            <p className="mt-1 text-xs text-white/45">Wat klant krijgt</p>
          </Link>
          <Link
            href="/webklaar/"
            className="rounded-xl border border-white/8 bg-white/[0.02] p-4 hover:border-emerald-400/30"
          >
            <p className="font-bold">WebKlaar</p>
            <p className="mt-1 text-xs text-white/45">Verkooppagina</p>
          </Link>
          <Link
            href="/verkoop/"
            className="rounded-xl border border-white/8 bg-white/[0.02] p-4 hover:border-emerald-400/30"
          >
            <p className="font-bold">Verkoopkit</p>
            <p className="mt-1 text-xs text-white/45">Alle scripts</p>
          </Link>
        </section>
      </div>
    </DashboardShell>
  );
}