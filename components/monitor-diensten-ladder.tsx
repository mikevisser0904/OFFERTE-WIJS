import Link from "next/link";
import { dienstPrijs, monitorLinks, monitorVerkoopLadder } from "@/data/monitoring";

export function MonitorDienstenLadder() {
  return (
    <section className="rounded-2xl border border-violet-400/25 bg-violet-400/5 p-6">
      <h2 className="font-bold text-violet-200">Verkoopladder (catalogus)</h2>
      <p className="mt-1 text-sm text-white/50">
        Meet opdrachten en omzet tegen deze pakketten — zelfde als webshop.
      </p>
      <ul className="mt-4 space-y-2">
        {monitorVerkoopLadder.map((item) => (
          <li key={item.slug} className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="text-white/85">
              {item.label}
              {item.instap && (
                <span className="ml-2 rounded bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-200">
                  instap
                </span>
              )}
            </span>
            <Link
              href={`/bestellen/?dienst=${item.slug}`}
              className="font-mono text-xs text-emerald-300 hover:underline"
            >
              {dienstPrijs(item.slug)} →
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/actie/" className="rounded-full bg-emerald-400/90 px-4 py-1.5 text-xs font-bold text-slate-900">
          /actie/
        </Link>
        <Link href="/verkoop/" className="rounded-full border border-white/20 px-4 py-1.5 text-xs text-white/75 hover:text-white">
          /verkoop/
        </Link>
        <a
          href={monitorLinks.diensten}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-white/20 px-4 py-1.5 text-xs text-white/75 hover:text-white"
        >
          Catalogus ↗
        </a>
      </div>
    </section>
  );
}