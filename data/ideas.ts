export type IdeaScores = {
  snelMvp: number;
  geld: number;
  julliePassen: number;
  markt: number;
  leuk: number;
};

export type ProjectIdea = {
  id: string;
  title: string;
  tagline: string;
  recommended?: boolean;
  problem: string;
  solution: string;
  klant: string;
  voorbeeldKlant: string;
  waaromJullie: string;
  geld: string;
  geldDetail: string;
  mike: string[];
  maarten: string[];
  mvp: string[];
  nietNu: string[];
  risico: string;
  scores: IdeaScores;
  totaal: number;
};

function total(s: IdeaScores) {
  return s.snelMvp + s.geld + s.julliePassen + s.markt + s.leuk;
}

const offerteWijs: ProjectIdea = {
  id: "offertewijs",
  title: "OfferteWijs",
  tagline: "Van Word-document naar professionele offerte in 2 minuten",
  recommended: true,
  problem:
    "80% van de zzp-vakmannen (zonwering, kozijnen, schilders) typt offertes nog in Word. Dat kost 30–60 min per offerte, ziet er amateuristisch uit, en klanten gaan 3x vergelijken op prijs alleen.",
  solution:
    "SaaS-tool: bedrijfslogo + producten + maten → mooie PDF of link. Klant ziet direct wat hij krijgt. Jullie hebben de motor al (ZonComfort-configurator).",
  klant: "Zzp-installateur, 1–5 man, 20–100 offertes per maand",
  voorbeeldKlant: "Jan, zonweringbedrijf Utrecht — nu 45 min per offerte in Word",
  waaromJullie:
    "ZonComfort = werkende configurator, pricing.ts, PDF-flow bijna klaar. Mike kent het vak (renovatie/zonwering). Maarten maakt het generiek voor elk bedrijf.",
  geld: "€29–49/maand per bedrijf",
  geldDetail:
    "50 klanten × €39 = €1.950/maand. Eén sale per week = break-even op jullie tijd binnen 2 maanden.",
  mike: ["Prijzen & productlogica", "Eerste 3 betaal-klanten benaderen", "Support & domeinkennis"],
  maarten: ["UI + onboarding flow", "PDF/export + branding per klant", "Deploy & analytics"],
  mvp: [
    "Week 1: kopieer ZonComfort-logica, generiek maken",
    "Week 2: logo upload + bedrijfsnaam + PDF",
    "Week 3: dashboard + 1 echte klant testen",
  ],
  nietNu: ["Betalingen", "Multi-user teams", "Mobiele app"],
  risico: "Vakmannen zijn traag met nieuwe software — oplossing: gratis proef + jij installeert het voor ze",
  scores: { snelMvp: 5, geld: 4, julliePassen: 5, markt: 4, leuk: 4 },
  totaal: 0,
};

const installateurKit: ProjectIdea = {
  id: "installateurkit",
  title: "InstallateurKit",
  tagline: "ZonComfort verkopen als kant-en-klaar pakket",
  problem:
    "Elke zonwering-installateur wil een moderne site met configurator. Bouwen kost €5.000–15.000 bij een bureau. Jullie hebben het al.",
  solution:
    "White-label: ander logo, kleuren, teksten — zelfde code. Setup in 1 dag. Verkoop als product, niet als project.",
  klant: "Installateur die nu een verouderde site heeft of alleen Facebook",
  voorbeeldKlant: "Screens & Zo Groningen — wil configurator, budget < €2.000",
  waaromJullie:
    "MIKE-AND-MAARTEN is het bewijs. Maarten maakt thema-systeem; Mike doet sales en onboarding-call.",
  geld: "€499 setup + €29/maand hosting",
  geldDetail: "2 verkopen per maand = €1.000 setup + recurring. Schaalbaar zonder per klant te coderen.",
  mike: ["Sales (lokale installateurs)", "Onboarding-call", "Content invullen per klant"],
  maarten: ["Theme switcher (kleur/logo)", "Deploy pipeline per klant", "Documentatie"],
  mvp: [
    "Week 1: env-variabelen voor brand (naam, kleur, logo)",
    "Week 2: deploy-script voor klant #2",
    "Week 3: sales-pagina + 1 pitch naar installateur",
  ],
  nietNu: ["Self-service zonder jullie hulp", "Configurator per niche"],
  risico: "Elke klant wil maatwerk — oplossing: strikte grenzen in pakket",
  scores: { snelMvp: 5, geld: 5, julliePassen: 5, markt: 3, leuk: 3 },
  totaal: 0,
};

