import Link from "next/link";
import { dienstenPerTier, tierLabels } from "@/data/dienst-meta";

const order = ["vandaag", "deze-week", "project"] as const;

export function HomeTempoTier() {
  const perTier = dienstenPerTier();

  return (
    <section className="border-y border-slate-100 bg-white px-6 py-14">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold text-slate-900">Kies je tempo</h2>
        <p className="mt-2 text-slate-600">
          Drie instapniveaus — allemaal vaste prijs. Geen offerte-zonder-bedrag.
        </p>
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {order.map((tier) => {
            const items = perTier[tier].filter((d) => d.slug !== "website-veilig").slice(0, 4);
            const { label, sub } = tierLabels[tier];
            return (
              <div
                key={tier}
                className="rounded-2xl border border-slate-100 p-6 hover:border-emerald-200"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">{label}</p>
                <p className="mt-1 text-sm text-slate-500">{sub}</p>
                <ul className="mt-5 space-y-3">
                  {items.map((d) => (
                    <li key={d.slug}>
                      <Link
                        href={`/diensten/${d.slug}/`}
                        className="font-semibold text-slate-900 hover:text-emerald-700"
                      >
                        {d.naam}{" "}
                        <span className="text-emerald-600">{d.prijs}</span>
                      </Link>
                      <p className="text-xs text-slate-500">{d.korteOms}</p>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <Link
          href="/diensten/"
          className="mt-8 inline-block text-sm font-semibold text-emerald-700 hover:underline"
        >
          Alle 12 diensten + doorlopend onderhoud →
        </Link>
      </div>
    </section>
  );
}