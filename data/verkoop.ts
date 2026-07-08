import {
  categorieMeta,
  diensten,
  dienstenByCategorie,
  webklaar,
  type DienstCategorie,
  type OnlineDienst,
} from "@/data/diensten-online";

export type VerkoopPakket = {
  id: string;
  naam: string;
  prijs: string;
  prijsNum: number;
  levertijd: string;
  voor: string;
  bullets: string[];
  upsell?: string;
  categorie: DienstCategorie;
  bestelUrl: string;
};

export type VerkoopBericht = {
  id: string;
  label: string;
  kanaal: "whatsapp" | "mail" | "bellen";
  tekst: string;
  wanneer: string;
};

const bestel = (slug: string) => `${webklaar.url}bestellen/?dienst=${slug}`;

function naarPakket(d: OnlineDienst): VerkoopPakket {
  let upsell: string | undefined;
  if (d.slug === "google-start") upsell = "SEO Starter €199 · Onderhoud €49/mnd";
  if (d.slug === "seo-starter") upsell = "Google Start €299 · meer landings later";
  if (d.slug === "vakman-site") upsell = "Onderhoud €49/mnd · Content Refresh €149";
  if (d.slug === "landing-snel") upsell = "Later uitbreiden naar Vakman site €899";
  if (d.slug === "listings-setup") upsell = "Listings copy staat ook op /listings/";
  return {
    id: d.slug,
    naam: d.naam,
    prijs: d.prijs,
    prijsNum: d.prijsNum,
    levertijd: d.levertijd,
    voor: d.voorWie,
    bullets: d.bullets.slice(0, 5),
    upsell,
    categorie: d.categorie,
    bestelUrl: bestel(d.slug),
  };
}

/** Eén bron: diensten-catalogus */
export const pakketten: VerkoopPakket[] = diensten.map(naarPakket);

export const verkoopCatalogus = dienstenByCategorie().map((g) => ({
  ...g,
  pakketten: g.items.map(naarPakket),
}));

export const verkoopLinks = {
  demo: webklaar.demo,
  show: webklaar.show,
  diensten: `${webklaar.url}diensten/`,
  bestellen: `${webklaar.url}bestellen/`,
  actie: `${webklaar.url}actie/`,
  listings: `${webklaar.url}listings/`,
} as const;

export const merk = {
  naam: webklaar.naam,
  tagline: webklaar.tagline,
  wie: "Mike Visser + Maarten (opdevlugt-tech)",
  contact: "Mike belt/app — Maarten levert internetdiensten",
  telefoon: webklaar.telefoon,
  whatsapp: webklaar.whatsapp,
  email: webklaar.email,
  demo: webklaar.demo,
  show: webklaar.show,
  diensten: verkoopLinks.diensten,
  catalogus: verkoopLinks.diensten,
  /** @deprecated gebruik diensten of webklaar.url */
  webklaar: webklaar.url,
};

const prijsLadder = `Spoed €50 · Listings €149 · SEO €199 · Google €299 · Landing €349 · Site €899`;

