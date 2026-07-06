export type DoelMijlpaal = {
  id: string;
  week: string;
  label: string;
  bedrag: number;
  cumulatief: number;
  acties: string[];
  ideeIds: string[];
};

export type DoelBron = {
  id: string;
  label: string;
  stuks: number;
  perStuk: number;
  totaal: number;
  ideeId: string;
  wie: string;
};

export const hoofddoel = {
  bedrag: 10_000,
  label: "10 ruggen",
  sub: "Eerste doel · €10.000 omzet",
  deadline: "12 weken",
  split: "50/50 Mike & Maarten = €5.000 elk",
  realistisch:
    "Geen SaaS-wachten. Mix van sites, kluswerk, pakketten en upsells — alles wat jullie al kunnen leveren.",
};

export const doelBronnen: DoelBron[] = [
  {
    id: "sites",
    label: "Website verkopen",
    stuks: 6,
    perStuk: 900,
    totaal: 5_400,
    ideeId: "site-verkopen",
    wie: "Mike verkoopt · Maarten kloont",
  },
  {
    id: "zoncomfort",
    label: "ZonComfort kluswerk",
    stuks: 1,
    perStuk: 1_000,
    totaal: 1_000,
    ideeId: "werk-uren",
    wie: "Samen · factureren",
  },
  {
    id: "google",
    label: "Google-pakket",
    stuks: 4,
    perStuk: 299,
    totaal: 1_196,
    ideeId: "google-pakket",
    wie: "Upsell na site of los",
  },
  {
    id: "opruiming",
    label: "Digitale opruiming",
    stuks: 4,
    perStuk: 249,
    totaal: 996,
    ideeId: "digitaal-opruimen",
    wie: "Mike netwerk · Maarten remote",
  },
  {
    id: "excel",
    label: "Excel automatisering",
    stuks: 2,
    perStuk: 500,
    totaal: 1_000,
    ideeId: "excel-automatisering",
    wie: "Maarten bouwt · Mike verkoopt",
  },
  {
    id: "upsell",
    label: "Renovatie + digitaal",
    stuks: 3,
    perStuk: 149,
    totaal: 447,
    ideeId: "renovatie-plus-digitaal",
    wie: "Mike na elke klus",
  },
];

export const doelMijlpalen: DoelMijlpaal[] = [
  {
    id: "m1",
    week: "Week 1–2",
    label: "Eerste cash",
    bedrag: 1_500,
    cumulatief: 1_500,
    acties: [
      "Tarief ZonComfort afspreken (€800–1.000)",
      "Demo-site klaar + 5 installateurs bellen",
      "1× digitale opruiming of Google-pakket",
    ],
    ideeIds: ["werk-uren", "site-verkopen", "digitaal-opruimen"],
  },
  {
    id: "m2",
    week: "Week 3–6",
    label: "Momentum",
    bedrag: 3_500,
    cumulatief: 5_000,
    acties: [
      "2–3 sites leveren (€900/stuk)",
      "Bij elke site: onderhoud €49/mnd aanbieden",
      "2× Google-pakket upsell",
    ],
    ideeIds: ["site-verkopen", "google-pakket", "onderhoud"],
  },
  {
    id: "m3",
    week: "Week 7–10",
    label: "Doorpakken",
    bedrag: 3_000,
    cumulatief: 8_000,
    acties: [
      "Nog 2–3 sites + 1 Excel-klus",
      "Renovatie-upsells (3× €149)",
      "Platform-gig of freelance klus (50/50)",
    ],
    ideeIds: ["site-verkopen", "excel-automatisering", "mike-verkoopt"],
  },
  {
    id: "m4",
    week: "Week 11–12",
    label: "10 ruggen",
    bedrag: 2_000,
    cumulatief: 10_000,
    acties: [
      "Laatste site(s) + opruimingen",
      "Recurring telt mee als bonus (niet in €10k)",
      "Evalueren: wat schaalt door?",
    ],
    ideeIds: ["site-verkopen", "digitaal-opruimen", "onderhoud"],
  },
];

export const doelWekelijks = [
  { metric: "Contacten", doel: "5/week", wie: "Mike" },
  { metric: "Sites leveren", doel: "0,5/week (= 6 in 12 wk)", wie: "Maarten" },
  { metric: "Upsell bij oplevering", doel: "100%", wie: "Mike" },
  { metric: "Levertijd", doel: "≤ 3 dagen", wie: "Maarten" },
];