import { doelMijlpalen, hoofddoel } from "@/data/doel";
import { berekenSlagingskans, type KpiInput } from "@/data/monitoring";
import { merk, whatsappBerichten } from "@/data/verkoop";
import { kiesActiefGoudDoel } from "@/lib/goudzoeker-doelen";
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
  slagings: ReturnType<typeof berekenSlagingskans>;
};

export function bouwAgentContext(kpi: KpiInput): AgentContext {
  return {
    kpi,
    tip: kiesActiefGoudDoel(kpi),
    slagings: berekenSlagingskans(kpi),
  };
}

export const snelleVragen = [
  "Wat moet ik nu doen?",
  "Weekplan",
  "WhatsApp hulp",
  "Waar ligt het goud?",
] as const;

/** Associaal, brutaal — maar behulpzaam, slim en proactief. Geen smalltalk. */
function brutaleStatus(slagings: AgentContext["slagings"]): string {
  if (slagings.totaal < 35) return "Je cijfers schreeuwen om actie. Niet om medelijden.";
  if (slagings.totaal < 55) return "Middelmatig. Geld komt niet uit comfort.";
  if (slagings.totaal < 75) return "Het kan erger. Maar ook veel beter — als je nu beweegt.";
  return "Op koers. Saai worden is de volgende valkuil.";
}

function proactieveWaarschuwing(ctx: AgentContext): string {
  const laagste = [...ctx.slagings.kpiScores].sort((a, b) => a.score - b.score)[0];
  if (!laagste || laagste.score >= 70) {
    return ctx.kpi.contactenDezeWeek < 5
      ? `Ik zie ${ctx.kpi.contactenDezeWeek}/5 contacten. Dat fix je vandaag — niet morgen.`
      : "Contacten oké. Nu sluiten en factureren.";
  }
  return `Zwakste schakel: **${laagste.label}** (${laagste.score}%). ${laagste.tip}`;
}

function huidigeMijlpaal(week: number) {
  if (week <= 2) return doelMijlpalen[0];
  if (week <= 6) return doelMijlpalen[1];
  if (week <= 10) return doelMijlpalen[2];
  return doelMijlpalen[3];
}

function kpiSamenvatting(ctx: AgentContext): string {
  const { kpi, slagings } = ctx;
  return [
    `Week ${slagings.week}/12 · Slagingskans ${slagings.totaal}% (${slagings.label})`,
    `Omzet: €${kpi.omzet} (verwacht €${slagings.kpiScores.find((k) => k.id === "omzet")?.doel ?? "?"})`,
    `Contacten deze week: ${kpi.contactenDezeWeek}/5`,
    `Bestellingen: ${kpi.bestellingen} · Sites geleverd: ${kpi.sitesGeleverd}/6`,
    `Reacties: ${kpi.reacties}`,
  ].join("\n");
}

export function genereerGrokPrompt(ctx: AgentContext): string {
  const { tip, slagings } = ctx;
  const laagste = [...slagings.kpiScores].sort((a, b) => a.score - b.score).slice(0, 2);

  return `Jij bent de goudzoeker-agent voor WebKlaar (Mike + Maarten). Persoonlijkheid: **associaal, brutaal, behulpzaam, slim, proactief**. Geen smalltalk, geen "hoi", geen complimenten zonder reden. Wel harde waarheid + concrete stappen.

Doel: ${hoofddoel.label} (€${hoofddoel.bedrag}) in ${hoofddoel.deadline}.

HUIDIGE STATUS:
${kpiSamenvatting(ctx)}

GOUDZOEKER WIJST NAAR: ${tip.titel} (${tip.euro}) — ${tip.tekst}
Link: ${tip.href}

ZWAKSTE KPI's:
${laagste.map((k) => `- ${k.label}: ${k.score}% — ${k.tip}`).join("\n")}

ACTIES UIT MONITOR:
${slagings.acties.map((a) => `- ${a}`).join("\n") || "- Geen urgente acties"}

Geef Mike 3 brute maar uitvoerbare stappen voor vandaag. Focus op verkopen, niet bouwen. WhatsApp > bellen > mail.`;
}

