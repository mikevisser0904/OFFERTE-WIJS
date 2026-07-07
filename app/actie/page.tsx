import { DashboardShell } from "@/components/dashboard-shell";
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
      <div className="mx-auto max-w-3xl space-y-10">
        <Spoed50Panel />
        <VandaagGeldPanel />

        <section className="rounded-xl border border-white/8 p-5 text-sm text-white/55">
          <p className="font-bold text-white/80">Meer copy</p>
          <p className="mt-2">
            Alle scripts en bezwaren:{" "}
            <Link href="/verkoop/" className="text-emerald-300 hover:underline">
              Verkoopkit →
            </Link>
            {" · "}
            <Link href="/listings/" className="text-violet-300 hover:underline">
              Fiverr + Marktplaats →
            </Link>
          </p>
        </section>
      </div>
    </DashboardShell>
  );
}