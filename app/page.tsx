import Link from "next/link";
import type { Metadata } from "next";
import { StorefrontShell } from "@/components/storefront-shell";
import { SeoJsonLd } from "@/components/seo-json-ld";
import { FaqSchema } from "@/components/faq-schema";
import { HomeHeroProducten } from "@/components/home-hero-producten";
import { HomeTempoTier } from "@/components/home-tempo-tier";
import { DienstCard } from "@/components/internet-diensten-grid";
import { betalingStandaard, categorieMeta, dienstenByCategorie, webklaar } from "@/data/diensten-online";
import { seoLandingen } from "@/data/seo-landingen";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "DoekoeWijs — Internetdiensten | Websites, SEO, AI",
  description:
    "Internetdiensten voor zzp en mkb: Google Start €299, SEO Starter €199, websites, Excel, AI. Vaste prijs, online bestellen.",
  path: "/",
  keywords: [
    "internetdiensten zzp",
    "website laten maken",
    "seo starter",
    "google business",
    "excel automatisering",
  ],
});

const topPerCategorie = dienstenByCategorie()
  .map((g) => ({
    ...g,
    items: g.items.filter((d) => d.populair).length
      ? g.items.filter((d) => d.populair)
      : g.items.slice(0, 2),
  }))
  .filter((g) => g.items.length > 0);

export default function StoreHomePage() {
  return (
    <StorefrontShell>
      <SeoJsonLd />

      <section className="bg-gradient-to-b from-emerald-50 to-white px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
            Internetdiensten · online bestellen
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {webklaar.tagline.split("—")[0].trim()}
            <br />
            <span className="text-emerald-600">vaste prijs, snel live.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600">
            Drie vaste pakketten voor zzp en mkb — kies wat bij je situatie past. Geen bureau-offerte zonder prijs.
          </p>
          <HomeHeroProducten />
          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
            {webklaar.usps.map((u) => (
              <span key={u}>✓ {u}</span>
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-slate-500">
            Vandaag vast?{" "}
            <Link href="/spoed/" className="font-semibold text-amber-700 hover:underline">
              Spoed hulp €50
            </Link>
            {" · "}
            <Link href="/diensten/listings-setup/" className="font-semibold text-emerald-700 hover:underline">
              Listings €149
            </Link>
          </p>
        </div>
      </section>

      <HomeTempoTier />

      <section className="border-b border-slate-100 bg-slate-50/50 px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-4 sm:gap-8">
          {(Object.keys(categorieMeta) as (keyof typeof categorieMeta)[])
            .sort((a, b) => categorieMeta[a].volgorde - categorieMeta[b].volgorde)
            .map((key) => (
              <Link
                key={key}
                href={`/diensten/#${key}`}
                className="rounded-xl border border-slate-100 px-4 py-3 text-center transition hover:border-emerald-200 hover:bg-emerald-50/50"
              >
                <p className="text-sm font-bold text-slate-800">{categorieMeta[key].label}</p>
                <p className="mt-0.5 text-xs text-slate-500">{categorieMeta[key].sub}</p>
              </Link>
            ))}
        </div>
      </section>

      {topPerCategorie.map((g) => (
        <section key={g.categorie} className="mx-auto max-w-5xl px-6 pb-12">
          <h3 className="text-lg font-bold text-slate-800">{g.meta.label}</h3>
          <p className="text-sm text-slate-500">{g.meta.sub}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {g.items.map((d) => (
              <DienstCard key={d.slug} d={d} compact />
            ))}
          </div>
        </section>
      ))}

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-xl font-bold text-slate-900">SEO & regio (live)</h2>
        <p className="mt-2 text-sm text-slate-500">
          {seoLandingen.length} landingspagina&apos;s — hetzelfde type levering als SEO Starter
        </p>
        <ul className="mt-6 columns-1 gap-x-8 text-sm sm:columns-2 lg:columns-3">
          {seoLandingen.slice(0, 9).map((l) => (
            <li key={l.slug} className="mb-2">
              <Link href={`/land/${l.slug}/`} className="text-emerald-600 hover:underline">
                {l.h1}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/land/" className="mt-6 inline-block text-sm font-semibold text-emerald-700 hover:underline">
          Alle regio&apos;s →
        </Link>
      </section>

      <FaqSchema />

      <section className="bg-slate-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-2xl font-bold">Zo werkt bestellen</h2>
          <ol className="mx-auto mt-10 grid max-w-3xl gap-8 text-left sm:grid-cols-3">
            {[
              { stap: "1", tekst: "Kies dienst + formulier (WhatsApp/mail)" },
              { stap: "2", tekst: betalingStandaard },
              { stap: "3", tekst: "Levering binnen de afgesproken dagen op de productpagina" },
            ].map((s) => (
              <li key={s.stap}>
                <span className="text-3xl font-bold text-emerald-400">{s.stap}</span>
                <p className="mt-2 text-sm text-slate-300">{s.tekst}</p>
              </li>
            ))}
          </ol>
          <Link
            href="/bestellen/"
            className="mt-10 inline-flex rounded-full bg-emerald-500 px-8 py-3 font-bold text-white hover:bg-emerald-400"
          >
            Naar bestelformulier
          </Link>
        </div>
      </section>
    </StorefrontShell>
  );
}