function stappenVoorNu(ctx: AgentContext): string {
  const { tip, slagings, kpi } = ctx;
  const stappen: string[] = [];

  if (kpi.contactenDezeWeek < 5) {
    stappen.push(
      `1. **${kpi.contactenDezeWeek}/5 contacten.** Onder de lat. Open /actie/, plak 5 nummers, verstuur. Geen excuus.`
    );
  } else {
    stappen.push("1. Contacten: check. Nu opvolgen en sluiten — praten betaalt geen factuur.");
  }

  if (tip.target === "verkoop" || slagings.kpiScores.find((k) => k.id === "omzet")!.score < 50) {
    stappen.push("2. Bel 3 warme leads. Scripts op /verkoop/. Twijfelen = weggeven aan concurrent.");
  } else if (tip.target === "webshop") {
    stappen.push("2. Webshop-link op LinkedIn + 2 vakmannen. Passief wachten is geen strategie.");
  } else if (tip.target === "monitor") {
    stappen.push("2. KPI's bijwerken op /monitor/ na elke actie. Blind lopen = dom.");
  } else {
    stappen.push(`2. ${tip.tekst}`);
  }

  const mijlpaal = huidigeMijlpaal(slagings.week);
  stappen.push(`3. Week ${slagings.week}: ${mijlpaal.label} — ${mijlpaal.acties[0]}`);

  return `${brutaleStatus(slagings)}\n\n**Vandaag: ${tip.titel}**\n\n${stappen.join("\n\n")}\n\nPotentieel: **${tip.euro}**`;
}

function weekplanAntwoord(ctx: AgentContext): string {
  const mijlpaal = huidigeMijlpaal(ctx.slagings.week);
  const acties = mijlpaal.acties.map((a, i) => `${i + 1}. ${a}`).join("\n");

  return `Week ${ctx.slagings.week}. Geen nostalgie.\n\n**${mijlpaal.week} — ${mijlpaal.label}**\nFase-doel: €${mijlpaal.bedrag} · cumulatief €${mijlpaal.cumulatief}\n\n${acties}\n\n5 contacten/week is geen wens — het is de hefboom. Mis je die, mis je alles.`;
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
    uitleg = "Contacten zonder reactie = verkeerd bericht of geen demo. Fix het.";
  } else if (kpi.reacties < kpi.contactenDezeWeek) {
    berichtId = "followup";
    uitleg = "Stilte na 3 dagen? Follow-up. Niet stalken — wel duidelijk zijn.";
  } else {
    berichtId = "close";
    uitleg = "Interesse. Sluit nu af. Uitstellen is geld weggooien.";
  }

  const bericht = whatsappBerichten.find((b) => b.id === berichtId)!;

  return `${uitleg}\n\n**${bericht.label}**\n_Wanneer: ${bericht.wanneer}_\n\n${bericht.tekst.replace(/\[DEMO-LINK\]/g, merk.demo)}\n\n→ /actie/ heeft kant-en-klare links. Kopieer, verstuur, klaar.`;
}

function waarLigtGoud(ctx: AgentContext): string {
  const { tip, slagings } = ctx;
  const targets: Record<string, string> = {
    actie: "Actie-pagina — WhatsApps versturen is de snelste cash.",
    verkoop: "Verkoopkit — bellen en scripts voor warme leads.",
    webshop: "Webshop — iemand bestelt = direct omzet zonder gesprek.",
    monitor: "Monitor — je loopt op koers, houd tempo en upsell.",
  };

  const urgent =
    slagings.acties.length > 0
      ? "Rood:\n" + slagings.acties.map((a) => `• ${a}`).join("\n")
      : "Geen alarm — maar stilstand is ook een keuze.";

  return `Het goud ligt hier:\n\n**${tip.titel}** (${tip.euro})\n${tip.tekst}\n\n→ **${targets[tip.target] ?? tip.target}**\n\nSlagingskans ${slagings.totaal}% — ${slagings.label}. ${brutaleStatus(slagings)}\n\n${urgent}`;
}

