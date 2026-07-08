export type DienstCategorie = "zichtbaarheid" | "websites" | "automatisering" | "ai" | "abonnement";

export type OnlineDienst = {
  slug: string;
  naam: string;
  prijs: string;
  prijsNum: number;
  levertijd: string;
  korteOms: string;
  beschrijving: string;
  bullets: string[];
  voorWie: string;
  populair?: boolean;
  categorie: DienstCategorie;
  /** Kort: wat Mike+Maarten+AI tooling standaard levert */
  levering: string;
};

export const categorieMeta: Record<
  DienstCategorie,
  { label: string; sub: string; volgorde: number }
> = {
  zichtbaarheid: {
    label: "Online zichtbaarheid",
    sub: "Google, SEO, listings — gevonden worden",
    volgorde: 1,
  },
  websites: {
    label: "Websites & beveiliging",
    sub: "Sites, landings, fixes — professioneel online",
    volgorde: 2,
  },
  automatisering: {
    label: "Automatisering & opruiming",
    sub: "Excel, processen, digitale rust",
    volgorde: 3,
  },
  ai: {
    label: "AI & workflows",
    sub: "Prompts en hulp die u tijd besparen",
    volgorde: 4,
  },
  abonnement: {
    label: "Doorlopend",
    sub: "Onderhoud zonder gedoe",
    volgorde: 5,
  },
};

export const webklaar = {
  naam: "DoekoeWijs",
  tagline: "Internetdiensten — vaste prijs, snel live",
  sub: "Websites, Google, SEO, automatisering en AI voor zzp en mkb. Vakmannen zijn onze specialiteit — hetzelfde tempo geldt voor elk bedrijf.",
  url: "https://mikevisser0904.github.io/OFFERTE-WIJS/",
  demo: "https://mikevisser0904.github.io/OFFERTE-WIJS/demo/",
  show: "https://mikevisser0904.github.io/OFFERTE-WIJS/show/",
  telefoon: "0627362142",
  telefoonDisplay: "06 - 27 36 21 42",
  whatsapp: "31627362142",
  email: "mikevisser0904@gmail.com",
  usps: [
    "Vaste prijs — geen uurtje-factuurtje",
    "Live in 1–7 dagen (per pakket)",
    "AI-ondersteund bouwen, menselijke oplevering",
    "50% vooraf (Tikkie), rest bij oplevering",
  ],
};

/** Eén lijn voor bestellen, FAQ en actie */
export const betalingStandaard =
  "50% vooraf (Tikkie), rest bij oplevering. Spoed €50: volledig vooraf.";

