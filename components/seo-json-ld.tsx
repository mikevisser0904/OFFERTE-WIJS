import { diensten, webklaar } from "@/data/diensten-online";
import { absoluteUrl } from "@/lib/seo";

export function SeoJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${webklaar.url}#org`,
        name: webklaar.naam,
        url: webklaar.url,
        email: webklaar.email,
        telephone: webklaar.telefoon,
        description: webklaar.sub,
        areaServed: "NL",
      },
      {
        "@type": "WebSite",
        "@id": `${webklaar.url}#website`,
        url: webklaar.url,
        name: webklaar.naam,
        publisher: { "@id": `${webklaar.url}#org` },
        inLanguage: "nl-NL",
        potentialAction: {
          "@type": "SearchAction",
          target: `${absoluteUrl("/diensten/")}?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${webklaar.url}#service`,
        name: webklaar.naam,
        description: webklaar.tagline,
        url: webklaar.url,
        telephone: webklaar.telefoon,
        email: webklaar.email,
        priceRange: "€199–€899",
        areaServed: { "@type": "Country", name: "Nederland" },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "WebKlaar diensten",
          itemListElement: diensten.map((d) => ({
            "@type": "Offer",
            url: absoluteUrl(`/diensten/${d.slug}`),
            itemOffered: {
              "@type": "Service",
              name: d.naam,
              description: d.korteOms,
            },
            price: d.prijsNum,
            priceCurrency: "EUR",
          })),
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}