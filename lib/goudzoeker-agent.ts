import { doelMijlpalen, hoofddoel } from "@/data/doel";
import {
  berekenSlagingskans,
  type KpiInput,
  type KpiScore,
  type SlagingsResultaat,
} from "@/data/monitoring";
import { merk, whatsappBerichten } from "@/data/verkoop";
import { kiesAgentDoel } from "@/lib/goudzoeker-doelen";
import type { GoudTip } from "@/lib/goudzoeker";

export type AgentBericht = {
  id: string;
  van: "agent" | "user";
  tekst: string;
  acties?: AgentActie[];
};

export type AgentActie = {
  label: string;
  type: "link" | "copy" | "quick";
  href?: string;
  copy?: string;
  vraag?: string;
};

export type AgentContext = {
  kpi: KpiInput;
  tip: GoudTip;
  slagings: SlagingsResultaat;
  laagsteKpi: KpiScore;
  reden: string;
  monitorIngevuld: boolean;
};

export function bouwAgentContext(
  kpi: KpiInput,
  monitorIngevuld = true
): AgentContext {
  const slagings = berekenSlagingskans(kpi);
  const laagsteKpi = [...slagings.kpiScores].sort((a, b) => a.score - b.score)[0]!;
  const { tip, reden } = kiesAgentDoel(kpi, monitorIngevuld);

  return { kpi, tip, slagings, laagsteKpi, reden, monitorIngevuld };
}

export const snelleVragen = [
  "Wat moet ik nu doen?",
  "Weekplan",
  "WhatsApp hulp",
  "Waar ligt het goud?",
] as const;

function brutaleStatus(slagings: SlagingsResultaat): string {
  if (slagings.totaal < 35) return "Je cijfers schreeuwen om actie. Niet om medelijden.";
  if (slagings.totaal < 55) return "Middelmatig. Geld komt niet uit comfort.";
  if (slagings.totaal < 75) return "Het kan erger. Maar ook veel beter — als je nu beweegt.";
  return "Op koers. Saai worden is de volgende valkuil.";
}

function monitorWaarschuwing(ctx: AgentContext): string | null {
  if (ctx.monitorIngevuld) return null;
  return "⚠ Monitor leeg — ik reken met nullen. Vul /monitor/ in of mijn advies is gokwerk.";
}

function proactieveWaarschuwing(ctx: AgentContext): string {
  const monitor = monitorWaarschuwing(ctx);
  if (monitor) return monitor;
  return `**Waarom:** ${ctx.reden}`;
}

function huidigeMijlpaal(week: number) {
  if (week <= 2) return doelMijlpalen[0];
  if (week <= 6) return doelMijlpalen[1];
  if (week <= 10) return doelMijlpalen[2];
  return doelMijlpalen[3];
}

function kpiSamenvatting(ctx: AgentContext): string {
  const { kpi, slagings } = ctx;
  const omzetDoel = slagings.kpiScores.find((k) => k.id === "omzet")?.doel ?? "?";
  return [
    `Week ${slagings.week}/12 · Slagingskans ${slagings.totaal}% (${slagings.label})`,
    `Omzet: €${kpi.omzet} (verwacht €${omzetDoel})`,
    `Contacten deze week: ${kpi.contactenDezeWeek}/5`,
    `Bestellingen: ${kpi.bestellingen} · Sites geleverd: ${kpi.sitesGeleverd}/6`,
    `Reacties: ${kpi.reacties}/${kpi.contactenDezeWeek || "—"}`,
  ].join("\n");
}

const targetUitleg: Record<string, string> = {
  actie: "Actie — WhatsApps met demo-link, snelste cash.",
  verkoop: "Verkoopkit — bellen, scripts, sluiten.",
  webshop: "Webshop — link delen, passieve orders.",
  monitor: "Monitor — KPI's bijhouden en bijsturen.",
  dashboard: "Dashboard — totaaloverzicht.",
  ideeen: "Ideeën — nieuwe sporen verkennen.",
  listings: "Listings — Fiverr/Malt passief proberen.",
  configurator: "Configurator — hogere tickets samenstellen.",
};