export const diensten: OnlineDienst[] = [
  {
    slug: "google-start",
    naam: "Google Start",
    prijs: "€299",
    prijsNum: 299,
    levertijd: "2 werkdagen",
    korteOms: "Google Business + one-pager + review-template.",
    beschrijving:
      "Het instappakket voor online vindbaarheid: volledig Google Business-profiel, een snelle landingspagina met bellen/WhatsApp en templates om reviews te verzamelen.",
    bullets: [
      "Google Business ingericht",
      "One-pager met CTA (bellen/WhatsApp)",
      "Review-verzoek voor klanten",
      "Korte handleiding zelf bijhouden",
    ],
    voorWie: "ZZP, winkel of vakbedrijf zonder sterk Google-profiel",
    populair: true,
    categorie: "zichtbaarheid",
    levering: "Profiel + pagina in ons Next.js-template, live op hosting naar keuze",
  },
  {
    slug: "seo-starter",
    naam: "SEO Starter",
    prijs: "€199",
    prijsNum: 199,
    levertijd: "3 werkdagen",
    korteOms: "Search Console, sitemap en eerste landingspagina's.",
    beschrijving:
      "Technische basis voor organisch verkeer: site verifiëren in Google Search Console, sitemap indienen en meerdere SEO-landings (regio/vak) live zetten — hetzelfde systeem dat DoekoeWijs zelf gebruikt.",
    bullets: [
      "Google Search Console gekoppeld",
      "sitemap.xml + basis-indexering",
      "3–5 landingspagina's (regio of dienst)",
      "Korte rapportage wat live staat",
    ],
    voorWie: "Bedrijf met site die nog niet goed in Google staat",
    populair: true,
    categorie: "zichtbaarheid",
    levering: "Geautomatiseerde SEO-pipeline + handmatige GSC-check",
  },
  {
    slug: "listings-setup",
    naam: "Listings Setup",
    prijs: "€149",
    prijsNum: 149,
    levertijd: "1 werkdag",
    korteOms: "Fiverr + Marktplaats (en Malt) — teksten klaar, jij plaatst.",
    beschrijving:
      "Extra verkoopkanalen zonder agency-tarief. Wij leveren kant-en-klare gig-titels, omschrijvingen en profielteksten; u plaatst ze op Fiverr, Marktplaats of Malt (begeleiding inbegrepen).",
    bullets: [
      "Fiverr gig-tekst + packages",
      "Marktplaats advertentie",
      "Malt/LinkedIn-profielvariant",
      "15 min loop-through met Mike",
    ],
    voorWie: "Freelancer of bureau dat snel extra kanalen wil",
    populair: true,
    categorie: "zichtbaarheid",
    levering: "Copy uit ons listings-systeem + call",
  },
  {
    slug: "landing-snel",
    naam: "Landing Snel",
    prijs: "€349",
    prijsNum: 349,
    levertijd: "2 werkdagen",
    korteOms: "Eén sterke campagne- of dienstenpagina.",
    beschrijving:
      "Geen volledige site nodig: één conversiegerichte pagina (actie, product of regio) met mobiel design, formulier of WhatsApp en snelle laadtijd.",
    bullets: [
      "1 pagina, mobiel-first",
      "Hero + diensten + CTA + FAQ",
      "WhatsApp of formulier",
      "Deploy op uw domein of subdomein",
    ],
    voorWie: "Campagne, nieuw product of lokale dienst",
    populair: true,
    categorie: "websites",
    levering: "AI-ondersteund design + Maarten deploy",
  },
  {
    slug: "vakman-site",
    naam: "Vakman Website",
    prijs: "€899",
    prijsNum: 899,
    levertijd: "3 werkdagen",
    korteOms: "5 pagina's, mobiel, WhatsApp — inclusief 1 jaar hosting.",
    beschrijving:
      "Complete bedrijfssite voor installateurs, zonwering, kozijnen en andere vakbedrijven. Bewezen template met uw huisstijl — zie demo De Zonmeester.",
    bullets: [
      "5 pagina's (home, diensten, over, projecten, contact)",
      "Mobiel-first, snelle laadtijd",
      "WhatsApp + contactformulier",
      "1 jaar hosting inbegrepen",
    ],
    voorWie: "Vakbedrijf zonder moderne site",
    populair: true,
    categorie: "websites",
    levering: "Template clone + content van klant, binnen 3 dagen live",
  },
  {
    slug: "website-veilig",
    naam: "Website Veilig",
    prijs: "€299",
    prijsNum: 299,
    levertijd: "2 werkdagen",
    korteOms: "HTTPS, headers, open beheer dicht — na toestemming.",
    beschrijving:
      "Beveiligingspakket voor bestaande sites: SSL/redirect, headers, WordPress-hardening en dichten van per ongeluk open beheer — alleen met uw toestemming, geen scare-tactiek.",
    bullets: [
      "HTTPS + redirect",
      "Security headers",
      "Login/panelen afschermen",
      "Kort rapport na fix",
    ],
    voorWie: "Site met bekende kwetsbaarheden (op verzoek)",
    categorie: "websites",
    levering: "Check + fix door Maarten, rapport in NL",
  },
  {
    slug: "content-refresh",
    naam: "Content Refresh",
    prijs: "€149",
    prijsNum: 149,
    levertijd: "1 werkdag",
    korteOms: "Teksten, prijzen, foto's — site weer actueel.",
    beschrijving:
      "Uw site staat al live maar voelt oud? Wij werken tot 5 tekstblokken en 3 afbeeldingen bij, controleren links en knoppen en leveren binnen een dag.",
    bullets: [
      "Tot 5 tekstsecties",
      "Tot 3 foto's/afbeeldingen",
      "Links & contact gecontroleerd",
      "Geen redesign — wel fris",
    ],
    voorWie: "Bestaande site, geen tijd om zelf te knutselen",
    categorie: "websites",
    levering: "Snelle edits in bestaande codebase of CMS",
  },
  {
    slug: "spoed-hulp",
    naam: "Spoed digitale hulp",
    prijs: "€50",
    prijsNum: 50,
    levertijd: "Vandaag (1 uur)",
    korteOms: "1 uur vast — mail, site, Excel of PC.",
    beschrijving:
      "Acute digitale hulp: één uur, vast bedrag. Kies één scope (mail, kleine site-fix, Google-check, Excel-fix, PC-opruimen). Geen nieuwe site van scratch.",
    bullets: [
      "1 uur remote of op locatie (regio)",
      "Vast €50 — geen verrassingen",
      "Scope vooraf afgebakend",
      "Ideaal warm netwerk / spoed",
    ],
    voorWie: "Iemand die vandaag geholpen wil worden",
    categorie: "automatisering",
    levering: "Mike/Maarten — zie /spoed/ voor scopes",
  },
  {
    slug: "digitale-opruiming",
    naam: "Digitale Opruiming",
    prijs: "€249",
    prijsNum: 249,
    levertijd: "1 dag",
    korteOms: "2 uur: inbox, cloud, backup, wachtwoorden.",
    beschrijving:
      "Structuur in mail, cloud en wachtwoorden. Remote of on-site — met handleiding zodat het zo blijft.",
    bullets: ["Vast 2 uur", "Inbox + cloud + backup", "Wachtwoordmanager", "Handleiding"],
    voorWie: "ZZP of winkel met digitale chaos",
    categorie: "automatisering",
    levering: "Remote sessie + checklist PDF",
  },
  {
    slug: "excel-fix",
    naam: "Excel Automatisering",
    prijs: "€499",
    prijsNum: 499,
    levertijd: "1 week",
    korteOms: "Van Excel-chaos naar werkend systeem.",
    beschrijving:
      "Uren, offertes of voorraad in spreadsheets? Vaste scope: werkend Google Sheet of tool met uitlegvideo — geen eindeloos maatwerk.",
    bullets: ["Intake + scope", "Werkend sheet/tool", "Uitlegvideo", "Vaste prijs"],
    voorWie: "Klein bedrijf dat in Excel leeft",
    categorie: "automatisering",
    levering: "Maarten bouwt; intake met Mike",
  },
  {
    slug: "ai-snelstart",
    naam: "AI Snelstart",
    prijs: "€199",
    prijsNum: 199,
    levertijd: "3 dagen",
    korteOms: "Account + 10 prompts voor mail en offertes.",
    beschrijving:
      "Praktisch aan de slag met AI: account ingesteld, 10 branche-prompts (offertes, klantmail, social) en 1 uur uitleg — geen vaag consultantverhaal.",
    bullets: ["Account + privacy-instellingen", "10 prompts op maat", "1 uur uitleg", "PDF-handleiding"],
    voorWie: "Ondernemer die AI direct wil gebruiken",
    populair: true,
    categorie: "ai",
    levering: "Prompts + training; Mike levert intake",
  },
  {
    slug: "onderhoud",
    naam: "Website Onderhoud",
    prijs: "€49/mnd",
    prijsNum: 49,
    levertijd: "Doorlopend",
    korteOms: "Tekst, updates, backup — per maand.",
    beschrijving:
      "Site die wij bouwden of beheren: kleine wijzigingen, updates en backup. Max 1–2 uur per maand, maandelijks opzegbaar.",
    bullets: ["Tekst & foto", "Updates & backup", "1–2 uur/maand", "Geen lange contracten"],
    voorWie: "Klant met bestaande DoekoeWijs-site",
    categorie: "abonnement",
    levering: "Doorlopend Maarten + ticket via WhatsApp",
  },
];

export function getDienst(slug: string): OnlineDienst | undefined {
  return diensten.find((d) => d.slug === slug);
}

export function dienstenByCategorie(): { categorie: DienstCategorie; meta: (typeof categorieMeta)[DienstCategorie]; items: OnlineDienst[] }[] {
  const keys = (Object.keys(categorieMeta) as DienstCategorie[]).sort(
    (a, b) => categorieMeta[a].volgorde - categorieMeta[b].volgorde
  );
  return keys.map((categorie) => ({
    categorie,
    meta: categorieMeta[categorie],
    items: diensten.filter((d) => d.categorie === categorie),
  }));
}

export const seoKeywords = [
  "internetdiensten zzp",
  "website laten maken",
  "google business profiel",
  "seo starter pakket",
  "website vakman",
  "excel automatisering",
  "ai prompts ondernemer",
];