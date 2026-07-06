import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StorefrontShell } from "@/components/storefront-shell";
import { diensten, getDienst } from "@/data/diensten-online";
import { pageMetadata } from "@/lib/seo";

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
    keywords: [d.naam, d.korteOms, "webklaar"],
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

  return (
    <StorefrontShell>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/diensten/" className="text-sm text-teal-600 hover:underline">
          ← Alle diensten
        </Link>
        <p className="mt-6 text-4xl font-bold text-teal-600">{d.prijs}</p>
        <h1 className="mt-2 text-3xl font-bold">{d.naam}</h1>
        <p className="mt-2 text-slate-500">{d.levertijd}</p>
        <p className="mt-6 text-lg text-slate-700">{d.beschrijving}</p>

        <ul className="mt-8 space-y-2">
          {d.bullets.map((b) => (
            <li key={b} className="flex gap-2 text-slate-600">
              <span className="text-teal-600">✓</span> {b}
            </li>
          ))}
        </ul>

        <p className="mt-8 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          <strong>Voor wie:</strong> {d.voorWie}
        </p>

        <Link
          href={`/bestellen/?dienst=${d.slug}`}
          className="mt-10 inline-flex rounded-full bg-teal-600 px-10 py-4 text-lg font-bold text-white hover:bg-teal-500"
        >
          Bestel {d.naam} →
        </Link>
      </div>
    </StorefrontShell>
  );
}