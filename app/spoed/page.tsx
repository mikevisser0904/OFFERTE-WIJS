import type { Metadata } from "next";
import Link from "next/link";
import { StorefrontShell } from "@/components/storefront-shell";
import { pageMetadata } from "@/lib/seo";
import {
  spoed50,
  spoed50Niet,
  spoed50Scope,
  spoed50WaMe,
  whatsappSpoed50,
} from "@/data/spoed-50";
import { webklaar } from "@/data/diensten-online";

export const metadata: Metadata = pageMetadata({
  title: "Spoed hulp €50 — 1 uur vandaag",
  description:
    "Digitale spoedhulp €50 vast: PC, mail, website-fix, Google of Excel. Vandaag, 1 uur. Tikkie en start.",
  path: "/spoed",
  keywords: ["spoed computer hulp", "pc hulp vandaag", "website spoed fix"],
});

export default function SpoedPage() {
  return (
    <StorefrontShell>
      <section className="bg-gradient-to-b from-amber-500 to-amber-600 px-6 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-amber-100">Vandaag</p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            {spoed50.titel} — {spoed50.prijsLabel}
          </h1>
          <p className="mt-4 text-lg text-amber-50">
            {spoed50.duur} vast. Eén probleem. Geen verrassingen.
          </p>
          <a
            href={spoed50WaMe()}
            className="mt-8 inline-flex rounded-full bg-white px-8 py-4 text-base font-bold text-amber-800 hover:bg-amber-50"
          >
            WhatsApp: SPOED →
          </a>
          <p className="mt-4 text-sm text-amber-100">
            Stuur &quot;SPOED&quot; + je probleem. Tikkie {spoed50.prijsLabel} → ik start.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-12">
        <h2 className="text-xl font-bold">Past in 1 uur</h2>
        <ul className="mt-4 space-y-2 text-slate-700">
          {spoed50Scope.map((s) => (
            <li key={s} className="flex gap-2">
              <span className="text-emerald-600">✓</span>
              {s}
            </li>
          ))}
        </ul>
        <h2 className="mt-10 text-xl font-bold">Niet in dit pakket</h2>
        <ul className="mt-4 space-y-1 text-sm text-slate-500">
          {spoed50Niet.map((s) => (
            <li key={s}>· {s}</li>
          ))}
        </ul>

        <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
          <p className="font-bold text-slate-900">Zo werkt het</p>
          <ol className="mt-4 space-y-2 text-left text-sm text-slate-600">
            <li>1. App met SPOED + kort probleem</li>
            <li>2. Tikkie €50 (of contant bij start)</li>
            <li>3. Binnen 1 uur klaar (remote of op locatie)</li>
          </ol>
          <a
            href={spoed50WaMe(whatsappSpoed50)}
            className="mt-6 inline-flex rounded-full bg-emerald-600 px-6 py-3 font-bold text-white"
          >
            {webklaar.telefoonDisplay} →
          </a>
        </div>

        <div className="mt-10 rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Na de spoed — structureel</p>
          <p className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2">
            <Link href="/start/" className="font-medium text-emerald-700 hover:underline">
              Google Start €299
            </Link>
            <Link href="/diensten/seo-starter/" className="font-medium text-emerald-700 hover:underline">
              SEO €199
            </Link>
            <Link href="/diensten/" className="font-medium text-emerald-700 hover:underline">
              Alle diensten
            </Link>
          </p>
        </div>
      </section>
    </StorefrontShell>
  );
}