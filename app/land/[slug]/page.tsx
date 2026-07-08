import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StorefrontShell } from "@/components/storefront-shell";
import { LandingJsonLd } from "@/components/landing-json-ld";
import { betalingStandaard, getDienst } from "@/data/diensten-online";
import { seoLandingen, getSeoLanding } from "@/data/seo-landingen";
import { pageMetadata, absoluteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return seoLandingen.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const land = getSeoLanding(slug);
  if (!land) return { title: "Niet gevonden" };
  return pageMetadata({
    title: land.title,
    description: land.metaDescription,
    path: `/land/${slug}`,
    keywords: land.keywords,
  });
}

export default async function SeoLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const land = getSeoLanding(slug);
  if (!land) notFound();

  return (
    <StorefrontShell>
      <LandingJsonLd land={land} url={absoluteUrl(`/land/${slug}`)} />

      <article className="mx-auto max-w-3xl px-6 py-16">
        <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-emerald-600">
            Home
          </Link>
          {" / "}
          <span>{land.stad ?? "Nederland"}</span>
        </nav>

        <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{land.h1}</h1>
        <p className="mt-4 text-lg text-slate-600">{land.intro}</p>

        {land.paragraphs.map((p) => (
          <p key={p} className="mt-4 leading-relaxed text-slate-600">
            {p}
          </p>
        ))}

        <section className="mt-10 rounded-2xl border border-emerald-100 bg-emerald-50 p-8">
          <h2 className="text-xl font-bold text-slate-900">Direct bestellen</h2>
          <p className="mt-2 text-slate-600">
            Vaste prijs voor zzp en mkb — ook vakbedrijven. {betalingStandaard}
          </p>
          {(() => {
            const hoofd = getDienst(land.dienst);
            const alt =
              land.dienst === "vakman-site"
                ? getDienst("google-start")
                : getDienst("seo-starter");
            return (
              <div className="mt-6 space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={land.dienst === "google-start" ? "/start/" : `/bestellen/?dienst=${land.dienst}`}
                    className="rounded-full bg-emerald-600 px-8 py-3 font-bold text-white hover:bg-emerald-500"
                  >
                    {hoofd ? `${hoofd.naam} ${hoofd.prijs} →` : "Bestel nu →"}
                  </Link>
                  <Link
                    href="/demo/"
                    className="rounded-full border border-emerald-200 px-8 py-3 font-semibold text-emerald-800 hover:bg-emerald-100"
                  >
                    Bekijk demo
                  </Link>
                  <Link
                    href="/show/"
                    className="rounded-full border border-slate-200 px-8 py-3 font-semibold text-slate-700 hover:bg-white"
                  >
                    2-min show
                  </Link>
                </div>
                {alt && (
                  <p className="text-sm text-slate-600">
                    Kleinere stap:{" "}
                    <Link href={`/diensten/${alt.slug}/`} className="font-semibold text-emerald-700 hover:underline">
                      {alt.naam} {alt.prijs}
                    </Link>
                  </p>
                )}
              </div>
            );
          })()}
        </section>

        <section className="mt-12">
          <h2 className="text-lg font-bold">Gerelateerd</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/diensten/" className="text-emerald-600 hover:underline">
                Alle diensten & prijzen
              </Link>
            </li>
            <li>
              <Link href="/diensten/vakman-site/" className="text-emerald-600 hover:underline">
                Vakman Website €899
              </Link>
            </li>
            <li>
              <Link href="/diensten/google-start/" className="text-emerald-600 hover:underline">
                Google Start €299
              </Link>
            </li>
          </ul>
        </section>
      </article>
    </StorefrontShell>
  );
}