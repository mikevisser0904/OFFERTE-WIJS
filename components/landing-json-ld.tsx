import type { SeoLanding } from "@/data/seo-landingen";
import { webklaar } from "@/data/diensten-online";

export function LandingJsonLd({ land, url }: { land: SeoLanding; url: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: land.h1,
    description: land.metaDescription,
    url,
    provider: {
      "@type": "LocalBusiness",
      name: webklaar.naam,
      telephone: webklaar.telefoon,
      email: webklaar.email,
      areaServed: land.stad ?? "Nederland",
      url: webklaar.url,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: land.dienst === "google-start" ? 299 : 899,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}