function vrijeVraag(vraag: string, ctx: AgentContext): string {
  const q = vraag.toLowerCase();

  if (/whatsapp|contact|bellen|bericht|nummer/.test(q)) {
    return whatsappHulp(ctx) + "\n\nNa elke batch: contacten op /monitor/ bijwerken. Anders lieg je tegen jezelf.";
  }
  if (/omzet|geld|ruggen|verdien|cash|factuur/.test(q)) {
    const tekort = hoofddoel.bedrag - ctx.kpi.omzet;
    return `€${ctx.kpi.omzet} van €${hoofddoel.bedrag}. Nog €${tekort} te gaan — niet theoretisch, echt.\n\nSnelste pad: 6× Vakman Site (€899) = €5.400. Rest: Google-pakketten, opruiming, upsells.\n\n${stappenVoorNu(ctx)}`;
  }
  if (/site|lever|maarten|bouwen|klant/.test(q)) {
    return `${ctx.kpi.sitesGeleverd}/6 sites geleverd. ${ctx.kpi.sitesGeleverd < 3 ? "Te weinig verkocht of te traag gesloten." : "Levering loopt."}\n\nMaarten bouwt in 3 dagen. Jij verkoopt. Bij ja: intake via /actie/ → Grok.\n\nDemo: ${merk.demo}`;
  }
  if (/bestel|webshop|order|online/.test(q)) {
    return `${ctx.kpi.bestellingen} bestellingen. ${ctx.kpi.bestellingen === 0 ? "Nul. Webshop alleen werkt niet zonder traffic." : "Doorzetten."}\n\nHomepage: ${merk.webklaar}\n\nGeen orders? Persoonlijk contact via /actie/ — dat is je echte motor.`;
  }
  if (/grok|intake|agent/.test(q)) {
    return `Klant zegt ja → intake op /actie/ → plak in Grok. Wij klonen demo met logo + tekst.\n\nDieper advies: **Kopieer voor Grok**. Ik geef je de cijfers, jij voert uit.`;
  }
  if (/monitor|kpi|score|slagings/.test(q)) {
    return `${brutaleStatus(ctx.slagings)}\n\n${kpiSamenvatting(ctx)}\n\n${ctx.slagings.kpiScores.map((k) => `• ${k.label}: ${k.score}% (${k.status}) — ${k.tip}`).join("\n")}`;
  }
  if (/hoi|hey|hallo|dag|dank|bedankt|leuk|leuker/.test(q)) {
    return `Geen smalltalk. Ik ben hier voor €10k.\n\n${proactieveWaarschuwing(ctx)}\n\n${stappenVoorNu(ctx)}`;
  }

  return `Onduidelijke vraag. Ik lees je cijfers en duw je de goede kant op:\n\n${waarLigtGoud(ctx)}\n\nSnelle knoppen hieronder. Of **Kopieer voor Grok** voor maatwerk.`;
}

export function welkomBericht(ctx: AgentContext): AgentBericht {
  const { tip, slagings } = ctx;

  return {
    id: "welkom",
    van: "agent",
    tekst: `Je bent binnen. Geen gezwam.\n\n**${tip.titel}** — ${tip.tekst}\nPotentieel: **${tip.euro}**\n\nSlagingskans **${slagings.totaal}%** (${slagings.label}). ${brutaleStatus(slagings)}\n\n${proactieveWaarschuwing(ctx)}`,
    acties: [
      { label: "Wat nu?", type: "quick", vraag: "Wat moet ik nu doen?" },
      { label: tip.target === "actie" ? "→ Actie" : "→ Doel", type: "link", href: tip.href },
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
      { label: "→ Actie", type: "link", href: "/actie/" },
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
    tekst = "Gekopieerd. Plak in Grok en voer uit — ik praat niet voor niks.";
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