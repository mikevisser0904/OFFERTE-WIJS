import { merk } from "@/data/verkoop";
import { diensten, webklaar, type OnlineDienst } from "@/data/diensten-online";

/** Lek-outreach op /actie/ — uit tenzij je bewust VakScan-verkoop doet */
export const LEK_OUTREACH_OP_ACTIE = false;

export const VANDAAG_DOEL = {
  whatsapps: 5,
  gesprekken: 1,
  euroMin: 149,
} as const;

export const vandaagLinks = {
  demo: webklaar.demo,
  show: webklaar.show,
  diensten: `${webklaar.url}diensten/`,
  start: `${webklaar.url}start/`,
  bestellen: `${webklaar.url}bestellen/`,
  googleStart: `${webklaar.url}bestellen/?dienst=google-start`,
  seoStarter: `${webklaar.url}bestellen/?dienst=seo-starter`,
  listingsSetup: `${webklaar.url}bestellen/?dienst=listings-setup`,
  landingSnel: `${webklaar.url}bestellen/?dienst=landing-snel`,
  vakmanSite: `${webklaar.url}bestellen/?dienst=vakman-site`,
  spoed: `${webklaar.url}spoed/`,
  actie: `${webklaar.url}actie/`,
  listings: `${webklaar.url}listings/`,
} as const;

/** Vandaag pushen — laagste drempel eerst */
export const actieTopDiensten: { dienst: OnlineDienst; pitch: string }[] = [
  "spoed-hulp",
  "listings-setup",
  "seo-starter",
  "google-start",
  "landing-snel",
  "ai-snelstart",
]
  .map((slug) => diensten.find((d) => d.slug === slug))
  .filter((d): d is OnlineDienst => Boolean(d))
  .map((dienst) => ({
    dienst,
    pitch:
      dienst.slug === "spoed-hulp"
        ? "Vandaag 1 uur — warm netwerk"
        : dienst.slug === "listings-setup"
          ? "Zelfde copy als /listings/"
          : dienst.slug === "seo-starter"
            ? "Jullie eigen SEO-pipeline"
            : dienst.korteOms,
  }));

export const vandaagHero = {
  titel: "Google Start — €299",
  sub: "Instap online zichtbaarheid · 2 dagen",
  slug: "google-start",
  alternatief: "SEO Starter €199 · Listings €149 · Spoed €50",
} as const;

export const vandaagStappen = [
  "Kies bericht-type (internet / SEO / sluiting) → 5× Verstuur",
  "Deel status of LinkedIn — link /show/ of /diensten/",
  "Listings: eigen advertentie via /listings/ (15 min)",
  "Bij ja: juiste pakket op /bestellen/ → 50% Tikkie → order:intake",
] as const;

export type VandaagBerichtId = "warm-kort" | "warm-demo" | "internet-menu" | "sluiting";

export const vandaagBerichten: Record<VandaagBerichtId, { label: string; tekst: string }> = {
  "warm-kort": {
    label: "Warm — kort",
    tekst: `Hoi [NAAM], Mike (${webklaar.naam}).

Internetdiensten met vaste prijs — geen bureau-uurtje:
• Spoed hulp €50 (1 uur, vandaag)
• SEO Starter €199 · Google Start €299
• Website / landing vanaf €349

Overzicht: ${vandaagLinks.diensten}
Zin in 10 min bellen?`,
  },
  "warm-demo": {
    label: "Warm — show + demo",
    tekst: `Hoi [NAAM], Mike hier.

${webklaar.naam} = websites, Google, SEO en automatisering voor zzp/mkb.

2-min rondleiding: ${vandaagLinks.show}
Vakman-voorbeeld: ${vandaagLinks.demo}

Direct bestellen: ${vandaagLinks.bestellen}
Vragen? Bel/app ${merk.telefoon}`,
  },
  "internet-menu": {
    label: "Warm — dienstenmenu",
    tekst: `Hoi [NAAM],

Kort wat we nu leveren (vaste prijs, online bestellen):

SEO Starter €199 — Search Console + landings
Google Start €299 — profiel + one-pager
Listings €149 — Fiverr + Marktplaats teksten
Landing Snel €349 — 1 campagnepagina
Vakman site €899 — 5 pagina's + hosting

Alles: ${vandaagLinks.diensten}

Wat past bij jou? Ik plan het deze week in.`,
  },
  sluiting: {
    label: "Sluiting — na interesse",
    tekst: `Top [NAAM]!

Dan zet ik dit voor je klaar (kies 1):
• Spoed €50 — 1 uur vandaag: ${vandaagLinks.spoed}
• Listings €149 — ${vandaagLinks.listingsSetup}
• SEO Starter €199 — ${vandaagLinks.seoStarter}
• Google Start €299 — ${vandaagLinks.googleStart}
• Landing Snel €349 — ${vandaagLinks.landingSnel}
• Vakman site €899 — ${vandaagLinks.vakmanSite}

50% vooraf (Tikkie) → rest bij oplevering.
Stuur bedrijfsnaam + mail → ik start.

Bestellen: ${vandaagLinks.bestellen}`,
  },
};

export const vandaagDeelStatus = `${webklaar.naam} — internetdiensten, vaste prijs.

SEO €199 · Google €299 · sites vanaf €349
Show: ${vandaagLinks.show}
Catalogus: ${vandaagLinks.diensten}

Deel voor zzp/mkb in je netwerk`;

export const vandaagLinkedIn = `${webklaar.naam}: internetdiensten met vaste prijs — SEO, Google, websites, AI.

Vanaf €50 spoed tot €899 vakman-site.
Bekijk: ${vandaagLinks.show}
Bestellen: ${vandaagLinks.diensten}

Ken jij iemand die online achterloopt? DM of tag.`;

export const bijJaChecklist = `1. Welk pakket? (noteer slug + prijs van /diensten/)
2. Mondeling ja + bedrijfsnaam + e-mail
3. 50% aanbetaling — bij €199 ≈ €100, bij €299 ≈ €150
4. Terminal (pas --prijs aan):
npm run order:intake -- --bedrijf "NAAM" --kanaal whatsapp --prijs 299 --email klant@mail.nl
5. Maarten/Grok: lever volgens dienst.levering op detailpagina`;

export function whatsappShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export const vandaagMailWarm = {
  onderwerp: "Internetdiensten vaste prijs (SEO €199 / Google €299)",
  body: `Hoi [NAAM],

Ik help zzp en mkb met online zichtbaarheid — zonder agency-tarief.

Populair nu:
• SEO Starter €199 (Search Console + landings)
• Google Start €299 (profiel + one-pager)

Alle pakketten: ${vandaagLinks.diensten}
Korte tour: ${vandaagLinks.show}

Zin in een belletje deze week?

Groet,
Mike · ${webklaar.naam}
${merk.telefoon}`,
};

export const vandaagBel15sec = `${webklaar.naam} — internetdiensten vaste prijs. Noem: SEO €199, Google €299, spoed €50 vandaag. Stuur ${vandaagLinks.diensten} als ze "wat kost het" zeggen. Vraag: "Wie in je netwerk heeft nog een zwakke site of geen Google-profiel?"`;

/** Voor manager / default actie op werkblad */
export const actieSamenvatting =
  "/actie/ → internet-menu · top: Spoed €50, Listings €149, SEO €199, Google €299";