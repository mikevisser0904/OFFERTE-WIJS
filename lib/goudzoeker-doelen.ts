import { berekenSlagingskans, type KpiInput } from "@/data/monitoring";
import type { GoudTip } from "@/lib/goudzoeker";

export type GoudTargetId =
  | "dashboard"
  | "monitor"
  | "webshop"
  | "actie"
  | "verkoop"
  | "listings"
  | "ideeen"
  | "configurator";

export const alleGoudDoelen: Record<GoudTargetId, GoudTip> = {
  dashboard: {
    target: "dashboard",
    euro: "€10.000",
    titel: "Commandocentrum",
    tekst: "Overzicht = overzicht over je ruggen.",
    href: "/dashboard/",
  },
  monitor: {
    target: "monitor",
    euro: "€5.400+",
    titel: "Monitor checken",
    tekst: "KPI's bijwerken — anders liegt de wiggelrode.",
    href: "/monitor/",
  },
  webshop: {
    target: "webshop",
    euro: "€899",
    titel: "Webshop vibes",
    tekst: "Iemand bestelt terwijl jij koffie drinkt.",
    href: "/",
  },
  actie: {
    target: "actie",
    euro: "€750–1.200",
    titel: "Actie (ook oké)",
    tekst: "WhatsApps — één van de vele goudaders.",
    href: "/actie/",
  },
  verkoop: {
    target: "verkoop",
    euro: "€899",
    titel: "Verkoopkit",
    tekst: "Scripts, prijzen, bellen — klassieker.",
    href: "/verkoop/",
  },
  listings: {
    target: "listings",
    euro: "€500+",
    titel: "Listings",
    tekst: "Fiverr/Malt — passief goud proberen.",
    href: "/marktplaats/",
  },
  ideeen: {
    target: "ideeen",
    euro: "€???",
    titel: "Ideeënbus",
    tekst: "Misschien zit de volgende rug hier.",
    href: "/ideeen/",
  },
  configurator: {
    target: "configurator",
    euro: "€899+",
    titel: "Configurator",
    tekst: "Mooi pakket samenstellen = hogere ticket.",
    href: "/configurator/",
  },
};

const RONDE_VOLGORDE: GoudTargetId[] = [
  "dashboard",
  "webshop",
  "verkoop",
  "monitor",
  "ideeen",
  "listings",
  "configurator",
  "actie",
];

export function tipVoorTarget(id: GoudTargetId): GoudTip {
  return alleGoudDoelen[id];
}

export function volgendDoelUitRonde(offset = 0): GoudTargetId {
  const slot = Math.floor((Date.now() + offset * 4000) / 11000);
  return RONDE_VOLGORDE[slot % RONDE_VOLGORDE.length]!;
}

function kpiGebaseerd(kpi: KpiInput): GoudTip {
  const result = berekenSlagingskans(kpi);
  const laagste = [...result.kpiScores].sort((a, b) => a.score - b.score)[0];

  if (result.totaal >= 70) return alleGoudDoelen.monitor;
  if (laagste?.id === "omzet" && laagste.score < 50) return alleGoudDoelen.verkoop;
  if (kpi.bestellingen === 0 && result.week >= 2) return alleGoudDoelen.webshop;
  if (laagste?.id === "sites" && kpi.sitesGeleverd < 2) return alleGoudDoelen.configurator;
  if (laagste?.id === "bestellingen") return alleGoudDoelen.webshop;
  if (laagste?.id === "contacten" && kpi.contactenDezeWeek < 5) return alleGoudDoelen.actie;

  const pool: GoudTargetId[] = ["verkoop", "webshop", "monitor", "ideeen", "dashboard"];
  return alleGoudDoelen[pool[result.week % pool.length]!]!;
}

/** Mix: rond door alle hoeken, niet alleen actie */
export function kiesActiefGoudDoel(kpi: KpiInput): GoudTip {
  const roll = Math.random();

  if (roll < 0.55) return tipVoorTarget(volgendDoelUitRonde());
  if (roll < 0.8) return kpiGebaseerd(kpi);

  const randomId = RONDE_VOLGORDE[Math.floor(Math.random() * RONDE_VOLGORDE.length)]!;
  return tipVoorTarget(randomId);
}