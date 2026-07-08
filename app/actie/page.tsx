import { DashboardShell } from "@/components/dashboard-shell";
import { ActieDienstenQuick } from "@/components/actie-diensten-quick";
import { VandaagGeldPanel } from "@/components/vandaag-geld-panel";
import { Spoed50Panel } from "@/components/spoed-50-panel";
import { actieSamenvatting } from "@/data/vandaag-geld";
import Link from "next/link";

export default function ActiePage() {
  return (
    <DashboardShell
      active="/actie/"
      title="Vandaag geld"
      subtitle="5 WhatsApps · internetdiensten · Spoed €50 t/m site €899"
    >
      <div className="mx-auto max-w-3xl space-y-10">
        <ActieDienstenQuick />
        <Spoed50Panel />
        <VandaagGeldPanel />

        <section className="rounded-xl border border-white/8 p-5 text-sm text-white/55">
          <p className="font-bold text-white/80">Meer copy</p>
          <p className="mt-2">{actieSamenvatting}</p>
          <p className="mt-3">
            <Link href="/verkoop/" className="text-emerald-300 hover:underline">
              Verkoopkit →
            </Link>
            {" · "}
            <Link href="/listings/" className="text-violet-300 hover:underline">
              Listings copy →
            </Link>
            {" · "}
            <Link href="/diensten/" className="text-sky-300 hover:underline">
              Diensten live →
            </Link>
          </p>
        </section>
      </div>
    </DashboardShell>
  );
}