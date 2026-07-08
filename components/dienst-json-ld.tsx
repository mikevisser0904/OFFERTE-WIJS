import type { OnlineDienst } from "@/data/diensten-online";
import { betalingStandaard, webklaar } from "@/data/diensten-online";

export function DienstJsonLd({ d, url }: { d: OnlineDienst; url: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${d.naam} — ${webklaar.naam}`,
    description: d.beschrijving,
    url,
    provider: {
      "@type": "Organization",
      name: webklaar.naam,
      telephone: webklaar.telefoon,
      email: webklaar.email,
      url: webklaar.url,
    },
    offers: {
      "@type": "Offer",
      price: d.prijsNum,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      description: betalingStandaard,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}