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
    "Internetdiensten-catalogus: SEO, Google, listings, sites, spoed, Excel — alles op /diensten/ verkoopbaar.",
};

export const doelBronnen: DoelBron[] = [
  {
    id: "sites",
    label: "Vakman / landing sites",
    stuks: 5,
    perStuk: 850,
    totaal: 4_250,
    ideeId: "site-verkopen",
    wie: "Mike verkoopt · Maarten levert",
  },
  {
    id: "seo-google",
    label: "SEO + Google Start",
    stuks: 8,
    perStuk: 250,
    totaal: 2_000,
    ideeId: "google-pakket",
    wie: "Instap via /actie/",
  },
  {
    id: "listings-spoed",
    label: "Listings + spoed",
    stuks: 10,
    perStuk: 100,
    totaal: 1_000,
    ideeId: "digitaal-opruimen",
    wie: "Warm netwerk",
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
    id: "opruiming",
    label: "Digitale opruiming",
    stuks: 3,
    perStuk: 249,
    totaal: 747,
    ideeId: "digitaal-opruimen",
    wie: "Mike netwerk",
  },
  {
    id: "excel",
    label: "Excel + AI",
    stuks: 2,
    perStuk: 350,
    totaal: 700,
    ideeId: "excel-automatisering",
    wie: "Maarten bouwt",
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
      "/actie/ — 5 WhatsApps, dienstenmenu",
      "2× spoed of listings of SEO",
      "1× Google Start of kleine site",
    ],
    ideeIds: ["site-verkopen", "google-pakket", "digitaal-opruimen"],
  },
  {
    id: "m2",
    week: "Week 3–6",
    label: "Momentum",
    bedrag: 3_500,
    cumulatief: 5_000,
    acties: [
      "Mix SEO/Google + 2 sites",
      "Listings live op Marktplaats",
      "Onderhoud €49/mnd upsell",
    ],
    ideeIds: ["site-verkopen", "google-pakket", "onderhoud"],
  },
  {
    id: "m3",
    week: "Week 7–10",
    label: "Doorpakken",
    bedrag: 3_000,
    cumulatief: 8_000,
    acties: ["Landing + vakman sites", "Excel/AI pakket", "Monitor KPI bijhouden"],
    ideeIds: ["site-verkopen", "excel-automatisering", "mike-verkoopt"],
  },
  {
    id: "m4",
    week: "Week 11–12",
    label: "10 ruggen",
    bedrag: 2_000,
    cumulatief: 10_000,
    acties: ["Laatste pakketten uit catalogus", "Evalueren: welk product schaalt"],
    ideeIds: ["site-verkopen", "digitaal-opruimen", "onderhoud"],
  },
];

export const doelWekelijks = [
  { metric: "Contacten", doel: "5/week", wie: "Mike · /actie/" },
  { metric: "Opdrachten geleverd", doel: "0,5–1/week", wie: "Maarten" },
  { metric: "Upsell bij oplevering", doel: "SEO/Listings/Onderhoud", wie: "Mike" },
  { metric: "Levertijd", doel: "Per pakket op /diensten/", wie: "Maarten" },
];