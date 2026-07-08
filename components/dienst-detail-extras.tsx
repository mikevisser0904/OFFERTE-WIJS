import Link from "next/link";
import type { OnlineDienst } from "@/data/diensten-online";
import { betalingStandaard, getDienst } from "@/data/diensten-online";
import { getDienstMeta } from "@/data/dienst-meta";

export function DienstDetailExtras({ d }: { d: OnlineDienst }) {
  const meta = getDienstMeta(d.slug);
  if (!meta) return null;

  const upsell = meta.upsellSlug ? getDienst(meta.upsellSlug) : undefined;
  const related = meta.relatedSlugs.map((s) => getDienst(s)).filter(Boolean) as OnlineDienst[];

  return (
    <div className="mt-12 space-y-10">
      <section className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">Betaling</p>
        <p className="mt-2">{betalingStandaard}</p>
        {meta.tier === "op-verzoek" && (
          <p className="mt-3 text-amber-800">
            Dit pakket verkopen we alleen na toestemming — niet via koude lek-berichten.
          </p>
        )}
      </section>

      {meta.faq.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-slate-900">Veelgesteld over {d.naam}</h2>
          <div className="mt-4 space-y-4">
            {meta.faq.map((f) => (
              <div key={f.q}>
                <h3 className="font-semibold text-slate-800">{f.q}</h3>
                <p className="mt-1 text-slate-600">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {upsell && (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Vaak daarna</p>
          <p className="mt-2 font-bold text-slate-900">
            {upsell.naam} — {upsell.prijs}
          </p>
          <p className="mt-1 text-sm text-slate-600">{upsell.korteOms}</p>
          <Link
            href={`/diensten/${upsell.slug}/`}
            className="mt-4 inline-block text-sm font-semibold text-emerald-700 hover:underline"
          >
            Bekijk {upsell.naam} →
          </Link>
        </section>
      )}

      {related.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-slate-900">Gerelateerde diensten</h2>
          <ul className="mt-4 space-y-2">
            {related
              .filter((r) => r.slug !== d.slug)
              .slice(0, 4)
              .map((r) => (
                <li key={r.slug}>
                  <Link href={`/diensten/${r.slug}/`} className="text-emerald-600 hover:underline">
                    {r.naam} {r.prijs}
                  </Link>
                  <span className="ml-2 text-sm text-slate-500">{r.korteOms}</span>
                </li>
              ))}
          </ul>
        </section>
      )}

      {d.slug === "vakman-site" && (
        <Link href="/demo/" className="inline-flex text-sm font-semibold text-emerald-700 hover:underline">
          Bekijk live demo (De Zonmeester) →
        </Link>
      )}
    </div>
  );
}