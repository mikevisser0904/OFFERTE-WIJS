import type { OnlineDienst } from "@/data/diensten-online";
import { diensten, webklaar } from "@/data/diensten-online";

/** 5 = snelste verkoop warm netwerk · 1 = langere cycle */
export type KorteTermijnScore = 1 | 2 | 3 | 4 | 5;

export type InstapTier = "vandaag" | "deze-week" | "project" | "doorlopend" | "op-verzoek";

export type DienstVerkoopMeta = {
  slug: string;
  korteTermijn: KorteTermijnScore;
  tier: InstapTier;
  actiePrioriteit: number;
  /** Zichtbaar op /actie/ quick list */
  actieQuick: boolean;
  /** Cold outreach (VakScan) — default uit */
  verkoopActief: boolean;
  pitch1Regel: string;
  pitchWhatsApp: string;
  faq: { q: string; a: string }[];
  upsellSlug?: string;
  relatedSlugs: string[];
  landingsTip?: string;
};

const bestel = (slug: string) => `${webklaar.url}bestellen/?dienst=${slug}`;

export const dienstVerkoopMeta: Record<string, DienstVerkoopMeta> = {
  "spoed-hulp": {
    slug: "spoed-hulp",
    korteTermijn: 5,
    tier: "vandaag",
    actiePrioriteit: 1,
    actieQuick: true,
    verkoopActief: true,
    pitch1Regel: "1 uur vast vandaag — mail, site, Google of Excel",
    pitchWhatsApp: `Hoi [NAAM], Mike (${webklaar.naam}). Vandaag nog 1 uur digitale hulp voor vast €50 — scope vooraf. ${webklaar.url}spoed/`,
    faq: [
      { q: "Wat kan in 1 uur?", a: "Eén scope: mail instellen, kleine site-fix, Google-check, Excel-fix of PC-opruimen. Geen nieuwe site vanaf nul." },
      { q: "Hoe betaal ik?", a: "Spoed: volledig vooraf via Tikkie (of contant bij start)." },
    ],
    upsellSlug: "google-start",
    relatedSlugs: ["google-start", "seo-starter", "content-refresh"],
    landingsTip: "Warm netwerk — stuur /spoed/ bij 'ik zit vast vandaag'.",
  },
  "listings-setup": {
    slug: "listings-setup",
    korteTermijn: 5,
    tier: "deze-week",
    actiePrioriteit: 2,
    actieQuick: true,
    verkoopActief: true,
    pitch1Regel: "Fiverr + Marktplaats teksten — jij plakt, wij schrijven",
    pitchWhatsApp: `Hoi [NAAM], wij leveren kant-en-klare Fiverr/Marktplaats-teksten voor €149 (1 dag). Copy: ${webklaar.url}listings/ · bestellen: ${bestel("listings-setup")}`,
    faq: [
      { q: "Plaatsen jullie de advertentie?", a: "Wij leveren teksten + 15 min loop-through; u plaatst op uw account (Fiverr/Marktplaats/Malt)." },
      { q: "Werkt dit voor niet-vakmannen?", a: "Ja — elke zzp/mkb die extra kanalen wil zonder agency-tarief." },
    ],
    upsellSlug: "seo-starter",
    relatedSlugs: ["seo-starter", "google-start", "landing-snel"],
    landingsTip: "Meta-product: verkoop aan freelancers in je netwerk.",
  },
  "seo-starter": {
    slug: "seo-starter",
    korteTermijn: 4,
    tier: "deze-week",
    actiePrioriteit: 3,
    actieQuick: true,
    verkoopActief: true,
    pitch1Regel: "Search Console + sitemap + 3–5 landings — zoals wij zelf doen",
    pitchWhatsApp: `Hoi [NAAM], site staat live maar Google matig? SEO Starter €199: GSC, sitemap, landings. 3 dagen. ${bestel("seo-starter")}`,
    faq: [
      { q: "Moet ik al een domein hebben?", a: "Ja, een bestaande site of pagina om te koppelen. Geen site? Kijk naar Google Start of Landing Snel." },
      { q: "Garantie op pagina 1?", a: "Nee — wel de technische basis en landings die DoekoeWijs zelf ook gebruikt. Resultaat groeit over weken." },
    ],
    upsellSlug: "google-start",
    relatedSlugs: ["google-start", "landing-snel", "content-refresh"],
    landingsTip: "Koppel aan klanten met oude site — 'gevonden worden'.",
  },
  "google-start": {
    slug: "google-start",
    korteTermijn: 4,
    tier: "deze-week",
    actiePrioriteit: 4,
    actieQuick: true,
    verkoopActief: true,
    pitch1Regel: "Google Business + one-pager + reviews — instap €299",
    pitchWhatsApp: `Hoi [NAAM], Google Start €299: profiel + landingspagina + review-template. 2 dagen. ${webklaar.url}start/`,
    faq: [
      { q: "Heb ik al een website nodig?", a: "Nee — de one-pager is inbegrepen. Later uitbreiden naar volledige site kan." },
      { q: "Wat lever ik aan?", a: "Bedrijfsnaam, logo (of tekst), korte dienstentekst, foto's optioneel." },
    ],
    upsellSlug: "seo-starter",
    relatedSlugs: ["seo-starter", "vakman-site", "landing-snel"],
    landingsTip: "Hero-product — deel /start/ in plaats van hele catalogus.",
  },
  "content-refresh": {
    slug: "content-refresh",
    korteTermijn: 4,
    tier: "deze-week",
    actiePrioriteit: 5,
    actieQuick: false,
    verkoopActief: true,
    pitch1Regel: "Site bestaat — 5 teksten + 3 foto's fris in 1 dag",
    pitchWhatsApp: `Hoi [NAAM], site voelt oud? Content Refresh €149, 1 werkdag. Geen redesign. ${bestel("content-refresh")}`,
    faq: [
      { q: "WordPress of custom?", a: "CMS of codebase — we werken in wat u heeft (intake bepaalt scope)." },
    ],
    upsellSlug: "seo-starter",
    relatedSlugs: ["seo-starter", "onderhoud", "landing-snel"],
  },
  "landing-snel": {
    slug: "landing-snel",
    korteTermijn: 3,
    tier: "project",
    actiePrioriteit: 6,
    actieQuick: true,
    verkoopActief: true,
    pitch1Regel: "Eén campagnepagina — mobiel, WhatsApp, 2 dagen",
    pitchWhatsApp: `Hoi [NAAM], één sterke landingspagina €349 — actie of regio. ${bestel("landing-snel")} · demo: ${webklaar.demo}`,
    faq: [
      { q: "Verschil met Vakman site?", a: "Landing = 1 pagina. Vakman site = 5 pagina's + hosting 1 jaar." },
    ],
    upsellSlug: "vakman-site",
    relatedSlugs: ["vakman-site", "google-start", "seo-starter"],
  },
  "vakman-site": {
    slug: "vakman-site",
    korteTermijn: 3,
    tier: "project",
    actiePrioriteit: 7,
    actieQuick: true,
    verkoopActief: true,
    pitch1Regel: "5 pagina's + hosting 1 jaar — demo De Zonmeester",
    pitchWhatsApp: `Hoi [NAAM], vakman-site €899, 3 dagen na uw content. Voorbeeld: ${webklaar.demo} · ${bestel("vakman-site")}`,
    faq: [
      { q: "Zonwering alleen?", a: "Template werkt voor installateurs, kozijnen, schilders, zzp — zie demo." },
      { q: "Hosting daarna?", a: "1 jaar inbegrepen; daarna eigen hosting of onderhoud €49/mnd." },
    ],
    upsellSlug: "onderhoud",
    relatedSlugs: ["google-start", "seo-starter", "landing-snel"],
    landingsTip: "Alle /land/ vakman-pagina's → deze SKU.",
  },
  "ai-snelstart": {
    slug: "ai-snelstart",
    korteTermijn: 3,
    tier: "deze-week",
    actiePrioriteit: 8,
    actieQuick: true,
    verkoopActief: true,
    pitch1Regel: "10 prompts + 1 uur uitleg — geen consultantpraat",
    pitchWhatsApp: `Hoi [NAAM], AI Snelstart €199: account, 10 prompts (mail/offerte/social), handleiding. ${bestel("ai-snelstart")}`,
    faq: [
      { q: "Welke AI?", a: "Intake bepaalt tool (ChatGPT/Claude e.d.) — privacy-instellingen inbegrepen." },
    ],
    upsellSlug: "excel-fix",
    relatedSlugs: ["digitale-opruiming", "spoed-hulp"],
  },
  "digitale-opruiming": {
    slug: "digitale-opruiming",
    korteTermijn: 3,
    tier: "deze-week",
    actiePrioriteit: 9,
    actieQuick: false,
    verkoopActief: true,
    pitch1Regel: "2 uur: mail, cloud, backup, wachtwoorden",
    pitchWhatsApp: `Hoi [NAAM], digitale chaos? Opruiming €249, 2 uur vast + checklist. ${bestel("digitale-opruiming")}`,
    faq: [
      { q: "Remote?", a: "Ja, remote of on-site in regio na afspraak." },
    ],
    upsellSlug: "ai-snelstart",
    relatedSlugs: ["spoed-hulp", "excel-fix"],
  },
  "excel-fix": {
    slug: "excel-fix",
    korteTermijn: 2,
    tier: "project",
    actiePrioriteit: 10,
    actieQuick: false,
    verkoopActief: true,
    pitch1Regel: "Excel-chaos → werkend sheet + uitlegvideo, €499",
    pitchWhatsApp: `Hoi [NAAM], uren/offertes in Excel? Automatisering €499, vaste scope na intake. ${bestel("excel-fix")}`,
    faq: [
      { q: "Google Sheets?", a: "Ja — vaak Sheets + Apps Script; scope in intake." },
    ],
    upsellSlug: "onderhoud",
    relatedSlugs: ["digitale-opruiming", "ai-snelstart"],
  },
  "website-veilig": {
    slug: "website-veilig",
    korteTermijn: 2,
    tier: "op-verzoek",
    actiePrioriteit: 99,
    actieQuick: false,
    verkoopActief: false,
    pitch1Regel: "Alleen met toestemming — HTTPS, headers, panelen dicht",
    pitchWhatsApp: `Hoi [NAAM], na uw toestemming: beveiligingsfix Website Veilig €299. Geen scare-mail. ${bestel("website-veilig")}`,
    faq: [
      { q: "Scannen jullie zomaar?", a: "Nee — alleen met expliciete toestemming. VakScan-verkoop staat niet op /actie/." },
    ],
    upsellSlug: "content-refresh",
    relatedSlugs: ["onderhoud", "seo-starter"],
  },
  onderhoud: {
    slug: "onderhoud",
    korteTermijn: 2,
    tier: "doorlopend",
    actiePrioriteit: 11,
    actieQuick: false,
    verkoopActief: true,
    pitch1Regel: "€49/mnd — tekst, updates, backup (1–2 uur)",
    pitchWhatsApp: `Hoi [NAAM], na oplevering: onderhoud €49/mnd, maandelijks opzegbaar. ${bestel("onderhoud")}`,
    faq: [
      { q: "Elke site?", a: "Vooral sites die wij bouwden of al beheren — intake even checken." },
    ],
    relatedSlugs: ["content-refresh", "vakman-site"],
  },
};

