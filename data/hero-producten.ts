import { getDienst, type OnlineDienst } from "@/data/diensten-online";

/** Drie keuzes voor koude bezoekers — geen volledige catalogus in de hero */
export type HeroProduct = {
  slug: string;
  dienst: OnlineDienst;
  /** Korte situatie — “herken ik me in?” */
  situatie: string;
  /** Eén regel voordeel */
  voordeel: string;
  /** Middenkaart / aanbevolen */
  aanbevolen?: boolean;
  /** Extra link (demo) */
  secundaireLink?: { href: string; label: string };
};

const coldCopy: Record<
  string,
  { situatie: string; voordeel: string; aanbevolen?: boolean; secundaireLink?: { href: string; label: string } }
> = {
  "google-start": {
    situatie: "Nog geen sterk Google-profiel?",
    voordeel: "Profiel + landingspagina + reviews — geen bestaande site nodig.",
    aanbevolen: true,
  },
  "seo-starter": {
    situatie: "Website staat al, maar Google vindt je niet?",
    voordeel: "Search Console, sitemap en regio-landings — zoals wij op deze site doen.",
  },
  "vakman-site": {
    situatie: "Klaar voor een volledige bedrijfssite?",
    voordeel: "5 pagina's, mobiel, WhatsApp, 1 jaar hosting — bewezen template.",
    secundaireLink: { href: "/demo/", label: "Bekijk demo" },
  },
};

const slugs = ["google-start", "seo-starter", "vakman-site"] as const;

function buildHero(slug: (typeof slugs)[number]): HeroProduct {
  const dienst = getDienst(slug)!;
  const copy = coldCopy[slug];
  return { slug, dienst, ...copy };
}

export const heroProductenKoud: HeroProduct[] = slugs.map(buildHero);