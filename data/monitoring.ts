import { hoofddoel } from "@/data/doel";
import { diensten, webklaar } from "@/data/diensten-online";

export type KpiInput = {
  omzet: number;
  bestellingen: number;
  contactenDezeWeek: number;
  /** Alle internetdiensten: SEO, Google, site, listings, … */
  sitesGeleverd: number;
  reacties: number;
  startDatum: string;
};

export const defaultKpi: KpiInput = {
  omzet: 0,
  bestellingen: 0,
  contactenDezeWeek: 0,
  sitesGeleverd: 0,
  reacties: 0,
  startDatum: new Date().toISOString().slice(0, 10),
};

export type KpiScore = {
  id: string;
  label: string;
  huidig: number;
  doel: number;
  eenheid: string;
  score: number;
  status: "goed" | "let-op" | "actie";
  tip: string;
};

export type SlagingsResultaat = {
  totaal: number;
  label: string;
  kleur: "emerald" | "amber" | "rose";
  kpiScores: KpiScore[];
  acties: string[];
  week: number;
};

const WEKEN = 12;
const CONTACTEN_PER_WEEK = 5;
/** Mix: SEO, Google, listings, sites, spoed, … */
const OPDRACHTEN_DOEL = 8;

/** Weekfocus — wat je meet tegen de catalogus */
export const monitorVerkoopLadder = [
  { slug: "spoed-hulp", label: "Spoed €50", instap: true },
  { slug: "listings-setup", label: "Listings €149", instap: true },
  { slug: "seo-starter", label: "SEO Starter €199", instap: true },
  { slug: "google-start", label: "Google Start €299", instap: true },
  { slug: "landing-snel", label: "Landing €349", instap: false },
  { slug: "vakman-site", label: "Vakman site €899", instap: false },
] as const;

export const monitorLinks = {
  actie: `${webklaar.url}actie/`,
  verkoop: `${webklaar.url}verkoop/`,
  diensten: `${webklaar.url}diensten/`,
  bestellen: `${webklaar.url}bestellen/`,
} as const;

export function dienstPrijs(slug: string): string {
  return diensten.find((d) => d.slug === slug)?.prijs ?? "—";
}

export function berekenWeek(startDatum: string): number {
  const start = new Date(startDatum);
  const nu = new Date();
  const dagen = Math.floor((nu.getTime() - start.getTime()) / 86400000);
  return Math.min(WEKEN, Math.max(1, Math.ceil(dagen / 7)));
}

export function verwachteOmzet(week: number): number {
  if (week <= 2) return 1500;
  if (week <= 6) return 5000;
  if (week <= 10) return 8000;
  return 10000;
}

function status(score: number): "goed" | "let-op" | "actie" {
  if (score >= 70) return "goed";
  if (score >= 40) return "let-op";
  return "actie";
}

export function berekenSlagingskans(kpi: KpiInput): SlagingsResultaat {
  const week = berekenWeek(kpi.startDatum);
  const verwacht = verwachteOmzet(week);

  const omzetScore = Math.min(100, (kpi.omzet / verwacht) * 100);
  const contactenScore = Math.min(100, (kpi.contactenDezeWeek / CONTACTEN_PER_WEEK) * 100);
  const bestellingScore = Math.min(100, kpi.bestellingen > 0 ? 50 + kpi.bestellingen * 25 : 0);
  const opdrachtenScore = Math.min(100, (kpi.sitesGeleverd / OPDRACHTEN_DOEL) * 100);
  const reactieScore =
    kpi.contactenDezeWeek > 0
      ? Math.min(100, (kpi.reacties / kpi.contactenDezeWeek) * 100)
      : 0;

  const kpiScores: KpiScore[] = [
    {
      id: "omzet",
      label: "Omzet vs plan",
      huidig: kpi.omzet,
      doel: verwacht,
      eenheid: "€",
      score: Math.round(omzetScore),
      status: status(omzetScore),
      tip:
        omzetScore < 40
          ? "Push instap: Spoed €50, Listings €149, SEO €199 — /actie/ dienstenmenu"
          : "Upsell: Landing €349 of Onderhoud €49/mnd na levering",
    },
    {
      id: "contacten",
      label: "Contacten deze week",
      huidig: kpi.contactenDezeWeek,
      doel: CONTACTEN_PER_WEEK,
      eenheid: "",
      score: Math.round(contactenScore),
      status: status(contactenScore),
      tip: "5× WhatsApp met /show/ of /diensten/ link — teller op /actie/",
    },
    {
      id: "bestellingen",
      label: "Bestellingen (totaal)",
      huidig: kpi.bestellingen,
      doel: 6,
      eenheid: "",
      score: Math.round(bestellingScore),
      status: status(bestellingScore),
      tip:
        kpi.bestellingen === 0
          ? `Deel ${monitorLinks.diensten} — SEO Starter en Google Start zijn de snelste ja's`
          : "Noteer welk pakket (slug) — opvolgen binnen 24u via /verkoop/ close-script",
    },
    {
      id: "sites",
      label: "Opdrachten geleverd",
      huidig: kpi.sitesGeleverd,
      doel: OPDRACHTEN_DOEL,
      eenheid: "",
      score: Math.round(opdrachtenScore),
      status: status(opdrachtenScore),
      tip: "Tel elk afgerond pakket: SEO, listings, Google, site, spoed, Excel, …",
    },
    {
      id: "reacties",
      label: "Reacties op contacten",
      huidig: kpi.reacties,
      doel: kpi.contactenDezeWeek || 1,
      eenheid: "",
      score: Math.round(reactieScore),
      status: status(reactieScore),
      tip: reactieScore < 40 ? "Follow-up — /verkoop/ · pakket uit dienstenmenu" : "Goed bezig",
    },
  ];

  const totaal = Math.round(
    omzetScore * 0.35 +
      contactenScore * 0.25 +
      bestellingScore * 0.2 +
      opdrachtenScore * 0.15 +
      reactieScore * 0.05
  );

  const acties: string[] = [];
  kpiScores
    .filter((k) => k.status === "actie")
    .forEach((k) => acties.push(k.tip));
  if (acties.length === 0 && totaal < 60) {
    acties.push("Verhoog contacten naar 5/week — deel internetdiensten op /actie/");
  }
  if (kpi.bestellingen === 0 && kpi.contactenDezeWeek >= 3) {
    acties.push("Je hebt reacties-kans: stuur dienstenmenu + bestel-link uit /verkoop/");
  }
  if (kpi.omzet < verwacht * 0.5 && week >= 3) {
    acties.push(`Achter op schema: €${verwacht - kpi.omzet} — focus instap-pakketten (€50–€299)`);
  }

  let label = "Op koers";
  let kleur: SlagingsResultaat["kleur"] = "emerald";
  if (totaal < 40) {
    label = "Actie nodig";
    kleur = "rose";
  } else if (totaal < 65) {
    label = "Let op";
    kleur = "amber";
  }

  return { totaal, label, kleur, kpiScores, acties, week };
}

export const monitorUitleg = {
  titel: "Slagingskans · internetdiensten",
  sub: `${hoofddoel.label} (${hoofddoel.deadline}) — KPI's gekoppeld aan /diensten/ catalogus`,
  opslag: "Data lokaal in je browser. Export → npm run kpi:snapshot — team op GitHub Pages.",
  week1Hint:
    "Week 1: 0% is normaal zolang je nog geen contacten logt. Na 5× /actie/ vul je hier contacten deze week — dan klopt de score.",
};