import Link from "next/link";
import { actieTopDiensten, vandaagLinks } from "@/data/vandaag-geld";

export function ActieDienstenQuick() {
  return (
    <section className="rounded-2xl border border-violet-400/25 bg-violet-400/5 p-5">
      <p className="text-xs font-bold uppercase tracking-widest text-violet-300">Vandaag verkopen</p>
      <p className="mt-1 text-sm text-white/55">Klik → bestelformulier met dienst vooringevuld</p>
      <ul className="mt-4 space-y-2">
        {actieTopDiensten.map(({ dienst, pitch }) => (
          <li key={dienst.slug}>
            <Link
              href={`/bestellen/?dienst=${dienst.slug}`}
              className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 transition hover:border-violet-400/40"
            >
              <span className="font-semibold text-white">
                {dienst.naam}{" "}
                <span className="font-mono text-emerald-300">{dienst.prijs}</span>
              </span>
              <span className="text-xs text-white/45">{pitch}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={vandaagLinks.diensten}
          className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white/75 hover:text-white"
        >
          Volledige catalogus →
        </Link>
        <Link
          href={vandaagLinks.show}
          className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white/75 hover:text-white"
        >
          Show (deel-link) →
        </Link>
      </div>
    </section>
  );
}