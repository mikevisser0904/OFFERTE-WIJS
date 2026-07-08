import Link from "next/link";
import type { Metadata } from "next";
import { StorefrontShell } from "@/components/storefront-shell";
import { DienstCard } from "@/components/internet-diensten-grid";
import { betalingStandaard, dienstenByCategorie, webklaar } from "@/data/diensten-online";
import { actieQuickDiensten } from "@/data/dienst-meta";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Internetdiensten & prijzen — DoekoeWijs",
  description:
    "Online zichtbaarheid, websites, automatisering, AI en onderhoud. Vaste prijzen van €50 tot €899. Direct bestellen.",
  path: "/diensten",
  keywords: ["internetdiensten", "website prijs", "seo pakket", "google start", "ai snelstart"],
});

export default function DienstenPage() {
  const groups = dienstenByCategorie();

  return (
    <StorefrontShell>
      <div className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-3xl font-bold">Internetdiensten</h1>
        <p className="mt-3 max-w-2xl text-slate-600">{webklaar.sub}</p>
        <p className="mt-4 text-sm text-slate-500">
          Alles hieronder is een product dat we nu leveren — geen vrijblijvende &quot;offerte op maat&quot; zonder prijs.
        </p>
        <p className="mt-2 text-sm text-slate-600">{betalingStandaard}</p>

        <div className="mt-8 flex flex-wrap gap-2">
          {actieQuickDiensten()
            .slice(0, 6)
            .map(({ dienst }) => (
              <Link
                key={dienst.slug}
                href={`/diensten/${dienst.slug}/`}
                className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-800 hover:bg-emerald-100"
              >
                {dienst.naam} {dienst.prijs}
              </Link>
            ))}
        </div>

        {groups.map((g) => (
          <section key={g.categorie} id={g.categorie} className="scroll-mt-24 mt-14 first:mt-12">
            <h2 className="text-xl font-bold text-slate-900">{g.meta.label}</h2>
            <p className="mt-1 text-sm text-slate-500">{g.meta.sub}</p>
            <div className="mt-8 space-y-8">
              {g.items.map((d) => (
                <article
                  key={d.slug}
                  className="rounded-2xl border border-slate-100 p-8 hover:border-emerald-200"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold">{d.naam}</h3>
                      <p className="mt-1 text-sm text-slate-500">{d.voorWie}</p>
                    </div>
                    <p className="text-2xl font-bold text-emerald-600">{d.prijs}</p>
                  </div>
                  <p className="mt-4 text-slate-600">{d.beschrijving}</p>
                  <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">Levering: </span>
                    {d.levering}
                  </p>
                  <ul className="mt-4 grid gap-1 sm:grid-cols-2">
                    {d.bullets.map((b) => (
                      <li key={b} className="text-sm text-slate-600">
                        ✓ {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex gap-4">
                    <Link href={`/diensten/${d.slug}/`} className="text-sm font-medium text-emerald-600">
                      Details →
                    </Link>
                    <Link
                      href={`/bestellen/?dienst=${d.slug}`}
                      className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-bold text-white"
                    >
                      Bestellen
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </StorefrontShell>
  );
}