export const whatsappBerichten: VerkoopBericht[] = [
  {
    id: "internet-kort",
    label: "Warm — internetdiensten kort",
    kanaal: "whatsapp",
    wanneer: "Eerste contact warm netwerk",
    tekst: `Hoi [NAAM], Mike (${merk.naam}).

${merk.tagline}
${prijsLadder}

Alles met vaste prijs: ${verkoopLinks.diensten}
Zin in 10 min bellen?`,
  },
  {
    id: "cold-2",
    label: "Met show + demo",
    kanaal: "whatsapp",
    wanneer: "Als ze 'ja' of 'stuur iets' zeggen",
    tekst: `Top [NAAM]!

2-min rondleiding: ${verkoopLinks.show}
Vakman-voorbeeld: ${verkoopLinks.demo}

Pakketten (online bestellen):
• SEO Starter — €199
• Google Start — €299
• Landing Snel — €349
• Vakman site — €899

Catalogus: ${verkoopLinks.diensten}
Wat past bij jullie?`,
  },
  {
    id: "diensten-menu",
    label: "Volledig dienstenmenu",
    kanaal: "whatsapp",
    wanneer: "ZZP/mkb die opties wil zien",
    tekst: `Hoi [NAAM],

Kort wat we nu leveren (vaste prijs):

SEO Starter €199 — Search Console + landings
Listings Setup €149 — Fiverr + Marktplaats teksten
Google Start €299 — profiel + one-pager
Landing Snel €349 — 1 campagnepagina
Spoed hulp €50 — 1 uur vandaag
Content Refresh €149 · Digitale Opruiming €249
AI Snelstart €199 · Excel €499 · Onderhoud €49/mnd
Website Veilig €299 — alleen op verzoek

Bestellen: ${verkoopLinks.bestellen}
Vragen: app/bel ${merk.telefoon}`,
  },
  {
    id: "vakscan",
    label: "Website Veilig (alleen na toestemming)",
    kanaal: "whatsapp",
    wanneer: "Alleen met toestemming / geen scare-outreach",
    tekst: `Hoi [NAAM], Mike van ${merk.naam}.

Na jullie toestemming hebben we jullie site bekeken. Belangrijkste punt: [RODE VLAG — bijv. geen HTTPS of open beheer].

Website Veilig €299 (2 dagen): HTTPS, headers, panelen dicht + kort rapport.

Meer diensten: ${verkoopLinks.diensten}
Zin in 10 min bellen?`,
  },
  {
    id: "followup",
    label: "Follow-up (3 dagen)",
    kanaal: "whatsapp",
    wanneer: "Geen reactie na 3 dagen",
    tekst: `Hoi [NAAM], even checken — heb je ${verkoopLinks.show} gezien?

Veel zzp'ers lopen klanten mis door zwakke Google/site. Wij fixen dat met vaste prijs — vaak vanaf €199 (SEO) of €299 (Google).

10 min bellen? Anders laat ik je met rust 👍`,
  },
  {
    id: "close",
    label: "Afsluiten",
    kanaal: "whatsapp",
    wanneer: "Ze kiezen een pakket",
    tekst: `Mooi [NAAM]! Dan zo:

1. Jij kiest pakket op ${verkoopLinks.bestellen} (of ik stuur je de juiste link)
2. Logo/teksten/toegang — afhankelijk van pakket
3. 50% vooraf (Tikkie) → rest bij oplevering

Welk pakket wordt het? Dan starten we.`,
  },
  {
    id: "referral",
    label: "Referral vragen",
    kanaal: "whatsapp",
    wanneer: "Na tevreden klant",
    tekst: `Blij dat het bevalt! Ken jij 1–2 ondernemers die SEO, Google of een betere site kunnen gebruiken?

Stuur ze ${verkoopLinks.show} — bij klant word jij €50 korting op onderhoud.`,
  },
];

export const mailTemplates: VerkoopBericht[] = [
  {
    id: "mail-intro",
    label: "Intro mail (internetdiensten)",
    kanaal: "mail",
    wanneer: "Formeel contact (@-mail)",
    tekst: `Onderwerp: Online zichtbaarheid voor [BEDRIJF] — vaste prijs

Beste [NAAM],

Ik ben Mike Visser (${merk.naam}). Wij leveren internetdiensten voor zzp en mkb — zonder agency-tarieven.

Populair:
• SEO Starter — €199 (Search Console + landings)
• Google Start — €299 (profiel + one-pager)
• Vakman Website — €899 (5 pagina's + hosting 1 jaar)

Catalogus: ${verkoopLinks.diensten}
Korte tour: ${verkoopLinks.show}

Heeft u 15 minuten voor een call?

Met vriendelijke groet,
Mike Visser
${merk.telefoon}`,
  },
  {
    id: "mail-seo",
    label: "Mail SEO Starter",
    kanaal: "mail",
    wanneer: "Site bestaat maar Google matig",
    tekst: `Onderwerp: SEO Starter €199 voor [BEDRIJF]

Beste [NAAM],

Uw site staat live maar wordt weinig gevonden? Met SEO Starter zetten wij de technische basis: Google Search Console, sitemap en meerdere landingspagina's (regio/vak).

Vaste prijs €199 · 3 werkdagen.
Bestellen: ${bestel("seo-starter")}

Groet,
Mike · ${merk.naam}`,
  },
];

