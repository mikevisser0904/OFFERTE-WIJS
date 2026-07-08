import type { Metadata } from "next";
import { Suspense } from "react";
import { StorefrontShell } from "@/components/storefront-shell";
import { BestelPageClient } from "@/components/bestel-page-client";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Bestellen — DoekoeWijs internetdiensten",
  description:
    "Bestel Google Start €299, SEO €199, websites en meer. Vaste prijs — 50% vooraf (Tikkie), rest bij oplevering.",
  path: "/bestellen",
  keywords: ["DoekoeWijs bestellen", "Google Start bestellen", "website bestellen"],
});

export default function BestellenPage() {
  return (
    <StorefrontShell cta={false}>
      <div className="mx-auto max-w-lg px-6 py-16 pb-28">
        <h1 className="text-3xl font-bold">Bestellen</h1>
        <p className="mt-3 text-slate-600">
          Vul in → WhatsApp en e-mail openen automatisch. Werkdagen: reactie dezelfde dag waar mogelijk.
        </p>
        <div className="mt-10">
          <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-slate-100" />}>
            <BestelPageClient />
          </Suspense>
        </div>
      </div>
    </StorefrontShell>
  );
}