export function getDienstMeta(slug: string): DienstVerkoopMeta | undefined {
  return dienstVerkoopMeta[slug];
}

export function actieQuickDiensten(): { dienst: OnlineDienst; meta: DienstVerkoopMeta }[] {
  return diensten
    .map((d) => {
      const meta = dienstVerkoopMeta[d.slug];
      if (!meta?.actieQuick || !meta.verkoopActief) return null;
      return { dienst: d, meta };
    })
    .filter((x): x is { dienst: OnlineDienst; meta: DienstVerkoopMeta } => Boolean(x))
    .sort((a, b) => a.meta.actiePrioriteit - b.meta.actiePrioriteit);
}

export function dienstenPerTier(): Record<InstapTier, OnlineDienst[]> {
  const tiers: InstapTier[] = ["vandaag", "deze-week", "project", "doorlopend", "op-verzoek"];
  const out = Object.fromEntries(tiers.map((t) => [t, [] as OnlineDienst[]])) as Record<
    InstapTier,
    OnlineDienst[]
  >;
  for (const d of diensten) {
    const meta = dienstVerkoopMeta[d.slug];
    if (meta) out[meta.tier].push(d);
  }
  return out;
}

export const tierLabels: Record<InstapTier, { label: string; sub: string }> = {
  vandaag: { label: "Vandaag", sub: "Laagste drempel — warm netwerk" },
  "deze-week": { label: "Deze week", sub: "SEO, Google, listings, AI" },
  project: { label: "Project", sub: "Site, landing, Excel" },
  doorlopend: { label: "Doorlopend", sub: "Na oplevering" },
  "op-verzoek": { label: "Op verzoek", sub: "Geen cold outreach" },
};