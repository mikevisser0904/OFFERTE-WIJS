import { doelMijlpalen, hoofddoel } from "@/data/doel";
import { berekenSlagingskans, type KpiInput } from "@/data/monitoring";
import { merk, whatsappBerichten } from "@/data/verkoop";
import { waarLigtHetGeld, type GoudTip } from "@/lib/goudzoeker";

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
    tip: waarLigtHetGeld(kpi),
    slagings: berekenSlagingskans(kpi),
  };
}

export const snelleVragen = [
  "Wat moet ik nu doen?",
  "Weekplan",
  "WhatsApp hulp",
  "Waar ligt het goud?",
] as const;

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

  return `Jij bent de verkoop-agent voor WebKlaar (Mike + Maarten). Doel: ${hoofddoel.label} (€${hoofddoel.bedrag}) in ${hoofddoel.deadline}.

HUIDIGE STATUS:
${kpiSamenvatting(ctx)}

GOUDZOEKER WIJST NAAR: ${tip.titel} (${tip.euro}) — ${tip.tekst}
Link: ${tip.href}

ZWAKSTE KPI's:
${laagste.map((k) => `- ${k.label}: ${k.score}% — ${k.tip}`).join("\n")}

ACTIES UIT MONITOR:
${slagings.acties.map((a) => `- ${a}`).join("\n") || "- Geen urgente acties"}

Geef Mike 3 concrete stappen voor vandaag (max 15 min lezen). Focus op verkopen, niet bouwen. WhatsApp > bellen > mail.`;
}

function stappenVoorNu(ctx: AgentContext): string {
  const { tip, slagings, kpi } = ctx;
  const stappen: string[] = [];

  if (kpi.contactenDezeWeek < 5) {
    stappen.push(
      `1. Open /actie/ — plak 5 namen + nummers en verstuur WhatsApps (nu: ${kpi.contactenDezeWeek}/5).`
    );
  } else {
    stappen.push("1. Contacten op orde — goed. Focus op opvolgen en sluiten.");
  }

  if (tip.target === "verkoop" || slagings.kpiScores.find((k) => k.id === "omzet")!.score < 50) {
    stappen.push("2. Bel 3 warme contacten vandaag — gebruik verkoopkit scripts.");
  } else if (tip.target === "webshop") {
    stappen.push("2. Deel webshop-link op LinkedIn + 2 vakmannen in je netwerk.");
  } else if (tip.target === "monitor") {
    stappen.push("2. Update monitor-KPI's na elke actie — anders wijst de goudzoeker verkeerd.");
  } else {
    stappen.push(`2. ${tip.tekst}`);
  }

  const mijlpaal = huidigeMijlpaal(slagings.week);
  stappen.push(`3. Weekdoel: ${mijlpaal.label} — ${mijlpaal.acties[0]}`);

  return `**Vandaag (${tip.titel})**\n\n${stappen.join("\n\n")}\n\nPotentieel: ${tip.euro}`;
}

function weekplanAntwoord(ctx: AgentContext): string {
  const mijlpaal = huidigeMijlpaal(ctx.slagings.week);
  const acties = mijlpaal.acties.map((a, i) => `${i + 1}. ${a}`).join("\n");

  return `**${mijlpaal.week} — ${mijlpaal.label}**\n\nDoel deze fase: €${mijlpaal.bedrag} (totaal €${mijlpaal.cumulatief})\n\n${acties}\n\nJij bent week ${ctx.slagings.week}. Houd 5 contacten/week vast — dat is de hefboom.`;
}

function whatsappHulp(ctx: AgentContext): string {
  const { kpi } = ctx;
  let berichtId: string;
  let uitleg: string;

  if (kpi.contactenDezeWeek === 0) {
    berichtId = "cold-1";
    uitleg = "Je hebt nog geen contacten deze week. Start met koud contact — kort en persoonlijk.";
  } else if (kpi.reacties === 0) {
    berichtId = "cold-2";
    uitleg = "Je hebt contacten maar geen reacties. Stuur de demo-link — dat is de converter.";
  } else if (kpi.reacties < kpi.contactenDezeWeek) {
    berichtId = "followup";
    uitleg = "Sommigen reageren niet. Follow-up na 3 dagen — geen druk, wel duidelijk.";
  } else {
    berichtId = "close";
    uitleg = "Er is interesse! Sluit af met concrete stappen en levertijd.";
  }

  const bericht = whatsappBerichten.find((b) => b.id === berichtId)!;

  return `**${bericht.label}**\n_Wanneer: ${bericht.wanneer}_\n\n${bericht.tekst.replace(/\[DEMO-LINK\]/g, merk.demo)}\n\n→ Gebruik /actie/ voor kant-en-klare links.`;
}