const klusBoard: ProjectIdea = {
  id: "klusboard",
  title: "KlusBoard Web",
  tagline: "Mikes renovatie-app — nu ook in de browser",
  problem:
    "Zzp'ers in renovatie verliezen overzicht: uren, materialen, wat kost de klus echt, wat moet ik factureren?",
  solution:
    "Web-dashboard gekoppeld aan KlusBoard-app. Opdrachtgever ziet voortgang (optioneel). Mike's domeinkennis ingebakken.",
  klant: "Renovateur / klusser, 1–3 personen",
  voorbeeldKlant: "Mike zelf — KlusBoard op telefoon, maar opdrachtgever wil browser-link",
  waaromJullie:
    "Mike heeft de app al (renovatie-app). Maarten bouwt web-kant. Geen concurrentie-onderzoek nodig — jij bent gebruiker #1.",
  geld: "Freemium: gratis 1 project, €9/maand onbeperkt",
  geldDetail: "Minder SaaS-potentie, maar laagste risico — je lost je eigen probleem op.",
  mike: ["App-logica hergebruiken", "Workflow & features", "Dogfooding"],
  maarten: ["Web UI + sync", "Rapporten voor opdrachtgever", "Auth"],
  mvp: [
    "Week 1: projecten + uren in web",
    "Week 2: materialen + totaal",
    "Week 3: shareable link voor opdrachtgever",
  ],
  nietNu: ["iOS/Android rewrite", "Boekhoudkoppeling"],
  risico: "Kleinere markt — oplossing: later uitbreiden naar alle zzp-bouw",
  scores: { snelMvp: 4, geld: 2, julliePassen: 5, markt: 3, leuk: 5 },
  totaal: 0,
};

const zonScan: ProjectIdea = {
  id: "zonscan",
  title: "ZonScan",
  tagline: "Foto van raam → maat, product en prijsindicatie",
  problem:
    "Klant wil snel weten wat zonwering kost, maar wil geen meetafspraak. Installateur verliest leads aan concurrent die sneller reageert.",
  solution:
    "Upload foto → AI schat breedte/hoogte → productadvies + prijsrange. Lead gaat naar installateur. Viral: 'wat kost jouw raam?'",
  klant: "Consument (B2C) + installateur als afnemer van leads",
  voorbeeldKlant: "Huiseigenaar Amsterdam — wil prijs vóór monteur langskomt",
  waaromJullie:
    "Jullie kennen producten en prijzen. Wow-factor voor marketing. Maarten kan AI-integratie; Mike valideert output.",
  geld: "€15–25 per lead naar installateur",
  geldDetail: "100 leads/maand × €20 = €2.000. Vereist marketing-budget en AI-kosten.",
  mike: ["Productregels & prijsranges", "Installateurs werven", "Output valideren"],
  maarten: ["Foto-upload UI", "AI API (vision)", "Landingspagina"],
  mvp: [
    "Week 1: handmatige maat-invoer + foto (geen AI)",
    "Week 2: AI-maatschatting",
    "Week 3: lead-formulier + 1 installateur test",
  ],
  nietNu: ["100% automatische offerte", "App"],
  risico: "AI-maat niet altijd klopt — oplossing: altijd 'indicatie, definitief na opmeting'",
  scores: { snelMvp: 2, geld: 4, julliePassen: 3, markt: 5, leuk: 5 },
  totaal: 0,
};

