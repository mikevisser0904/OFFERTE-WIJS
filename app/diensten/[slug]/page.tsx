import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StorefrontShell } from "@/components/storefront-shell";
import { DienstDetailExtras } from "@/components/dienst-detail-extras";
import { DienstJsonLd } from "@/components/dienst-json-ld";
import { categorieMeta, diensten, getDienst } from "@/data/diensten-online";
import { getDienstMeta } from "@/data/dienst-meta";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return diensten.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = getDienst(slug);
  if (!d) return { title: "Dienst niet gevonden" };
  return pageMetadata({
    title: `${d.naam} ${d.prijs} — online bestellen`,
    description: `${d.beschrijving} Bestel online. ${d.levertijd}.`,
    path: `/diensten/${slug}`,
    keywords: [d.naam, d.korteOms, "DoekoeWijs", "internetdiensten"],
  });
}

export default async function DienstDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = getDienst(slug);
  if (!d) notFound();

  const meta = getDienstMeta(slug);

  return (
    <StorefrontShell>
      <DienstJsonLd d={d} url={absoluteUrl(`/diensten/${slug}`)} />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/diensten/" className="text-sm text-emerald-600 hover:underline">
          ← Alle diensten
        </Link>
        <p className="mt-6 text-4xl font-bold text-emerald-600">{d.prijs}</p>
        <h1 className="mt-2 text-3xl font-bold">{d.naam}</h1>
        <p className="mt-2 text-slate-500">
          {d.levertijd} · {categorieMeta[d.categorie].label}
        </p>
        <p className="mt-6 text-lg text-slate-700">{d.beschrijving}</p>
        <p className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/80 p-4 text-sm text-slate-700">
          <strong className="text-emerald-900">Wat u krijgt: </strong>
          {d.levering}
        </p>

        <ul className="mt-8 space-y-2">
          {d.bullets.map((b) => (
            <li key={b} className="flex gap-2 text-slate-600">
              <span className="text-emerald-600">✓</span> {b}
            </li>
          ))}
        </ul>

        <p className="mt-8 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          <strong>Voor wie:</strong> {d.voorWie}
        </p>
        {meta?.pitch1Regel && (
          <p className="mt-4 text-sm font-medium text-emerald-800">{meta.pitch1Regel}</p>
        )}

        <div className="mt-10 flex flex-wrap gap-4">
          {d.slug === "spoed-hulp" ? (
            <Link
              href="/spoed/"
              className="inline-flex rounded-full bg-amber-600 px-10 py-4 text-lg font-bold text-white hover:bg-amber-500"
            >
              Naar spoed-pagina →
            </Link>
          ) : (
            <Link
              href={`/bestellen/?dienst=${d.slug}`}
              className="inline-flex rounded-full bg-emerald-600 px-10 py-4 text-lg font-bold text-white hover:bg-emerald-500"
            >
              Bestel {d.naam} →
            </Link>
          )}
          <Link
            href="/show/"
            className="inline-flex rounded-full border border-slate-200 px-8 py-4 text-base font-semibold text-slate-700 hover:bg-slate-50"
          >
            2-min show
          </Link>
        </div>

        <DienstDetailExtras d={d} />
      </div>
    </StorefrontShell>
  );
}