import { webklaar } from "@/data/diensten-online";

export const spoed50 = {
  prijs: 50,
  prijsLabel: "€50",
  duur: "1 uur",
  titel: "Spoed digitale hulp",
  tagline: "Vandaag · 1 uur · vast bedrag",
  url: `${webklaar.url}spoed/`,
} as const;

/** Wat je wél in 1 uur levert — kies 1 per klant */
export const spoed50Scope = [
  "PC/laptop: traag, updates, opruimen, basis-virusscan",
  "Mail/Outlook/Gmail werkt niet (inlog, SMTP, spam)",
  "Website: kleine fix, tekst, knop, contactformulier",
  "Google Business: check + eerste verbeteringen",
  "Excel/Sheets: 1 formule of macro-light fix",
  "WordPress: inlog, plugin-update, witte pagina (basis)",
] as const;

export const spoed50Niet = [
  "Geen nieuwe website van scratch",
  "Geen grote Excel-projecten",
  "Geen hardware-reparatie",
];

export const marktplaatsSpoed50Titel =
  "Spoed computer- of website-hulp — vandaag — €50 (1 uur)";

export const marktplaatsSpoed50Tekst = `Spoed nodig? Ik help vandaag nog — vaste prijs **€50** voor **1 uur** (digitaal).

Wat past in 1 uur:
• PC/laptop traag of rommelig
• Mail werkt niet
• Kleine website-fix
• Google Business check
• Excel/Sheets quick fix

**Niet:** nieuwe site bouwen of grote projecten.

Op afstand (TeamViewer) of op locatie in overleg.
Betaling: **Tikkie vooraf** of contant — dan start ik.

Direct appen met "SPOED": ${webklaar.telefoonDisplay}
Of: ${spoed50.url}

Mike / DoekoeWijs`;

export const whatsappSpoed50 = `Hoi! Mike (DoekoeWijs).

Spoed digitale hulp: **€50 = 1 uur** vandaag.
PC traag, mail, kleine site-fix, Google-check, Excel — kies 1 probleem.

Tikkie €50 → ik start. Waar kan ik mee helpen?`;

export const whatsappSpoed50Share = `Spoed digitale hulp vandaag — €50 voor 1 uur (PC, mail, website, Google).

${spoed50.url}
App Mike: ${webklaar.telefoonDisplay}`;

export function spoed50WaMe(text = whatsappSpoed50) {
  return `https://wa.me/${webklaar.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const spoed50IntakeCmd = `npm run order:intake -- --bedrijf "SPOED klant" --kanaal marktplaats --prijs 50 --email klant@mail.nl`;