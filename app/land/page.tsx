import Link from "next/link";
import type { Metadata } from "next";
import { StorefrontShell } from "@/components/storefront-shell";
import { seoLandingen } from "@/data/seo-landingen";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Websites per regio en vak — overzicht",
  description:
    "SEO-landingspagina's per stad en branche. DoekoeWijs: Google Start, SEO, websites — vaste prijs.",
  path: "/land",
  keywords: ["internetdiensten", "website per stad", "seo starter", "google start"],
});

export default function LandIndexPage() {
  const sorted = [...seoLandingen].sort((a, b) => (a.stad || "").localeCompare(b.stad || ""));

  return (
    <StorefrontShell>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold">Landingspagina&apos;s — regio & diensten</h1>
        <p className="mt-3 text-slate-600">
          Traffic naar Google Start, SEO Starter en websites. Vaste prijs, online bestellen.
        </p>
        <ul className="mt-10 space-y-3">
          {sorted.map((l) => (
            <li key={l.slug}>
              <Link
                href={`/land/${l.slug}/`}
                className="text-emerald-600 hover:underline"
              >
                {l.h1}
              </Link>
              {l.stad && <span className="ml-2 text-sm text-slate-400">({l.stad})</span>}
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-wrap gap-4">
          <Link href="/start/" className="font-semibold text-emerald-600 hover:underline">
            Google Start €299 →
          </Link>
          <Link href="/bestellen/" className="font-semibold text-slate-700 hover:underline">
            Bestellen →
          </Link>
        </div>
      </div>
    </StorefrontShell>
  );
}