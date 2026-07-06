import { DashboardShell } from "@/components/dashboard-shell";
import { ActiePanel } from "@/components/actie-panel";
import Link from "next/link";

export default function ActiePage() {
  return (
    <DashboardShell
      active="/actie/"
      title="Actie"
      subtitle="Plak nummers → klik Verstuur. Dat is alles."
    >
      <div className="mx-auto max-w-3xl">
        <ActiePanel />

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