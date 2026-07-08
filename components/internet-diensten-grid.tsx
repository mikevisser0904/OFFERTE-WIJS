import Link from "next/link";
import type { OnlineDienst } from "@/data/diensten-online";
import { getDienstMeta } from "@/data/dienst-meta";

export function DienstCard({ d, compact }: { d: OnlineDienst; compact?: boolean }) {
  const meta = getDienstMeta(d.slug);
  const snel = meta && meta.korteTermijn >= 4;
  return (
    <article
      className={`relative rounded-2xl border p-6 transition hover:shadow-md ${
        d.populair ? "border-emerald-300 bg-emerald-50/50" : "border-slate-100 bg-white"
      }`}
    >
      {(d.populair || snel) && (
        <span className="absolute -top-2 right-4 rounded-full bg-emerald-600 px-3 py-0.5 text-xs font-bold text-white">
          {snel && !d.populair ? "Snel verkopen" : d.populair ? "Populair" : "Snel verkopen"}
        </span>
      )}
      <p className="text-2xl font-bold text-emerald-600">{d.prijs}</p>
      <h3 className={`mt-2 font-bold text-slate-900 ${compact ? "text-base" : "text-lg"}`}>{d.naam}</h3>
      <p className="mt-2 text-sm text-slate-500">{d.korteOms}</p>
      {!compact && (
        <p className="mt-2 text-xs text-slate-400">{d.levertijd}</p>
      )}
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href={`/diensten/${d.slug}/`} className="text-sm font-medium text-emerald-600 hover:underline">
          Meer info
        </Link>
        <Link
          href={`/bestellen/?dienst=${d.slug}`}
          className="text-sm font-bold text-slate-900 hover:text-emerald-600"
        >
          Bestel →
        </Link>
      </div>
    </article>
  );
}

export function InternetDienstenSectie({
  titel,
  sub,
  items,
  compact,
}: {
  titel: string;
  sub: string;
  items: OnlineDienst[];
  compact?: boolean;
}) {
  if (!items.length) return null;
  return (
    <section className="mt-14 first:mt-0">
      <h2 className="text-xl font-bold text-slate-900">{titel}</h2>
      <p className="mt-1 text-sm text-slate-500">{sub}</p>
      <div className={`mt-6 grid gap-6 ${compact ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"}`}>
        {items.map((d) => (
          <DienstCard key={d.slug} d={d} compact={compact} />
        ))}
      </div>
    </section>
  );
}