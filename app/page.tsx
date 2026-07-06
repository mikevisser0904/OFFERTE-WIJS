import Link from "next/link";
import { StorefrontShell } from "@/components/storefront-shell";
import { SeoJsonLd } from "@/components/seo-json-ld";
import { diensten, webklaar } from "@/data/diensten-online";

export default function StoreHomePage() {
  return (
    <StorefrontShell>
      <SeoJsonLd />

      <section className="bg-gradient-to-b from-teal-50 to-white px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-600">
            Online te bestellen · vaste prijs
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Websites & digitaal
            <br />
            <span className="text-teal-600">voor vakmannen.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600">{webklaar.sub}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/bestellen/"
              className="rounded-full bg-teal-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-teal-600/20 hover:bg-teal-500"
            >
              Bestel direct →
            </Link>
            <Link
              href="/demo/"
              className="rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 hover:bg-slate-50"
            >
              Bekijk demo-site
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap gap-6 text-sm text-slate-500">
            {webklaar.usps.map((u) => (
              <span key={u}>✓ {u}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-bold">Diensten online bestellen</h2>
        <p className="mt-2 text-slate-500">
          Kies, vul formulier in, klaar. Wij bouwen — u levert logo + teksten.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {diensten.map((d) => (
            <article
              key={d.slug}
              className={`relative rounded-2xl border p-6 transition hover:shadow-md ${
                d.populair ? "border-teal-300 bg-teal-50/50" : "border-slate-100"
              }`}
            >
              {d.populair && (
                <span className="absolute -top-2 right-4 rounded-full bg-teal-600 px-3 py-0.5 text-xs font-bold text-white">
                  Populair
                </span>
              )}
              <p className="text-2xl font-bold text-teal-600">{d.prijs}</p>
              <h3 className="mt-2 text-lg font-bold">{d.naam}</h3>
              <p className="mt-2 text-sm text-slate-500">{d.korteOms}</p>
              <p className="mt-3 text-xs text-slate-400">{d.levertijd}</p>
              <div className="mt-5 flex gap-3">
                <Link
                  href={`/diensten/${d.slug}/`}
                  className="text-sm font-medium text-teal-600 hover:underline"
                >
                  Meer info
                </Link>
                <Link
                  href={`/bestellen/?dienst=${d.slug}`}
                  className="text-sm font-bold text-slate-900 hover:text-teal-600"
                >
                  Bestel →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-2xl font-bold">Zo werkt bestellen</h2>
          <ol className="mx-auto mt-10 grid max-w-3xl gap-8 text-left sm:grid-cols-3">
            {[
              { stap: "1", tekst: "Kies dienst en vul formulier in" },
              { stap: "2", tekst: "Wij nemen binnen 24u contact op" },
              { stap: "3", tekst: "U levert logo + teksten — wij bouwen" },
            ].map((s) => (
              <li key={s.stap}>
                <span className="text-3xl font-bold text-teal-400">{s.stap}</span>
                <p className="mt-2 text-sm text-slate-300">{s.tekst}</p>
              </li>
            ))}
          </ol>
          <Link
            href="/bestellen/"
            className="mt-10 inline-flex rounded-full bg-teal-500 px-8 py-3 font-bold text-white hover:bg-teal-400"
          >
            Naar bestelformulier
          </Link>
        </div>
      </section>
    </StorefrontShell>
  );
}