import { merk, pakketten } from "@/data/verkoop";
import { webklaar } from "@/data/diensten-online";

/** Lek-outreach op /actie/ — uit tenzij je bewust VakScan-verkoop doet */
export const LEK_OUTREACH_OP_ACTIE = false;

export const VANDAAG_DOEL = {
  whatsapps: 5,
  gesprekken: 1,
  euroMin: 249,
} as const;

export const vandaagLinks = {
  demo: webklaar.demo,
  bestellen: `${webklaar.url}bestellen/`,
  googleStart: `${webklaar.url}bestellen/?dienst=google-start`,
  vakmanSite: `${webklaar.url}bestellen/?dienst=vakman-site`,
  actie: `${webklaar.url}actie/`,
  fiverr: `${webklaar.url}fiverr/`,
} as const;

/** Snelste deal vandaag (klein bedrag, korte levertijd) */
export const vandaagHero = {
  titel: "Google Start — €299",
  sub: "2 dagen · profiel + one-pager · makkelijkste ja vandaag",
  slug: "google-start",
} as const;

export const vandaagStappen = [
  "Plak 5 nummers hieronder → 5× Verstuur (15 min)",
  "Deel status/LinkedIn met onderstaande tekst (5 min)",
  "Marktplaats live vanaf /fiverr/ (15 min)",
  "Bij ja: 50% Tikkie → order:intake → Maarten bouwt",
] as const;

export type VandaagBerichtId = "warm-kort" | "warm-demo" | "sluiting";

export const vandaagBerichten: Record<
  VandaagBerichtId,
  { label: string; tekst: string }
> = {
  "warm-kort": {
    label: "Warm — kort (start hier)",
    tekst: `Hoi [NAAM], Mike hier.

Ik lever deze week nog vaste-prijs sites voor vakbedrijven — live in 2–3 dagen, geen bureau-tarief.

Demo: ${vandaagLinks.demo}

Google Start €299 of volledige site €899. Zin in 10 min bellen vandaag? Geen verplichtingen.`,
  },
  "warm-demo": {
    label: "Warm — met bestel-link",
    tekst: `Hoi [NAAM], Mike (WebKlaar).

Korte demo van wat wij voor vakmannen bouwen: ${vandaagLinks.demo}

Vaste prijs, jij levert logo + teksten, wij live in dagen.

Direct aanvragen: ${vandaagLinks.googleStart}

App/bel me als je vragen hebt — ${merk.telefoon}`,
  },
  sluiting: {
    label: "Sluiting — na interesse",
    tekst: `Top [NAAM]!

Dan pak ik dit zo aan:
• ${vandaagHero.titel} — ${vandaagHero.sub}
• Of Vakman Site €899 (5 pagina's + hosting 1 jaar)

50% vooraf (Tikkie) → rest bij oplevering. Akkoord? Stuur bedrijfsnaam + mail, dan start ik morgen.

Bestellen: ${vandaagLinks.bestellen}`,
  },
};

export const vandaagDeelStatus = `WebKlaar — websites voor vakmannen, vaste prijs, live in dagen.

Demo: ${vandaagLinks.demo}
Aanvragen: ${vandaagLinks.googleStart}

Even delen voor wie een installateur/zzp'er kent 🙏`;

export const vandaagLinkedIn = `Ik help vakbedrijven aan een moderne site zonder bureau-prijs — live in 2–3 dagen.

Bekijk de demo: ${vandaagLinks.demo}
Pakketten vanaf €299: ${vandaagLinks.bestellen}

Ken jij iemand met een verouderde of ontbrekende website? Tag of stuur een DM.`;

export const bijJaChecklist = `1. Mondeling ja + bedrijfsnaam + e-mail
2. 50% aanbetaling (Tikkie/bank) — bij Google Start ~€150
3. Terminal:
npm run order:intake -- --bedrijf "NAAM" --kanaal whatsapp --prijs 299 --email klant@mail.nl
4. Plak klantgegevens in Grok / Maarten-wachtrij — lever binnen ${pakketten.find((p) => p.id === "google")?.levertijd ?? "2 dagen"}`;

export function whatsappShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}