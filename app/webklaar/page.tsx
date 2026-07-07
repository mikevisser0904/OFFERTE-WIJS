import Link from "next/link";
import type { Metadata } from "next";
import { StorefrontShell } from "@/components/storefront-shell";
import { diensten, webklaar } from "@/data/diensten-online";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "DoekoeWijs — Mike & Maarten",
  description:
    "DoekoeWijs bouwt websites en digitaal voor vakmannen. Vaste prijs, GitHub Pages demo, online bestellen.",
  path: "/webklaar",
});

export default function DoekoeWijsPage() {
  return (
    <StorefrontShell>
      <section className="bg-gradient-to-b from-emerald-50 to-white px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-slate-900">{webklaar.naam}</h1>
          <p className="mt-4 text-lg text-slate-600">{webklaar.tagline}</p>
          <p className="mt-2 text-slate-500">{webklaar.sub}</p>
          <p className="mt-6 text-sm text-slate-500">
            Mike Visser + Maarten — verkopen en bouwen, vaste prijzen, live in dagen.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/demo/"
              className="rounded-full bg-emerald-600 px-8 py-3 font-bold text-white hover:bg-emerald-500"
            >
              Demo-site →
            </Link>
            <Link
              href="/start/"
              className="rounded-full border border-emerald-300 px-8 py-3 font-semibold text-emerald-800 hover:bg-emerald-50"
            >
              Google Start €299
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-14">
        <h2 className="text-xl font-bold">Pakketten</h2>
        <ul className="mt-6 space-y-4">
          {diensten.slice(0, 5).map((d) => (
            <li key={d.slug} className="rounded-xl border border-slate-100 p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-bold">{d.naam}</span>
                <span className="font-mono text-emerald-600">{d.prijs}</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{d.korteOms}</p>
              <Link
                href={`/diensten/${d.slug}/`}
                className="mt-2 inline-block text-sm font-medium text-emerald-600 hover:underline"
              >
                Meer info →
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-sm text-slate-400">
          Team-dashboard (intern):{" "}
          <Link href="/dashboard/" className="text-emerald-600 hover:underline">
            /dashboard/
          </Link>
        </p>
      </section>
    </StorefrontShell>
  );
}