export const belScript = {
  titel: "Belformulier (5 minuten) — internetdiensten",
  stappen: [
    {
      fase: "Open",
      tekst: `"Hoi [NAAM], Mike van ${merk.naam}. Kort — wij doen internetdiensten met vaste prijs: Google, SEO, websites. Geen verkooppraatje. Stoor ik?"`,
    },
    {
      fase: "Vraag",
      tekst: `"Hoe vinden klanten je nu? Google, mond-tot-mond, Marktplaats?" → Luister.`,
    },
    {
      fase: "Pijn",
      tekst: `"Wat mist: Google-profiel, goede site, of vindbaarheid in de regio?" → Koppel aan SEO €199 of Google €299.`,
    },
    {
      fase: "Oplossing",
      tekst: `"Alles staat op ${verkoopLinks.diensten} — ik stuur je de show-link, 2 minuten. Spoed kan vandaag voor €50 als er iets vastloopt."`,
    },
    {
      fase: "Close",
      tekst: `"Zal ik je ${verkoopLinks.show} appen? Dan bel ik over 2 dagen terug met welk pakket past."`,
    },
  ],
};

export const bezwaren: { vraag: string; antwoord: string }[] = [
  {
    vraag: "Te duur",
    antwoord: `Bureau = duizenden euro's. Wij SEO €199, Google €299, site €899 omdat we templates en AI inzetten. Eén klant terugverdient het vaak.`,
  },
  {
    vraag: "Geen tijd",
    antwoord:
      "Listings €149: wij schrijven, jij plakt. Google Start: jij levert logo + tekst, 30 min van jou. Spoed €50: 1 uur en klaar.",
  },
  {
    vraag: "Ik heb al een site",
    antwoord: `SEO Starter €199 of Content Refresh €149. Of Google Start €299 als alleen het profiel zwak is. Zie ${verkoopLinks.diensten}`,
  },
  {
    vraag: "Ik moet erover nadenken",
    antwoord: `Logisch. Ik stuur ${verkoopLinks.show} — geen druk. Mag ik over 3 dagen terugbellen?`,
  },
  {
    vraag: "Kunnen jullie maatwerk?",
    antwoord:
      "12 vaste producten op de site — snel en voorspelbaar. Echt maatwerk alleen als apart project na intake.",
  },
  {
    vraag: "Wat is het goedkoopste?",
    antwoord: "Spoed €50 (1 uur) of Listings €149. Voor online groei: SEO €199, daarna Google €299.",
  },
];

export const verkoopWeek = [
  { dag: "Ma", actie: "5× WhatsApp (internet-kort)", wie: "Mike", doel: "2 reacties" },
  { dag: "Di", actie: "Show/diensten-menu sturen", wie: "Mike", doel: "1 call" },
  { dag: "Wo", actie: "Listings + Marktplaats eigen ad", wie: "Mike", doel: "1 lead" },
  { dag: "Do", actie: "Levering / intake bestelling", wie: "Maarten", doel: "1 pakket live" },
  { dag: "Vr", actie: "Follow-up + SEO/Google voorstel", wie: "Mike", doel: "1 ja" },
];

/** Legacy demo-link placeholder voor actie-panel */
export const DEMO_LINK_PLACEHOLDER = verkoopLinks.demo;