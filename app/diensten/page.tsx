import Link from "next/link";
import type { Metadata } from "next";
import { StorefrontShell } from "@/components/storefront-shell";
import { diensten, webklaar } from "@/data/diensten-online";

export const metadata: Metadata = {
  title: "Diensten — WebKlaar",
  description:
    "Website vakman €899, Google Start €299, digitale opruiming, Excel automatisering, AI snelstart. Online bestellen.",
};

export default function DienstenPage() {
  return (
    <StorefrontShell>
      <div className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-3xl font-bold">Alle diensten</h1>
        <p className="mt-3 text-slate-600">{webklaar.sub}</p>

        <div className="mt-12 space-y-8">
          {diensten.map((d) => (
            <article
              key={d.slug}
              className="rounded-2xl border border-slate-100 p-8 hover:border-teal-200"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">{d.naam}</h2>
                  <p className="mt-1 text-sm text-slate-500">{d.voorWie}</p>
                </div>
                <p className="text-2xl font-bold text-teal-600">{d.prijs}</p>
              </div>
              <p className="mt-4 text-slate-600">{d.beschrijving}</p>
              <ul className="mt-4 grid gap-1 sm:grid-cols-2">
                {d.bullets.map((b) => (
                  <li key={b} className="text-sm text-slate-600">
                    ✓ {b}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex gap-4">
                <Link
                  href={`/diensten/${d.slug}/`}
                  className="text-sm font-medium text-teal-600"
                >
                  Details →
                </Link>
                <Link
                  href={`/bestellen/?dienst=${d.slug}`}
                  className="rounded-full bg-teal-600 px-5 py-2 text-sm font-bold text-white"
                >
                  Bestellen
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </StorefrontShell>
  );
}