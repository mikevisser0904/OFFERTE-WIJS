import Link from "next/link";
import { heroProductenKoud } from "@/data/hero-producten";
import { betalingStandaard } from "@/data/diensten-online";

export function HomeHeroProducten() {
  return (
    <div className="mt-10">
      <p className="text-center text-sm font-semibold text-slate-600">
        Kies één pakket — vaste prijs, geen offerte-zonder-bedrag
      </p>
      <div className="mt-6 grid gap-5 lg:grid-cols-3 lg:gap-6">
        {heroProductenKoud.map((h) => {
          const featured = h.aanbevolen;
          return (
            <article
              key={h.slug}
              className={`relative flex flex-col rounded-2xl border p-6 shadow-sm transition hover:shadow-md ${
                featured
                  ? "border-emerald-400 bg-white ring-2 ring-emerald-400/30 lg:scale-[1.02]"
                  : "border-slate-200 bg-white"
              }`}
            >
              {featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald-600 px-4 py-1 text-xs font-bold text-white">
                  Meest gekozen
                </span>
              )}
              <p className="text-sm font-medium text-slate-500">{h.situatie}</p>
              <p className="mt-3 text-3xl font-bold text-emerald-600">{h.dienst.prijs}</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">{h.dienst.naam}</h2>
              <p className="mt-1 text-xs text-slate-400">{h.dienst.levertijd}</p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">{h.voordeel}</p>
              <div className="mt-6 flex flex-col gap-2">
                <Link
                  href={`/bestellen/?dienst=${h.slug}`}
                  className={`rounded-full py-3.5 text-center text-sm font-bold ${
                    featured
                      ? "bg-emerald-600 text-white hover:bg-emerald-500"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  Bestel {h.dienst.naam} →
                </Link>
                <Link
                  href={`/diensten/${h.slug}/`}
                  className="rounded-full py-2.5 text-center text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                >
                  Meer info
                </Link>
                {h.secundaireLink && (
                  <Link
                    href={h.secundaireLink.href}
                    className="text-center text-sm font-semibold text-slate-600 underline-offset-2 hover:underline"
                  >
                    {h.secundaireLink.label} →
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-slate-500">{betalingStandaard}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <Link
          href="/show/"
          className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Nog twijfelen? 2-min show
        </Link>
        <Link
          href="/diensten/"
          className="text-sm font-medium text-emerald-700 hover:underline"
        >
          Alle 12 diensten
        </Link>
      </div>
    </div>
  );
}