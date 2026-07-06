import { diensten, webklaar } from "@/data/diensten-online";

export function SeoJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: webklaar.naam,
    description: webklaar.sub,
    url: webklaar.url,
    areaServed: "NL",
    priceRange: "€199–€899",
    serviceType: diensten.map((d) => d.naam),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "WebKlaar diensten",
      itemListElement: diensten.map((d) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: d.naam,
          description: d.korteOms,
        },
        price: d.prijsNum,
        priceCurrency: "EUR",
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}