function stapOpBasisVanKpi(ctx: AgentContext): string {
  const { laagsteKpi, kpi } = ctx;

  switch (laagsteKpi.id) {
    case "contacten":
      return `2. **${kpi.contactenDezeWeek}/5 contacten.** Open /actie/, 5 nummers, verstuur. Vandaag.`;
    case "omzet":
      return "2. Bel 3 warme leads. Scripts op /verkoop/. Omzet komt niet uit scrollen.";
    case "bestellingen":
      return `2. Deel webshop (${merk.webklaar}) op LinkedIn + 2 vakmannen. ${kpi.bestellingen} orders is te weinig.`;
    case "sites":
      return `2. **${kpi.sitesGeleverd}/6 sites.** Verkoop harder of sluit sneller. Maarten levert in 3 dagen.`;
    case "reacties":
      return `2. **${kpi.reacties}/${kpi.contactenDezeWeek} reacties.** Ander bericht of follow-up na 3 dagen (/verkoop/).`;
    default:
      return `2. ${ctx.tip.tekst}`;
  }
}

export function genereerGrokPrompt(ctx: AgentContext): string {
  const laagste = [...ctx.slagings.kpiScores].sort((a, b) => a.score - b.score).slice(0, 2);

  return `Jij bent de goudzoeker-agent voor WebKlaar (Mike + Maarten). Persoonlijkheid: associaal, brutaal, behulpzaam, slim, proactief. Geen smalltalk.

Doel: ${hoofddoel.label} (€${hoofddoel.bedrag}) in ${hoofddoel.deadline}.

HUIDIGE STATUS (monitor KPI):
${kpiSamenvatting(ctx)}

PRIORITEIT NU: ${ctx.tip.titel} (${ctx.tip.euro})
Reden: ${ctx.reden}
Link: ${ctx.tip.href}

ZWAKSTE KPI's:
${laagste.map((k) => `- ${k.label}: ${k.score}% — ${k.tip}`).join("\n")}

URGENTE ACTIES:
${ctx.slagings.acties.map((a) => `- ${a}`).join("\n") || "- Geen aparte alarmen"}

Geef Mike 3 brute maar uitvoerbare stappen voor vandaag. Verkopen > bouwen. WhatsApp > bellen > mail.`;
}

function stappenVoorNu(ctx: AgentContext): string {
  const { slagings, kpi } = ctx;
  const stappen: string[] = [];

  if (kpi.contactenDezeWeek < 5) {
    stappen.push(
      `1. **${kpi.contactenDezeWeek}/5 contacten.** Onder de lat. Open /actie/, plak 5 nummers, verstuur.`
    );
  } else {
    stappen.push("1. Contacten: check. Nu opvolgen en sluiten — praten betaalt geen factuur.");
  }

  stappen.push(stapOpBasisVanKpi(ctx));

  const mijlpaal = huidigeMijlpaal(slagings.week);
  stappen.push(`3. Week ${slagings.week}: ${mijlpaal.label} — ${mijlpaal.acties[0]}`);

  const monitor = monitorWaarschuwing(ctx);
  const intro = monitor ? `${monitor}\n\n` : "";

  return `${intro}${brutaleStatus(slagings)}\n\n**Prioriteit: ${ctx.tip.titel}**\n_${ctx.reden}_\n\n${stappen.join("\n\n")}\n\nPotentieel: **${ctx.tip.euro}**`;
}

function weekplanAntwoord(ctx: AgentContext): string {
  const mijlpaal = huidigeMijlpaal(ctx.slagings.week);
  const acties = mijlpaal.acties.map((a, i) => `${i + 1}. ${a}`).join("\n");

  return `Week ${ctx.slagings.week}/12. Geen nostalgie.\n\n**${mijlpaal.week} — ${mijlpaal.label}**\nFase-doel: €${mijlpaal.bedrag} · cumulatief €${mijlpaal.cumulatief}\n\n${acties}\n\nJouw cijfers nu: €${ctx.kpi.omzet} omzet · ${ctx.kpi.contactenDezeWeek}/5 contacten · ${ctx.kpi.sitesGeleverd}/6 sites.\n\n5 contacten/week is de hefboom. Mis je die, mis je alles.`;
}

