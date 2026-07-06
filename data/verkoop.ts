export type VerkoopPakket = {
  id: string;
  naam: string;
  prijs: string;
  prijsNum: number;
  levertijd: string;
  voor: string;
  bullets: string[];
  upsell?: string;
};

export type VerkoopBericht = {
  id: string;
  label: string;
  kanaal: "whatsapp" | "mail" | "bellen";
  tekst: string;
  wanneer: string;
};

export const merk = {
  naam: "WebKlaar",
  tagline: "Moderne site voor vakmannen — live in 3 dagen",
  wie: "Mike Visser + Maarten (opdevlugt-tech)",
  contact: "Mike belt/app — Maarten bouwt",
  demo: "https://mikevisser0904.github.io/OFFERTE-WIJS/demo/",
  webklaar: "https://mikevisser0904.github.io/OFFERTE-WIJS/webklaar/",
};

export const pakketten: VerkoopPakket[] = [
  {
    id: "google",
    naam: "Google Start",
    prijs: "€299",
    prijsNum: 299,
    levertijd: "2 dagen",
    voor: "Vakman zonder Google-profiel of met slechte reviews",
    bullets: [
      "Google Business-profiel compleet",
      "Simpele one-pager met telefoon + WhatsApp-knop",
      "Review-verzoek template voor klanten",
      "Korte uitleg: zelf bijhouden",
    ],
    upsell: "Onderhoud €49/mnd",
  },
  {
    id: "site",
    naam: "Vakman Site",
    prijs: "€899",
    prijsNum: 899,
    levertijd: "3 dagen",
    voor: "Installateur/zonwering/kozijnen met verouderde of geen site",
    bullets: [
      "Moderne website (5 pagina's)",
      "Mobiel + snel",
      "Contactformulier + WhatsApp",
      "1 jaar hosting inbegrepen",
      "Optioneel: productconfigurator",
    ],
    upsell: "Onderhoud €49/mnd · Hosting €25/mnd",
  },
  {
    id: "opruiming",
    naam: "Digitale Opruiming",
    prijs: "€249",
    prijsNum: 249,
    levertijd: "1 dag",
    voor: "ZZP'er of winkelier met digitale chaos",
    bullets: [
      "2 uur: inbox, cloud, backup",
      "Wachtwoordmanager setup",
      "Handleiding achterlaten",
      "On-site of remote",
    ],
  },
  {
    id: "excel",
    naam: "Excel Fix",
    prijs: "€499",
    prijsNum: 499,
    levertijd: "1 week",
    voor: "Bedrijf dat alles in Excel doet (uren, offertes, voorraad)",
    bullets: [
      "Intake: welk probleem?",
      "Werkend sheet of mini-tool",
      "Korte uitlegvideo",
      "Vaste scope — geen maatwerk-hel",
    ],
  },
];

export const whatsappBerichten: VerkoopBericht[] = [
  {
    id: "cold-1",
    label: "Eerste contact (koud)",
    kanaal: "whatsapp",
    wanneer: "Dag 1 — iemand uit netwerk",
    tekst: `Hoi [NAAM], Mike hier. Ik ben bezig met sites voor vakbedrijven — modern, snel, geen bureau-prijs.

Ik heb een demo klaarstaan voor zonwering/kozijnen. Ziet er strak uit op mobiel.

Heb jij 5 minuten deze week? Dan laat ik je zien wat het voor jouw bedrijf kan zijn. Geen verplichtingen.`,
  },
  {
    id: "cold-2",
    label: "Met demo-link",
    kanaal: "whatsapp",
    wanneer: "Als ze 'ja' of 'stuur maar' zeggen",
    tekst: `Top! Hier de demo: [DEMO-LINK]

Dit is een voorbeeld — met jouw logo, kleuren en teksten wordt het van jou.

Pakketten:
• Google Start — €299 (2 dagen)
• Vakman Site — €899 (3 dagen, hosting 1 jaar)

Wat past het beste bij jullie? Dan maak ik een voorstel op maat.`,
  },
  {
    id: "followup",
    label: "Follow-up (3 dagen)",
    kanaal: "whatsapp",
    wanneer: "Geen reactie na 3 dagen",
    tekst: `Hoi [NAAM], even checken — heb je de demo gezien?

Veel vakmannen verliezen klanten omdat concurrenten beter scoren op Google. Wij fixen dat in een paar dagen, vaste prijs.

Interesse in 10 min bellen? Anders laat ik je met rust 👍`,
  },
  {
    id: "close",
    label: "Afsluiten",
    kanaal: "whatsapp",
    wanneer: "Ze zijn geïnteresseerd",
    tekst: `Mooi! Dan pakken we het zo aan:

1. Jij stuurt logo + teksten + telefoonnummer
2. Wij leveren binnen [X] dagen
3. Betaling bij oplevering (of 50% vooraf, 50% bij live)

Akkoord? Dan starten we maandag.`,
  },
  {
    id: "referral",
    label: "Referral vragen",
    kanaal: "whatsapp",
    wanneer: "Na tevreden klant",
    tekst: `Blij dat het bevalt! Nog 1 vraag: ken jij 1–2 collega-vakmannen die ook een betere site of Google-profiel kunnen gebruiken?

Als ze klant worden, krijg jij €50 korting op je volgende onderhoud. Win-win.`,
  },
];

