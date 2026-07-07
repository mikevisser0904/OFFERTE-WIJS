import Link from "next/link";
import type { Metadata } from "next";
import { demo } from "@/data/demo-site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Demo website vakman — voorbeeld Zonwering site",
  description:
    "Bekijk een demo van een professionele vakman-website. Zo ziet uw site eruit. Bestel vanaf €899 bij DoekoeWijs.",
  path: "/demo",
  keywords: ["demo website vakman", "voorbeeld website zonwering"],
});

export default function DemoSitePage() {
  const wa = `https://wa.me/${demo.whatsapp}?text=${encodeURIComponent("Hoi, ik wil graag een offerte voor zonwering.")}`;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="bg-amber-500 px-4 py-2 text-center text-sm font-medium text-slate-900">
        DEMO — zo ziet de site van uw klant eruit ·{" "}
        <Link href="/bestellen/" className="underline hover:no-underline">
          Bestel uw eigen site →
        </Link>
      </div>

      <header className="border-b border-slate-100">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xl font-bold" style={{ color: demo.kleur }}>
              {demo.bedrijf}
            </p>
            <p className="text-xs text-slate-500">{demo.tagline}</p>
          </div>
          <a
            href={`tel:${demo.telefoon.replace(/\s/g, "")}`}
            className="hidden rounded-full px-5 py-2 text-sm font-semibold text-white sm:inline-block"
            style={{ backgroundColor: demo.kleur }}
          >
            {demo.telefoon}
          </a>
        </div>
      </header>

      <section
        className="px-6 py-20 text-white"
        style={{ background: `linear-gradient(135deg, ${demo.kleur} 0%, #0f766e 100%)` }}
      >
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium uppercase tracking-widest text-white/70">
            {demo.regio}
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
            Zonwering op maat voor uw woning
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/85">
            Gratis advies, offerte binnen 24 uur. Screens, rolluiken, knikarm en kozijnen.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={wa}
              className="rounded-full bg-white px-8 py-3 font-semibold text-slate-900 hover:bg-white/90"
            >
              WhatsApp offerte
            </a>
            <a
              href="#diensten"
              className="rounded-full border border-white/40 px-8 py-3 font-semibold hover:bg-white/10"
            >
              Bekijk diensten
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-slate-50 py-8">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 sm:grid-cols-4">
          {demo.stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold" style={{ color: demo.kleur }}>
                {s.value}
              </p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap justify-center gap-4 border-b border-slate-100 py-6">
        {demo.usps.map((u) => (
          <span
            key={u}
            className="rounded-full bg-slate-100 px-4 py-1.5 text-sm text-slate-600"
          >
            ✓ {u}
          </span>
        ))}
      </section>

      <section id="diensten" className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-bold">Onze diensten</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {demo.diensten.map((d) => (
            <div
              key={d.titel}
              className="rounded-2xl border border-slate-100 p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold">{d.titel}</h3>
              <p className="mt-2 text-slate-600">{d.tekst}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-bold">Wat klanten zeggen</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {demo.reviews.map((r) => (
              <blockquote
                key={r.naam}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <p className="text-slate-600">&ldquo;{r.tekst}&rdquo;</p>
                <footer className="mt-4 text-sm font-semibold">
                  {r.naam} · {r.plaats}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section
        className="px-6 py-16 text-center text-white"
        style={{ backgroundColor: demo.kleur }}
      >
        <h2 className="text-2xl font-bold">Klaar voor een vrijblijvende offerte?</h2>
        <p className="mx-auto mt-3 max-w-md text-white/85">
          Bel of app ons — reactie binnen 24 uur.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href={wa}
            className="rounded-full bg-white px-8 py-3 font-semibold text-slate-900"
          >
            WhatsApp
          </a>
          <a href={`tel:${demo.telefoon.replace(/\s/g, "")}`} className="rounded-full border border-white/40 px-8 py-3 font-semibold">
            {demo.telefoon}
          </a>
        </div>
      </section>

      <footer className="border-t border-slate-100 px-6 py-8 text-center text-xs text-slate-400">
        {demo.bedrijf} · {demo.email} · Demo door DoekoeWijs
      </footer>
    </div>
  );
}