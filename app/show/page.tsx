import Link from "next/link";
import type { Metadata } from "next";
import { StorefrontShell } from "@/components/storefront-shell";
import { brand } from "@/data/brand";
import { demo } from "@/data/demo-site";
import { webklaar, diensten } from "@/data/diensten-online";
import { seoLandingen } from "@/data/seo-landingen";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Zo werkt DoekoeWijs — demo in 2 minuten",
  description:
    "Rondleiding: nieuwe vakman-demo (De Zonmeester), webshop, SEO en werkblad. Vaste prijzen, live op GitHub Pages.",
  path: "/show",
  keywords: ["demo website", "DoekoeWijs", "vakman website", "voorbeeld zonwering"],
});

const demoFeatures = [
  "Hero + diensten met prijzen en WhatsApp-offerte",
  "Zo werkt het (3 stappen), over ons en werkgebied",
  "Reviews, FAQ en mobiele sticky CTA",
  "LocalBusiness schema (Google-ready)",
] as const;

const tourStappen = [
  { nr: "1", label: "Open de klant-demo", href: "/demo/", accent: true },
  { nr: "2", label: "Scroll diensten, FAQ, WhatsApp-knop", href: "/demo/#diensten", accent: false },
  { nr: "3", label: "Terug: bestellen of Google Start €299", href: "/start/", accent: false },
] as const;

const highlights = [
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
      <section className="bg-gradient-to-b from-emerald-50 to-white px-6 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">2-minuten rondleiding</p>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">Dit is wat {brand.name} kan</h1>
          <p className="mt-4 text-lg text-slate-600">{brand.mottoPublic}</p>
          <Link
            href="/demo/"
            className="mt-8 inline-flex rounded-full bg-emerald-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500"
          >
            Start bij de demo: {demo.bedrijf} →
          </Link>
        </div>
      </section>

      {/* Demo spotlight */}
      <section className="mx-auto max-w-5xl px-6 pb-10">
        <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-lg">
          <div
            className="px-6 py-10 text-white sm:px-10 sm:py-12"
            style={{
              background: `linear-gradient(135deg, ${demo.kleur} 0%, ${demo.kleurDonker} 100%)`,
            }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-white/70">Nieuwe klant-demo</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">{demo.bedrijf}</h2>
            <p className="mt-2 text-white/90">{demo.tagline} · {demo.regio}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {demo.stats.map((s) => (
                <span key={s.label} className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold">
                  {s.value} {s.label}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 sm:p-8">
            <p className="text-sm font-semibold text-slate-900">Wat er in de demo zit</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {demoFeatures.map((f) => (
                <li key={f} className="flex gap-2 text-sm text-slate-600">
                  <span className="text-emerald-600">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/demo/"
                className="rounded-full px-6 py-2.5 text-sm font-bold text-white"
                style={{ backgroundColor: demo.kleur }}
              >
                Volledige demo openen →
              </Link>
              <Link
                href="/demo/#faq"
                className="rounded-full border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Direct naar FAQ
              </Link>
            </div>
          </div>
        </div>

        <ol className="mt-10 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Zo laat je het zien</p>
          {tourStappen.map((s) => (
            <li key={s.nr}>
              <Link
                href={s.href}
                className={`flex items-center gap-4 rounded-xl border p-4 transition ${
                  s.accent
                    ? "border-emerald-200 bg-emerald-50/80 hover:border-emerald-300"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    s.accent ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {s.nr}
                </span>
                <span className="font-medium text-slate-800">{s.label}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-12">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Ook live</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
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
            href={`https://wa.me/${webklaar.whatsapp}?text=${encodeURIComponent(
              `Ik heb /show/ en de demo van ${demo.bedrijf} bekeken — even sparren?`
            )}`}
            className="font-semibold text-emerald-600 hover:underline"
          >
            WhatsApp Mike
          </a>
        </p>
      </section>
    </StorefrontShell>
  );
}