"use client";

import { CopyBlock } from "@/components/copy-block";
import { diensten } from "@/data/diensten-online";
import { dienstVerkoopMeta } from "@/data/dienst-meta";
import Link from "next/link";

const sorted = [...diensten].sort((a, b) => {
  const pa = dienstVerkoopMeta[a.slug]?.actiePrioriteit ?? 50;
  const pb = dienstVerkoopMeta[b.slug]?.actiePrioriteit ?? 50;
  return pa - pb;
});

export function VerkoopProductMatrix() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Per product — pitch & slagingskans</h2>
        <p className="mt-1 text-sm text-white/50">
          Korte termijn 1–5 (5 = snelst warm). Volledige analyse:{" "}
          <code className="text-white/60">docs/PRODUCTEN-ANALYSE.md</code>
        </p>
      </div>
      <div className="space-y-4">
        {sorted.map((d) => {
          const meta = dienstVerkoopMeta[d.slug];
          if (!meta) return null;
          return (
            <article
              key={d.slug}
              className={`rounded-xl border p-5 ${
                meta.verkoopActief ? "border-white/10 bg-white/[0.02]" : "border-white/5 bg-white/[0.01] opacity-70"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link href={`/diensten/${d.slug}/`} className="font-bold text-emerald-300 hover:underline">
                    {d.naam} {d.prijs}
                  </Link>
                  <p className="mt-1 text-xs text-white/45">
                    Korte termijn: {meta.korteTermijn}/5 · {meta.tier}
                    {!meta.verkoopActief && " · geen cold outreach"}
                  </p>
                </div>
                <Link
                  href={`/bestellen/?dienst=${d.slug}`}
                  className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70 hover:text-white"
                >
                  Bestel-link
                </Link>
              </div>
              <p className="mt-3 text-sm text-white/65">{meta.pitch1Regel}</p>
              <div className="mt-4">
                <CopyBlock label="WhatsApp pitch" tekst={meta.pitchWhatsApp} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}