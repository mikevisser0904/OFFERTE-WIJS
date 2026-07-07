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
  categorie: "website" | "digitaal" | "automatisering";
};

export const webklaar = {
  naam: "WebKlaar",
  tagline: "Websites & digitaal voor vakmannen",
  sub: "AI + developers. Vaste prijs. Live in dagen, niet maanden.",
  url: "https://mikevisser0904.github.io/OFFERTE-WIJS/",
  demo: "https://mikevisser0904.github.io/OFFERTE-WIJS/demo/",
  telefoon: "0627362142",
  telefoonDisplay: "06 - 27 36 21 42",
  whatsapp: "31627362142",
  email: "mikevisser0904@gmail.com",
  usps: [
    "Vaste prijs — geen verrassingen",
    "Live in 1–3 dagen",
    "Speciaal voor vakmannen & zzp",
    "Betaling bij oplevering",
  ],
};

export const diensten: OnlineDienst[] = [
  {
    slug: "vakman-site",
    naam: "Vakman Website",
    prijs: "€899",
    prijsNum: 899,
    levertijd: "3 werkdagen",
    korteOms: "Moderne site met 5 pagina's, mobiel, WhatsApp-knop.",
    beschrijving:
      "Professionele website voor installateurs, zonwering, kozijnen en andere vakbedrijven. Wij bouwen op basis van een bewezen template — uw logo, kleuren en teksten. Inclusief 1 jaar hosting.",
    bullets: [
      "5 pagina's (home, diensten, over, projecten, contact)",
      "Mobiel-first, snelle laadtijd",
      "WhatsApp + contactformulier",
      "1 jaar hosting inbegrepen",
      "Optioneel: offerte-configurator",
    ],
    voorWie: "Vakbedrijf zonder moderne site of met verouderde pagina",
    populair: true,
    categorie: "website",
  },
  {
    slug: "website-veilig",
    naam: "Website Veilig",
    prijs: "€299",
    prijsNum: 299,
    levertijd: "2 werkdagen",
    korteOms: "HTTPS, headers, login afschermen, database-check fix.",
    beschrijving:
      "Na een VakScan-rapport: wij dichten de grootste gaten. SSL/redirect, beveiligings-headers, WordPress-hardening of verwijderen van per ongeluk openstaande beheerpanelen. Geen penetratietest — wel de fixes die 90% van vakman-sites nodig heeft.",
    bullets: [
      "HTTPS + http→https redirect",
      "Security headers (HSTS, clickjack-bescherming)",
      "WordPress-login afschermen of updates",
      "Check op open database-beheer (.env, phpMyAdmin-paden)",
      "Kort rapport na fix",
    ],
    voorWie: "Vakman met rode VakScan-score of zichtbare lekken",
    populair: false,
    categorie: "website",
  },
  {
    slug: "google-start",
    naam: "Google Start Pakket",
    prijs: "€299",
    prijsNum: 299,
    levertijd: "2 werkdagen",
    korteOms: "Google Business + one-pager + review-template.",
    beschrijving:
      "Voor vakmannen die vooral op Google gevonden willen worden. Wij zetten uw Google Business-profiel op, maken een simpele landingspagina en geven u een template om reviews te verzamelen.",
    bullets: [
      "Google Business volledig ingericht",
      "One-pager met telefoon & WhatsApp",
      "Review-verzoek voor klanten",
      "Handleiding zelf bijhouden",
    ],
    voorWie: "ZZP'er of winkel zonder goed Google-profiel",
    populair: true,
    categorie: "website",
  },
  {
    slug: "digitale-opruiming",
    naam: "Digitale Opruiming",
    prijs: "€249",
    prijsNum: 249,
    levertijd: "1 dag",
    korteOms: "2 uur: inbox, cloud, backup, wachtwoorden.",
    beschrijving:
      "Geen website nodig — wij ruimen uw digitale rommel op. E-mail structureren, cloud koppelen, backup checken, wachtwoordmanager installeren. Remote of on-site.",
    bullets: [
      "Vast pakket 2 uur",
      "Inbox + cloud + backup",
      "Wachtwoordmanager",
      "Handleiding achterlaten",
    ],
    voorWie: "ZZP'er of winkelier met digitale chaos",
    categorie: "digitaal",
  },
  {
    slug: "excel-fix",
    naam: "Excel Automatisering",
    prijs: "€499",
    prijsNum: 499,
    levertijd: "1 week",
    korteOms: "Van Excel-chaos naar werkend systeem.",
    beschrijving:
      "Uren, offertes of voorraad in Excel? Wij bouwen een werkende oplossing — Google Sheet met scripts of mini-app. Vaste scope, vaste prijs.",
    bullets: [
      "Intake: welk probleem?",
      "Werkend sheet of tool",
      "Uitlegvideo",
      "Geen eindeloos maatwerk",
    ],
    voorWie: "Klein bedrijf dat alles in Excel doet",
    categorie: "automatisering",
  },
  {
    slug: "ai-snelstart",
    naam: "AI Snelstart",
    prijs: "€199",
    prijsNum: 199,
    levertijd: "3 dagen",
    korteOms: "ChatGPT + 10 prompts voor offertes en mail.",
    beschrijving:
      "AI werkt voor u — niet andersom. Wij zetten uw account op, schrijven branche-specifieke prompts (offertes, klantmail, social) en geven 1 uur uitleg.",
    bullets: [
      "Account + instellingen",
      "10 kant-en-klare prompts",
      "1 uur Zoom-uitleg",
      "PDF-handleiding",
    ],
    voorWie: "Ondernemer die met AI wil starten",
    categorie: "digitaal",
  },
  {
    slug: "onderhoud",
    naam: "Website Onderhoud",
    prijs: "€49/mnd",
    prijsNum: 49,
    levertijd: "Doorlopend",
    korteOms: "Tekst wijzigen, updates, backup — per maand.",
    beschrijving:
      "Site die wij bouwden? Wij houden hem bij. Tekst en foto's aanpassen, security updates, backup. Geen nieuwe features — wel rust.",
    bullets: [
      "Tekst & foto wijzigingen",
      "Updates & backup",
      "Max 1–2 uur/maand",
      "Geen lange contracten",
    ],
    voorWie: "Klant met bestaande WebKlaar-site",
    categorie: "website",
  },
];

export function getDienst(slug: string): OnlineDienst | undefined {
  return diensten.find((d) => d.slug === slug);
}

export const seoKeywords = [
  "website vakman",
  "website installateur",
  "google business vakman",
  "goedkope website zzp",
  "website zonwering",
  "website binnen 3 dagen",
];