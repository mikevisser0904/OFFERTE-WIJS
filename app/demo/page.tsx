import type { Metadata } from "next";
import { DemoVakmanSite } from "@/components/demo-vakman-site";
import { demo } from "@/data/demo-site";
import { pageMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Demo website — voorbeeld zonwering (Vakman €899)",
  description:
    "Professionele bedrijfssite: diensten, reviews, FAQ en WhatsApp. Portfolio voor DoekoeWijs Vakman Website €899.",
  path: "/demo",
  keywords: ["demo website vakman", "voorbeeld website zonwering", "website installateur voorbeeld"],
});

function demoJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: demo.bedrijf,
    description: demo.tagline,
    areaServed: demo.regio,
    telephone: demo.telefoonTel,
    email: demo.email,
    url: `${SITE_URL}demo/`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "120",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function DemoSitePage() {
  return (
    <>
      {demoJsonLd()}
      <DemoVakmanSite />
    </>
  );
}