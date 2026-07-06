import { hoofddoel } from "@/data/doel";

export type KpiInput = {
  omzet: number;
  bestellingen: number;
  contactenDezeWeek: number;
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
const SITES_DOEL = 6;

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
  const sitesScore = Math.min(100, (kpi.sitesGeleverd / SITES_DOEL) * 100);
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
          ? "Bel 5 installateurs deze week — gebruik /actie/"
          : "Upsell onderhoud bij elke levering",
    },
    {
      id: "contacten",
      label: "Contacten deze week",
      huidig: kpi.contactenDezeWeek,
      doel: CONTACTEN_PER_WEEK,
      eenheid: "",
      score: Math.round(contactenScore),
      status: status(contactenScore),
      tip: "Minstens 5 WhatsApps — anders geen pipeline",
    },
    {
      id: "bestellingen",
      label: "Bestellingen (totaal)",
      huidig: kpi.bestellingen,
      doel: 6,
      eenheid: "",
      score: Math.round(bestellingScore),
      status: status(bestellingScore),
      tip: kpi.bestellingen === 0 ? "Deel bestel-link op LinkedIn / netwerk" : "Opvolgen binnen 24u",
    },
    {
      id: "sites",
      label: "Sites geleverd",
      huidig: kpi.sitesGeleverd,
      doel: SITES_DOEL,
      eenheid: "",
      score: Math.round(sitesScore),
      status: status(sitesScore),
      tip: "Lever binnen 3 dagen — snelheid = reviews",
    },
    {
      id: "reacties",
      label: "Reacties op contacten",
      huidig: kpi.reacties,
      doel: kpi.contactenDezeWeek || 1,
      eenheid: "",
      score: Math.round(reactieScore),
      status: status(reactieScore),
      tip: reactieScore < 40 ? "Follow-up na 3 dagen — zie verkoopkit" : "Goed bezig",
    },
  ];

  const totaal = Math.round(
    omzetScore * 0.35 +
      contactenScore * 0.25 +
      bestellingScore * 0.2 +
      sitesScore * 0.15 +
      reactieScore * 0.05
  );

  const acties: string[] = [];
  kpiScores
    .filter((k) => k.status === "actie")
    .forEach((k) => acties.push(k.tip));
  if (acties.length === 0 && totaal < 60) {
    acties.push("Verhoog contacten naar 5/week — dat is de hefboom");
  }
  if (kpi.omzet < verwacht * 0.5 && week >= 3) {
    acties.push(`Achter op schema: €${verwacht - kpi.omzet} achter op week ${week}`);
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
  titel: "Slagingskans-monitor",
  sub: `Continu bijhouden of jullie ${hoofddoel.label} halen (${hoofddoel.deadline})`,
  opslag: "Data wordt lokaal opgeslagen in je browser. Exporteer wekelijks voor Maarten.",
};