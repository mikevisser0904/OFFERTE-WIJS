import { berekenSlagingskans, defaultKpi, type KpiInput } from "@/data/monitoring";

export type GoudTip = {
  target: string;
  euro: string;
  titel: string;
  tekst: string;
  href: string;
};

const tips: Record<string, GoudTip> = {
  actie: {
    target: "actie",
    euro: "€750–1.200",
    titel: "Goud hier!",
    tekst: "5 WhatsApps met demo-link. Snelste cash deze week.",
    href: "/actie/",
  },
  contacten: {
    target: "actie",
    euro: "€899+",
    titel: "Te weinig contacten",
    tekst: "Geen contacten = geen goud. Plak nummers en klik Verstuur.",
    href: "/actie/",
  },
  omzet: {
    target: "verkoop",
    euro: "€10.000",
    titel: "Omzet achter",
    tekst: "Verkoopkit openen en vandaag 3 mensen bellen.",
    href: "/verkoop/",
  },
  bestellingen: {
    target: "webshop",
    euro: "€899",
    titel: "Nog geen orders",
    tekst: "Deel de webshop — iemand bestelt = direct goud.",
    href: "/",
  },
  sites: {
    target: "monitor",
    euro: "€5.400",
    titel: "Sites leveren",
    tekst: "6 sites = hoofddeel van 10 ruggen. Lever in 3 dagen.",
    href: "/monitor/",
  },
  default: {
    target: "actie",
    euro: "€899",
    titel: "Start hier",
    tekst: "De goudzoeker wijst altijd naar actie. Verkopen > bouwen.",
    href: "/actie/",
  },
};

export function waarLigtHetGeld(kpi: KpiInput = defaultKpi): GoudTip {
  const result = berekenSlagingskans(kpi);

  const laagste = [...result.kpiScores].sort((a, b) => a.score - b.score)[0];

  if (result.totaal >= 70) {
    return {
      target: "monitor",
      euro: "€10.000",
      titel: "Op koers!",
      tekst: "Houd tempo — upsell onderhoud bij elke levering.",
      href: "/monitor/",
    };
  }

  if (kpi.contactenDezeWeek < 3) return tips.contacten;
  if (laagste?.id === "omzet" && laagste.score < 50) return tips.omzet;
  if (kpi.bestellingen === 0 && result.week >= 2) return tips.bestellingen;
  if (laagste?.id === "sites" && kpi.sitesGeleverd < 2) return tips.sites;
  if (result.acties.length > 0) return tips.actie;

  return tips.default;
}

export const STORAGE_KEY = "webklaar-monitor-kpi";

export function laadKpi(): KpiInput {
  if (typeof window === "undefined") return defaultKpi;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultKpi;
    return { ...defaultKpi, ...JSON.parse(raw) };
  } catch {
    return defaultKpi;
  }
}