function whatsappHulp(ctx: AgentContext): string {
  const { kpi } = ctx;
  let berichtId: string;
  let uitleg: string;

  if (kpi.contactenDezeWeek === 0) {
    berichtId = "cold-1";
    uitleg = "0 contacten. De week begint niet vanzelf. Koud, kort, versturen.";
  } else if (kpi.reacties === 0) {
    berichtId = "cold-2";
    uitleg = `Contacten (${kpi.contactenDezeWeek}) zonder reactie — verkeerd bericht of geen demo.`;
  } else if (kpi.reacties < kpi.contactenDezeWeek) {
    berichtId = "followup";
    uitleg = `Stilte bij ${kpi.contactenDezeWeek - kpi.reacties} contact(en). Follow-up na 3 dagen.`;
  } else {
    berichtId = "close";
    uitleg = "Interesse. Sluit nu af. Uitstellen is geld weggooien.";
  }

  const bericht = whatsappBerichten.find((b) => b.id === berichtId)!;

  return `${uitleg}\n\n**${bericht.label}**\n_Wanneer: ${bericht.wanneer}_\n\n${bericht.tekst.replace(/\[DEMO-LINK\]/g, merk.demo)}\n\n→ /actie/ heeft kant-en-klare links.`;
}

function waarLigtGoud(ctx: AgentContext): string {
  const { tip, slagings } = ctx;
  const urgent =
    slagings.acties.length > 0
      ? "Rood:\n" + slagings.acties.map((a) => `• ${a}`).join("\n")
      : "Geen apart alarm — stilstand is ook een keuze.";

  return `Op basis van je monitor:\n\n**${tip.titel}** (${tip.euro})\n${tip.tekst}\n\n→ ${targetUitleg[tip.target] ?? tip.target}\n\n_${ctx.reden}_\n\nSlagingskans ${slagings.totaal}% (${slagings.label}). ${brutaleStatus(slagings)}\n\n${urgent}`;
}

function vrijeVraag(vraag: string, ctx: AgentContext): string {
  const q = vraag.toLowerCase();

  if (/whatsapp|contact|bellen|bericht|nummer/.test(q)) {
    return whatsappHulp(ctx) + "\n\nNa elke batch: contacten op /monitor/ bijwerken.";
  }
  if (/omzet|geld|ruggen|verdien|cash|factuur/.test(q)) {
    const tekort = hoofddoel.bedrag - ctx.kpi.omzet;
    const verwacht = ctx.slagings.kpiScores.find((k) => k.id === "omzet")?.doel ?? 0;
    return `€${ctx.kpi.omzet} van €${hoofddoel.bedrag} (weekdoel nu: €${verwacht}). Nog €${tekort} te gaan.\n\nSnelste pad: 6× Vakman Site (€899) = €5.400.\n\n${stappenVoorNu(ctx)}`;
  }
  if (/site|lever|maarten|bouwen|klant/.test(q)) {
    return `${ctx.kpi.sitesGeleverd}/6 sites geleverd.\n\nMaarten bouwt in 3 dagen. Jij verkoopt. Bij ja: intake via /actie/ → Grok.\n\nDemo: ${merk.demo}`;
  }
  if (/bestel|webshop|order|online/.test(q)) {
    return `${ctx.kpi.bestellingen} bestellingen totaal.\n\nHomepage: ${merk.webklaar}\n\n${ctx.kpi.bestellingen === 0 ? "Nul orders — webshop zonder traffic is een poster." : "Doorzetten + opvolgen binnen 24u."}`;
  }
  if (/grok|intake|agent/.test(q)) {
    return `Klant zegt ja → intake op /actie/ → plak in Grok.\n\nDieper advies: **Kopieer voor Grok** — volledige KPI-context inbegrepen.`;
  }
  if (/monitor|kpi|score|slagings|status/.test(q)) {
    return `${brutaleStatus(ctx.slagings)}\n\n${kpiSamenvatting(ctx)}\n\n${ctx.slagings.kpiScores.map((k) => `• ${k.label}: ${k.score}% (${k.status}) — ${k.tip}`).join("\n")}`;
  }
  if (/hoi|hey|hallo|dag|dank|bedankt|leuk/.test(q)) {
    return `Geen smalltalk. Ik ben hier voor €10k.\n\n${proactieveWaarschuwing(ctx)}\n\n${stappenVoorNu(ctx)}`;
  }

  return `Ik lees je monitor en duw je hierheen:\n\n${waarLigtGoud(ctx)}\n\nSnelle knoppen hieronder. Of **Kopieer voor Grok**.`;
}

