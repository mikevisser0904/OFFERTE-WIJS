import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";

export default function ConfiguratorPage() {
  return (
    <DashboardShell
      active="/configurator/"
      title="Configurator"
      subtitle="MVP offerte-flow — bouwsteen voor OfferteWijs pilot"
    >
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-8 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-amber-400">
            Fase 4 · pas na eerste cash
          </p>
          <h2 className="mt-3 text-2xl font-bold">Offerte configurator</h2>
          <p className="mt-4 text-white/55">
            Hier komt de offerte-flow — hergebruik logica uit ZonComfort.
          </p>

          <ol className="mx-auto mt-8 max-w-sm space-y-3 text-left text-sm text-white/60">
            <li className="flex gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3">
              <span className="font-mono text-amber-400">1</span>
              Bedrijfsgegevens
            </li>
            <li className="flex gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3">
              <span className="font-mono text-amber-400">2</span>
              Product + maten
            </li>
            <li className="flex gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3">
              <span className="font-mono text-amber-400">3</span>
              Prijs + PDF
            </li>
          </ol>

          <div className="mt-8 rounded-xl border border-amber-400/20 bg-amber-400/5 p-5 text-left text-sm text-amber-200/80">
            <p className="font-semibold text-amber-300">Volgende stap</p>
            <p className="mt-2">
              Kopieer <code className="rounded bg-black/30 px-1">lib/pricing.ts</code> en{" "}
              <code className="rounded bg-black/30 px-1">data/products.ts</code> uit
              MIKE-AND-MAARTEN en pas aan.
            </p>
          </div>

          <Link
            href="/"
            className="mt-8 inline-flex rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white/80 hover:bg-white/5"
          >
            ← Dashboard
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}