const beslisser: ProjectIdea = {
  id: "beslisser",
  title: "Beslisser",
  tagline: "Moet ik deze klus wel doen? Eerlijk antwoord in 5 vragen",
  problem:
    "Mensen nemen slechte beslissingen bij renovatie (te duur, verkeerde aannemer, verkeerde prioriteit). Geen neutrale second opinion.",
  solution:
    "5 vragen → advies + geschatte kosten + 'nu / later / nooit'. Affiliate naar gereedschap/materialen.",
  klant: "Huiseigenaar vóór grote uitgave",
  voorbeeldKlant: "Wie twijfelt: rolluiken nu of eerst keuken?",
  waaromJullie:
    "Mike had beslisser-app al als Expo-idee. Maarten maakt web. Content = Mikes renovatie-ervaring.",
  geld: "Affiliate + premium advies €4,99",
  geldDetail: "Moeilijker te monetizen; beter als traffic-driver naar OfferteWijs/InstallateurKit.",
  mike: ["Beslislogica & vragen", "Content (eerlijk advies)", "Renovatie-voorbeelden"],
  maarten: ["Quiz-flow UI", "Resultaat-pagina's", "SEO"],
  mvp: [
    "Week 1: 1 beslissing (zonwering ja/nee)",
    "Week 2: 5 vragen + resultaat",
    "Week 3: share + affiliate links",
  ],
  nietNu: ["AI coach", "Community"],
  risico: "Afspraken aansprakelijkheid — oplossing: duidelijk 'indicatie, geen garantie'",
  scores: { snelMvp: 4, geld: 2, julliePassen: 4, markt: 3, leuk: 4 },
  totaal: 0,
};

const leadPing: ProjectIdea = {
  id: "leadping",
  title: "LeadPing",
  tagline: "Gemiste oproep → automatisch SMS met offerte-link",
  problem:
    "Vakman is op ladder, mist telefoon. Klant belt concurrent. 30% van leads verloren door gemiste calls.",
  solution:
    "Koppeling met telefoon: gemiste call → SMS 'Bedankt voor uw bel! Offerte aanvragen: [link]'. Link = mini OfferteWijs.",
  klant: "Drukke zzp'er die vaak niet opneemt",
  voorbeeldKlant: "Monteur zonwering — 8 gemiste calls per week",
  waaromJullie:
    "Combineert met OfferteWijs. Sterk verkoopargument. Technisch: webhook + SMS (Twilio).",
  geld: "€19/maand add-on op OfferteWijs",
  geldDetail: "Upsell — pas zinvol als OfferteWijs draait.",
  mike: ["Sales pitch", "Twilio/SMS testen", "Klantgesprekken"],
  maarten: ["Webhook + SMS flow", "Landingspagina vanaf SMS", "Integratie OfferteWijs"],
  mvp: ["Week 1: handmatige SMS na form", "Week 2: Twilio", "Week 3: koppel met OfferteWijs"],
  nietNu: ["Telefoon-integratie iOS/Android"],
  risico: "SMS-kosten — oplossing: in abonnement inclusief 50 SMS/maand",
  scores: { snelMvp: 3, geld: 4, julliePassen: 4, markt: 4, leuk: 3 },
  totaal: 0,
};

export const ideas: ProjectIdea[] = [
  offerteWijs,
  installateurKit,
  klusBoard,
  zonScan,
  beslisser,
  leadPing,
].map((i) => ({ ...i, totaal: total(i.scores) }));

export const scoreLabels: Record<keyof IdeaScores, string> = {
  snelMvp: "Snel MVP",
  geld: "Geld verdienen",
  julliePassen: "Past bij jullie",
  markt: "Marktgrootte",
  leuk: "Leuk om te doen",
};

export const aanbeveling = {
  titel: "Onze aanbeveling: start met OfferteWijs",
  tekst: "Hoogste combinatie van snelheid, jullie ervaring (ZonComfort), en terugkerende inkomsten. InstallateurKit is plan B als je liever 2× €499 verkoopt dan SaaS.",
  beslissing: [
    "Bel 20 min — welk idee voelt het beste?",
    "Kies 1 project (niet 2 tegelijk)",
    "Mike pakt data/prijzen, Maarten pakt UI",
    "Eerste echte gebruiker binnen 3 weken",
  ],
};