export function welkomBericht(ctx: AgentContext): AgentBericht {
  const { tip, slagings } = ctx;
  const monitor = monitorWaarschuwing(ctx);
  const intro = monitor ? `${monitor}\n\n` : "Je bent binnen. Geen gezwam.\n\n";

  return {
    id: "welkom",
    van: "agent",
    tekst: `${intro}**${tip.titel}** — ${tip.tekst}\nPotentieel: **${tip.euro}**\n\n${kpiSamenvatting(ctx)}\n\nSlagingskans **${slagings.totaal}%** (${slagings.label}). ${brutaleStatus(slagings)}\n\n${proactieveWaarschuwing(ctx)}`,
    acties: [
      { label: "Wat nu?", type: "quick", vraag: "Wat moet ik nu doen?" },
      { label: "→ " + tip.titel, type: "link", href: tip.href },
      ...(ctx.monitorIngevuld
        ? []
        : [{ label: "→ Monitor invullen", type: "link" as const, href: "/monitor/" }]),
      { label: "Kopieer voor Grok", type: "copy", copy: genereerGrokPrompt(ctx) },
    ],
  };
}

export function beantwoord(
  vraag: string,
  ctx: AgentContext,
  bestaandeIds: string[]
): AgentBericht {
  const id = `msg-${bestaandeIds.length}-${Date.now()}`;
  let tekst: string;
  let acties: AgentActie[] | undefined;

  const norm = vraag.trim().toLowerCase();

  if (norm === "wat moet ik nu doen?" || norm === "wat nu?") {
    tekst = stappenVoorNu(ctx);
    acties = [
      { label: "→ " + ctx.tip.titel, type: "link", href: ctx.tip.href },
      { label: "→ Monitor", type: "link", href: "/monitor/" },
    ];
  } else if (norm === "weekplan") {
    tekst = weekplanAntwoord(ctx);
    acties = [{ label: "→ Verkoop", type: "link", href: "/verkoop/" }];
  } else if (norm === "whatsapp hulp" || norm === "whatsapp") {
    tekst = whatsappHulp(ctx);
    acties = [{ label: "→ Actie", type: "link", href: "/actie/" }];
  } else if (norm === "waar ligt het goud?" || norm === "goud") {
    tekst = waarLigtGoud(ctx);
    acties = [{ label: "→ " + ctx.tip.titel, type: "link", href: ctx.tip.href }];
  } else if (norm === "kopieer voor grok" || norm === "grok") {
    tekst = "Gekopieerd. Plak in Grok — KPI-context zit erin.";
    acties = [{ label: "Kopieer opnieuw", type: "copy", copy: genereerGrokPrompt(ctx) }];
  } else {
    tekst = vrijeVraag(vraag, ctx);
    acties = [
      { label: "Kopieer voor Grok", type: "copy", copy: genereerGrokPrompt(ctx) },
    ];
  }

  return { id, van: "agent", tekst, acties };
}

export function userBericht(tekst: string, bestaandeIds: string[]): AgentBericht {
  return {
    id: `user-${bestaandeIds.length}-${Date.now()}`,
    van: "user",
    tekst,
  };
}