function waarLigtGoud(ctx: AgentContext): string {
  const { tip, slagings } = ctx;
  const targets: Record<string, string> = {
    actie: "Actie-pagina — WhatsApps versturen is de snelste cash.",
    verkoop: "Verkoopkit — bellen en scripts voor warme leads.",
    webshop: "Webshop — iemand bestelt = direct omzet zonder gesprek.",
    monitor: "Monitor — je loopt op koers, houd tempo en upsell.",
  };

  return `**${tip.titel}** (${tip.euro})\n\n${tip.tekst}\n\nIk wijs naar: **${targets[tip.target] ?? tip.target}**\n\nSlagingskans: ${slagings.totaal}% — ${slagings.label}.\n\n${slagings.acties.length > 0 ? "Urgent:\n" + slagings.acties.map((a) => `• ${a}`).join("\n") : "Geen rode vlaggen — blijf contacten maken."}`;
}

function vrijeVraag(vraag: string, ctx: AgentContext): string {
  const q = vraag.toLowerCase();

  if (/whatsapp|contact|bellen|bericht|nummer/.test(q)) {
    return whatsappHulp(ctx) + "\n\n**Tip:** Vul KPI 'contacten deze week' in op /monitor/ na elke batch.";
  }
  if (/omzet|geld|ruggen|verdien|cash|factuur/.test(q)) {
    return `Omzet nu: €${ctx.kpi.omzet} van €${hoofddoel.bedrag}.\n\nSnelste pad: 6× Vakman Site (€899) = €5.400. Rest: Google-pakketten, opruiming, upsells.\n\n${stappenVoorNu(ctx)}`;
  }
  if (/site|lever|maarten|bouwen|klant/.test(q)) {
    return `Sites geleverd: ${ctx.kpi.sitesGeleverd}/6.\n\nMaarten levert in 3 dagen. Jij verkoopt — bij ja: stuur klant-intake naar Grok via /actie/.\n\nDemo: ${merk.demo}`;
  }
  if (/bestel|webshop|order|online/.test(q)) {
    return `Bestellingen: ${ctx.kpi.bestellingen}.\n\nDeel de homepage (${merk.webklaar}) — elk pakket heeft WhatsApp + mail bestelflow.\n\nGeen orders na week 2? Focus op persoonlijk contact via /actie/.`;
  }
  if (/grok|intake|agent/.test(q)) {
    return `Bij ja van klant: kopieer intake op /actie/ en plak in Grok-chat. Wij klonen de demo met logo + teksten.\n\nWil je dieper advies? Gebruik **Kopieer voor Grok** — dan krijg ik je volledige KPI-context.`;
  }
  if (/monitor|kpi|score|slagings/.test(q)) {
    return kpiSamenvatting(ctx) + "\n\n" + ctx.slagings.kpiScores.map((k) => `• ${k.label}: ${k.score}% (${k.status})`).join("\n");
  }

  return `Ik snap je vraag. Op basis van je cijfers:\n\n${waarLigtGoud(ctx)}\n\nStel een van de snelle vragen, of kopieer context naar Grok voor maatwerk.`;
}

export function welkomBericht(ctx: AgentContext): AgentBericht {
  const { tip, slagings } = ctx;

  return {
    id: "welkom",
    van: "agent",
    tekst: `Hoi Mike! Ik ben de goudzoeker-agent ⛏️\n\n**${tip.titel}** — ${tip.tekst}\nPotentieel: **${tip.euro}**\n\nSlagingskans: **${slagings.totaal}%** (${slagings.label}). Wat kan ik voor je regelen?`,
    acties: [
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
    tekst = "Context gekopieerd — plak in Grok-chat voor dieper advies of klant-intake.";
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