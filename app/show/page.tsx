import Link from "next/link";
import type { Metadata } from "next";
import { StorefrontShell } from "@/components/storefront-shell";
import { brand } from "@/data/brand";
import { webklaar, diensten } from "@/data/diensten-online";
import { seoLandingen } from "@/data/seo-landingen";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Zo werkt DoekoeWijs — demo in 2 minuten",
  description:
    "Laat zien wat Mike + Maarten (en AI) leveren: klantsite, webshop, SEO, vaste prijzen.",
  path: "/show",
  keywords: ["demo website", "DoekoeWijs", "vakman website"],
});

const highlights = [
  {
    titel: "Klantsite (voorbeeld)",
    sub: "Zo ziet een vakman-site eruit na levering",
    href: "/demo/",
    cta: "Open demo",
  },
  {
    titel: "Webshop + vaste prijs",
    sub: "Google Start €299 · Vakman-site €899 · direct bestellen",
    href: "/bestellen/",
    cta: "Bestelflow",
  },
  {
    titel: "SEO op schaal",
    sub: `${seoLandingen.length} landingspagina's live (cron + pool)`,
    href: "/land/",
    cta: "Landings",
  },
  {
    titel: "Verkoop achterkant",
    sub: "Werkblad, actie, listings — copy-paste WhatsApp & Marktplaats",
    href: "/dashboard/",
    cta: "Werkblad",
  },
] as const;

export default function ShowPage() {
  const top = diensten.filter((d) => d.categorie === "website").slice(0, 3);

  return (
    <StorefrontShell>
      <section className="bg-gradient-to-b from-emerald-50 to-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">2-minuten rondleiding</p>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            Dit is wat {brand.name} kan
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            {brand.mottoPublic} — gebouwd met Next.js, static export op GitHub Pages, agents op de achtergrond.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-12">
        <div className="grid gap-4 sm:grid-cols-2">
          {highlights.map((h) => (
            <Link
              key={h.href}
              href={h.href}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
            >
              <p className="font-bold text-slate-900">{h.titel}</p>
              <p className="mt-2 text-sm text-slate-600">{h.sub}</p>
              <p className="mt-4 text-sm font-semibold text-emerald-600">{h.cta} →</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Pakketten</p>
          <ul className="mt-4 space-y-3">
            {top.map((d) => (
              <li key={d.slug} className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <span className="font-medium text-slate-800">{d.naam}</span>
                <span className="font-mono font-bold text-emerald-700">
                  {d.prijs} · {d.levertijd}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/start/"
            className="mt-6 inline-flex rounded-full bg-amber-600 px-6 py-3 text-sm font-bold text-white hover:bg-amber-500"
          >
            Snelste start: Google Start €299 →
          </Link>
        </div>

        <p className="mt-10 text-center text-sm text-slate-500">
          Vragen?{" "}
          <a
            href={`https://wa.me/${webklaar.whatsapp}?text=${encodeURIComponent("Ik heb de show-pagina bekeken — even sparren?")}`}
            className="font-semibold text-emerald-600 hover:underline"
          >
            WhatsApp Mike
          </a>
        </p>
      </section>
    </StorefrontShell>
  );
}