export const mailTemplates: VerkoopBericht[] = [
  {
    id: "mail-intro",
    label: "Intro mail",
    kanaal: "mail",
    wanneer: "Formeel contact (bedrijven met @-mail)",
    tekst: `Onderwerp: Moderne website voor [BEDRIJF] — live in 3 dagen

Beste [NAAM],

Ik ben Mike Visser. Samen met een developer bouw ik moderne websites voor installateurs en vakbedrijven — zonder bureau-tarieven.

Wat we leveren:
• Vakman Site — €899 (5 pagina's, mobiel, hosting 1 jaar)
• Google Start — €299 (profiel + one-pager)

Demo: [DEMO-LINK]

Heeft u 15 minuten voor een korte call? Dan kijk ik wat past.

Met vriendelijke groet,
Mike Visser
[TELEFOON]`,
  },
];

export const belScript = {
  titel: "Belformulier (5 minuten)",
  stappen: [
    {
      fase: "Open",
      tekst: `"Hoi [NAAM], Mike. Kort bellen — ik help vakbedrijven met een moderne site en Google-profiel. Geen verkooppraatje, gewoon even kijken of het past. Stoor ik?"`,
    },
    {
      fase: "Vraag",
      tekst: `"Hoe krijgen klanten jullie nu? Via Google, mond-tot-mond, of Werkspot?" → Luister.`,
    },
    {
      fase: "Pijn",
      tekst: `"Veel concurrenten hebben een strakke site en goede reviews. Kost jullie dat klanten?" → Ja = door.`,
    },
    {
      fase: "Oplossing",
      tekst: `"Wij leveren in 3 dagen, vaste prijs €899. Inclusief hosting. Ik stuur je een demo — 2 minuten kijken."`,
    },
    {
      fase: "Close",
      tekst: `"Zal ik je de demo appen? Dan bel ik over 2 dagen even terug." → Altijd vervolgstap.`,
    },
  ],
};

export const bezwaren: { vraag: string; antwoord: string }[] = [
  {
    vraag: "Te duur",
    antwoord:
      "Een bureau rekent €3.000–5.000. Wij €899 omdat we een template hebben — zelfde kwaliteit, minder uren. En je verdient 1 klant terug.",
  },
  {
    vraag: "Geen tijd",
    antwoord:
      "Jij stuurt logo + teksten, wij doen de rest. Jouw tijd: 30 minuten. Wij leveren in 3 dagen.",
  },
  {
    vraag: "Ik heb al een site",
    antwoord:
      "Werkt die op mobiel? Scoort hij op Google? Zo niet: Google Start €299 — alleen profiel + one-pager.",
  },
  {
    vraag: "Ik moet erover nadenken",
    antwoord:
      "Logisch. Ik stuur de demo — geen druk. Mag ik over 3 dagen even terugbellen?",
  },
  {
    vraag: "Kunnen jullie maatwerk?",
    antwoord:
      "Vaste pakketten = snelle levering + vaste prijs. Extra wensen: apart offerte, maar basis pakt 90% van vakmannen.",
  },
];

export const verkoopWeek = [
  { dag: "Ma", actie: "5 WhatsApps (cold-1)", wie: "Mike", doel: "2 reacties" },
  { dag: "Di", actie: "Demo-link sturen (cold-2)", wie: "Mike", doel: "1 call" },
  { dag: "Wo", actie: "Bellen wie reageerde", wie: "Mike", doel: "1 voorstel" },
  { dag: "Do", actie: "Site klaarzetten voor geïnteresseerde", wie: "Maarten", doel: "demo klaar" },
  { dag: "Vr", actie: "Follow-up (followup)", wie: "Mike", doel: "1 ja" },
];