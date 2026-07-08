import Link from "next/link";
import type { Metadata } from "next";
import { StorefrontShell } from "@/components/storefront-shell";
import { betalingStandaard, categorieMeta, dienstenByCategorie, webklaar } from "@/data/diensten-online";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Over DoekoeWijs — Mike & Maarten",
  description:
    "Internetdiensten voor zzp en mkb: SEO, Google, websites, automatisering. Vaste prijs, online bestellen.",
  path: "/webklaar",
});

export default function DoekoeWijsPage() {
  const groups = dienstenByCategorie();

  return (
    <StorefrontShell>
      <section className="bg-gradient-to-b from-emerald-50 to-white px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-slate-900">{webklaar.naam}</h1>
          <p className="mt-4 text-lg text-slate-600">{webklaar.tagline}</p>
          <p className="mt-2 text-slate-500">{webklaar.sub}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/diensten/" className="rounded-full bg-emerald-600 px-8 py-3 font-bold text-white hover:bg-emerald-500">
              Alle diensten →
            </Link>
            <Link href="/show/" className="rounded-full border border-emerald-300 px-8 py-3 font-semibold text-emerald-800 hover:bg-emerald-50">
              2-min show
            </Link>
            <Link href="/demo/" className="rounded-full border border-slate-200 px-8 py-3 font-semibold text-slate-700 hover:bg-slate-50">
              Vakman-demo
            </Link>
          </div>
          <ul className="mx-auto mt-10 flex max-w-xl flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-600">
            {webklaar.usps.map((u) => (
              <li key={u}>✓ {u}</li>
            ))}
          </ul>
          <p className="mx-auto mt-6 max-w-lg text-sm text-slate-500">{betalingStandaard}</p>
        </div>
      </section>

      {groups.map((g) => (
        <section key={g.categorie} className="mx-auto max-w-3xl px-6 py-10">
          <h2 className="text-lg font-bold">{g.meta.label}</h2>
          <p className="text-sm text-slate-500">{g.meta.sub}</p>
          <ul className="mt-4 space-y-3">
            {g.items.map((d) => (
              <li key={d.slug} className="rounded-xl border border-slate-100 p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-bold">{d.naam}</span>
                  <span className="font-mono text-emerald-600">{d.prijs}</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{d.korteOms}</p>
                <Link href={`/bestellen/?dienst=${d.slug}`} className="mt-2 inline-block text-sm font-medium text-emerald-600 hover:underline">
                  Bestellen →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="pb-14 text-center text-sm text-slate-400">
        Team:{" "}
        <Link href="/dashboard/" className="text-emerald-600 hover:underline">
          /dashboard/
        </Link>
        {" · "}
        {categorieMeta.zichtbaarheid.label} t/m {categorieMeta.abonnement.label}
      </p>
    </StorefrontShell>
  );
}