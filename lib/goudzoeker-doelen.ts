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

/** Deterministisch — alleen voor de agent-chat (geen random) */
export function kiesAgentDoel(kpi: KpiInput): {
  tip: GoudTip;
  reden: string;
} {
  const result = berekenSlagingskans(kpi);
  const laagste = [...result.kpiScores].sort((a, b) => a.score - b.score)[0]!;

  if (result.totaal >= 70) {
    return {
      tip: alleGoudDoelen.monitor,
      reden: `Slagingskans ${result.totaal}% — op koers. Houd tempo en upsell bij levering.`,
    };
  }
  if (kpi.contactenDezeWeek < 3) {
    return {
      tip: alleGoudDoelen.actie,
      reden: `${kpi.contactenDezeWeek}/5 contacten deze week — zonder pipeline geen omzet.`,
    };
  }
  if (laagste.id === "omzet" && laagste.score < 50) {
    return {
      tip: alleGoudDoelen.verkoop,
      reden: `Omzet €${kpi.omzet} vs verwacht €${laagste.doel} (week ${result.week}/12).`,
    };
  }
  if (kpi.bestellingen === 0 && result.week >= 2) {
    return {
      tip: alleGoudDoelen.webshop,
      reden: `Week ${result.week} en nog 0 bestellingen — webshop krijgt geen verkeer.`,
    };
  }
  if (laagste.id === "sites" && kpi.sitesGeleverd < 2) {
    return {
      tip: alleGoudDoelen.verkoop,
      reden: `${kpi.sitesGeleverd}/6 sites geleverd — te weinig verkocht of te traag gesloten.`,
    };
  }
  if (laagste.id === "reacties" && laagste.score < 50 && kpi.contactenDezeWeek > 0) {
    return {
      tip: alleGoudDoelen.verkoop,
      reden: `${kpi.reacties}/${kpi.contactenDezeWeek} reacties — bericht of follow-up faalt.`,
    };
  }
  if (laagste.id === "contacten") {
    return {
      tip: alleGoudDoelen.actie,
      reden: `${kpi.contactenDezeWeek}/5 contacten — onder de weekdoel.`,
    };
  }
  if (result.acties.length > 0) {
    return {
      tip: alleGoudDoelen.actie,
      reden: result.acties[0]!,
    };
  }

  return {
    tip: alleGoudDoelen.actie,
    reden: `Zwakste KPI: ${laagste.label} (${laagste.score}%).`,
  };
}

/** Mix: rond door alle hoeken, niet alleen actie */
export function kiesActiefGoudDoel(kpi: KpiInput): GoudTip {
  const roll = Math.random();

  if (roll < 0.55) return tipVoorTarget(volgendDoelUitRonde());
  if (roll < 0.8) return kpiGebaseerd(kpi);

  const randomId = RONDE_VOLGORDE[Math.floor(Math.random() * RONDE_VOLGORDE.length)]!;
  return tipVoorTarget(randomId);
}