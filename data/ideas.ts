export type IdeaCategory = "deze-week" | "deze-maand" | "later";

export type IncomeSpoor =
  | "verkopen"
  | "uren"
  | "doorverkoop"
  | "recurring"
  | "netwerk";

export type IdeaScores = {
  korteTermijn: number;
  zekerheid: number;
  opbrengst: number;
  julliePassen: number;
  schaalbaar: number;
};

export type MoneyIdea = {
  id: string;
  title: string;
  tagline: string;
  category: IdeaCategory;
  spoor: IncomeSpoor;
  recommended?: boolean;
  eersteEuro: string;
  problem: string;
  aanpak: string;
  geld: string;
  geldDetail: string;
  wie: { mike: string[]; maarten: string[] };
  stappen: string[];
  risico: string;
  scores: IdeaScores;
  totaal: number;
};

export const categoryMeta: Record<
  IdeaCategory,
  { label: string; sub: string; color: string }
> = {
  "deze-week": {
    label: "Deze week geld",
    sub: "0–7 dagen · direct uitvoerbaar",
    color: "emerald",
  },
  "deze-maand": {
    label: "Deze maand geld",
    sub: "2–4 weken · eerste betaling realistisch",
    color: "amber",
  },
  later: {
    label: "Bouwsteen",
    sub: "Maanden · pas na eerste cash",
    color: "sky",
  },
};

export const spoorMeta: Record<
  IncomeSpoor,
  { label: string; emoji: string; uitleg: string }
> = {
  verkopen: {
    label: "Verkopen",
    emoji: "📦",
    uitleg: "Eenmalig product of pakket — snelste cash",
  },
  uren: {
    label: "Uren",
    emoji: "⏱",
    uitleg: "Tijd verkopen — flexibel, direct factureerbaar",
  },
  doorverkoop: {
    label: "Doorverkoop",
    emoji: "🔗",
    uitleg: "Commissie of marge op tools van anderen",
  },
  recurring: {
    label: "Recurring",
    emoji: "🔄",
    uitleg: "Maandelijks terugkerend — stapelbaar",
  },
  netwerk: {
    label: "Netwerk",
    emoji: "🤝",
    uitleg: "Warme contacten activeren — weinig acquisitie",
  },
};

function total(s: IdeaScores) {
  return s.korteTermijn + s.zekerheid + s.opbrengst + s.julliePassen + s.schaalbaar;
}

export const ideas: MoneyIdea[] = [
  {
    id: "site-verkopen",
    title: "Website verkopen (kant-en-klaar)",
    tagline: "ZonComfort-klonen voor een echte installateur — €750–1.200",
    category: "deze-week",
    spoor: "verkopen",
    recommended: true,
    eersteEuro: "Week 1–2: eerste factuur €750+",
    problem:
      "Lokale zonwering/kozijnen-bedrijven hebben geen moderne site. Bureau vraagt €5.000. Jullie hebben de site al.",
    aanpak:
      "Kopieer MIKE-AND-MAARTEN → ander logo, kleuren, teksten, telefoonnummer. Deploy Vercel. Verkoop als pakket inclusief 1 jaar hosting.",
    geld: "€750–1.200 eenmalig",
    geldDetail:
      "1 klant per 2 weken = €1.500–2.400/maand naast je werk. Geen SaaS nodig — gewoon verkopen wat je al hebt.",
    wie: {
      mike: ["3 bedrijven bellen/appen (eigen netwerk)", "Teksten + prijzen invullen", "Offerte + factuur"],
      maarten: ["Theme aanpassen (logo/kleur)", "Deploy + domein", "1-pager uitleg voor klant"],
    },
    stappen: [
      "Maak 1 demo-site klaar (andere naam, zelfde motor)",
      "Mike: lijst van 10 lokale installateurs",
      "Stuur link + 'uw site, klaar in 3 dagen, €899'",
      "Eerste ja = geld op rekening",
    ],
    risico: "Klant wil eindeloos maatwerk → vaste prijs, vaste scope (5 pagina's + configurator)",
    scores: { korteTermijn: 5, zekerheid: 5, opbrengst: 4, julliePassen: 5, schaalbaar: 3 },
    totaal: 0,
  },
  {
    id: "werk-uren",
    title: "Betaald kluswerk (opdevlugt-tech)",
    tagline: "MIKE-AND-MAARTEN afmaken en factureren",
    category: "deze-week",
    spoor: "uren",
    eersteEuro: "Week 1: uren declareren",
    problem: "Jullie bouwen al samen — maar zonder tarief. Maarten (admin) en Mike (uitvoering) zonder factuur.",
    aanpak:
      "Spreek af: uurtarief of vast bedrag voor ZonComfort-site live. Werk via git, geen gedoe. Eerlijk en direct.",
    geld: "€25–45/uur of €500–1.500 vast",
    geldDetail: "20 uur × €35 = €700. Of: 'site live + echte data = €800' eenmalig.",
    wie: {
      mike: ["Echte bedrijfsdata invullen", "Content + foto's regelen", "Testen opdrachtgever"],
      maarten: ["Site afmaken", "Deploy productie", "Bugfixes"],
    },
    stappen: [
      "Bel 15 min: uurtarief of vast?",
      "Lijst wat nog moet voor 'live'",
      "Afspraak deadline + betaling bij oplevering",
      "Werk verder zoals nu (git)",
    ],
    risico: "Vriendschap + geld → schriftelijk kort vastleggen (WhatsApp is ok)",
    scores: { korteTermijn: 5, zekerheid: 5, opbrengst: 3, julliePassen: 5, schaalbaar: 1 },
    totaal: 0,
  },
  {
    id: "mike-verkoopt",
    title: "Mike verkoopt, Maarten bouwt",
    tagline: "50/50 split op freelance webklussen",
    category: "deze-week",
    spoor: "netwerk",
    eersteEuro: "Week 1–2: eerste klus",
    problem: "Maarten kan bouwen maar heeft geen lokale sales. Mike kent mensen in bouw/renovatie.",
    aanpak:
      "Mike benadert netwerk: 'Wie heeft site nodig?' Maarten levert. 50/50 na betaling. Geen eigen product nodig.",
    geld: "€400–2.000 per klus, 50/50",
    geldDetail: "1 klus/maand à €800 = €400 elk. Schaal met templates (site-verkopen idee).",
    wie: {
      mike: ["Netwerk, intake, offerte", "Content van klant", "Factuur"],
      maarten: ["Bouwen", "Design", "Oplevering"],
    },
    stappen: [
      "Mike: 5 WhatsApps deze week",
      "Simpele prijslijst (one-pager / site / shop)",
      "Eerste klus = bewijs dat het werkt",
    ],
    risico: "Onduidelijke scope → standaard pakketten, niet maatwerk",
    scores: { korteTermijn: 5, zekerheid: 4, opbrengst: 4, julliePassen: 5, schaalbaar: 2 },
    totaal: 0,
  },
  {
    id: "digitaal-opruimen",
    title: "Digitale opruiming (zzp & winkels)",
    tagline: "E-mail, cloud, backup, wachtwoorden — €125/uur",
    category: "deze-week",
    spoor: "uren",
    eersteEuro: "Week 1: eerste 2-uurs klus €250",
    problem:
      "Veel zzp'ers en kleine winkels draaien op chaos: oude Gmail, geen backup, Excel overal. Geen site nodig — ze betalen voor rust.",
    aanpak:
      "Vast pakket: 2 uur on-site of remote. Inbox structureren, cloud koppelen, wachtwoordmanager, backup check. Geen development.",
    geld: "€125/uur · pakket €249 (2 uur)",
    geldDetail: "2 klussen/week = €500. Mike kent deze mensen al via renovatie/netwerk.",
    wie: {
      mike: ["Lokaal verkopen ('ik ruim je digitale rommel op')", "On-site bij winkels", "Factuur"],
      maarten: ["Remote support", "Checklist + handleiding achterlaten", "Backup instellen"],
    },
    stappen: [
      "Maak 1-pager checklist (wat je doet in 2 uur)",
      "Mike: 5 zzp'ers/winkeliers uit netwerk",
      "Lever binnen 1 week — mond-tot-mond",
    ],
    risico: "Scope explodeert → strikt 2-uur pakket, meer uren = nieuwe afspraak",
    scores: { korteTermijn: 5, zekerheid: 4, opbrengst: 3, julliePassen: 4, schaalbaar: 2 },
    totaal: 0,
  },
  {
    id: "platform-gigs",
    title: "Platform-gigs (Malt / Fiverr / Upwork)",
    tagline: "Kleine klussen wereldwijd — geen eigen marketing",
    category: "deze-week",
    spoor: "uren",
    eersteEuro: "Week 2–3: eerste gig €50–300",
    problem: "Jullie wachten op lokaal netwerk, maar platforms hebben nu al vraag naar fixes, forms, WordPress, dashboards.",
    aanpak:
      "Maarten: profiel + 3 portfolio-items (ZonComfort, OfferteWijs). Mike: NL-teksten. Start met kleine fixed-price gigs (€75–150).",
    geld: "€50–500 per gig",
    geldDetail: "3 gigs/maand à €150 = €450. Geen sales-gesprek — gewoon leveren.",
    wie: {
      mike: ["Profielteksten NL", "Intake met klant (Engels mag)", "Reviews vragen"],
      maarten: ["Profiel + portfolio", "Technische levering", "Snel reageren op gigs"],
    },
    stappen: [
      "Kies 1 platform (Malt = NL, Fiverr = volume)",
      "3 fixed-price aanbiedingen (form fix, landing page, Excel→sheet)",
      "Eerste 5 sterren review = momentum",
    ],
    risico: "Race to bottom → alleen vaste prijs, geen uurtarief onder €35",
    scores: { korteTermijn: 4, zekerheid: 3, opbrengst: 3, julliePassen: 4, schaalbaar: 3 },
    totaal: 0,
  },
  {
    id: "renovatie-plus-digitaal",
    title: "Renovatieklus + digitaal upsell",
    tagline: "Mike's fysieke werk + Google/site erachteraan",
    category: "deze-week",
    spoor: "netwerk",
    eersteEuro: "Week 1: renovatie-uren + €149 digitaal extra",
    problem:
      "Mike doet al renovatieklussen. Klant vertrouwt hem. Na de klus is het makkelijk om Google-pakket of simpele site te verkopen.",
    aanpak:
      "Na elke renovatie: 'Zal ik uw Google-profiel ook netjes zetten? €149'. Geen koude acquisitie — warme klant die je al kent.",
    geld: "Renovatie + €149–299 digitaal extra",
    geldDetail: "2 renovaties/maand + upsell = €300–600 extra zonder nieuwe leads.",
    wie: {
      mike: ["Renovatie uitvoeren", "Upsell na oplevering", "Google invullen met klant"],
      maarten: ["Site/one-pager klaarzetten", "Deploy", "Template aanpassen"],
    },
    stappen: [
      "Kaartje achterlaten: 'Google + website vanaf €149'",
      "Bij volgende klus: mondeling aanbieden",
      "Maarten levert binnen 48 uur",
    ],
    risico: "Renovatie kost tijd → upsell alleen als digitale levering uitbesteed aan Maarten",
    scores: { korteTermijn: 5, zekerheid: 4, opbrengst: 3, julliePassen: 5, schaalbaar: 2 },
    totaal: 0,
  },
  {
    id: "google-pakket",
    title: "Google-pakket voor vakmannen",
    tagline: "Site + Google Business + WhatsApp-knop — €299",
    category: "deze-maand",
    spoor: "verkopen",
    eersteEuro: "Week 2–3: eerste €299",
    problem:
      "Vakman heeft geen Google-profiel of oude site. Verliest klanten aan concurrent met betere reviews.",
    aanpak:
      "Mini-pakket: simpele one-pager OF jullie template + Google Business aanmaken + review-verzoek template.",
    geld: "€299 eenmalig (+ €19/maand onderhoud optioneel)",
    geldDetail: "3 per maand = €900. Minder werk dan volledige configurator-site.",
    wie: {
      mike: ["Lokaal verkopen", "Google Business invullen (met klant)", "Review uitleg"],
      maarten: ["One-pager template", "Snel deploy", "Checklist PDF"],
    },
    stappen: [
      "Maak one-pager template (1 uur)",
      "Mike verkoopt aan 5 warme contacten",
      "Lever in 2 dagen",
      "Upsell later naar volledige site",
    ],
    risico: "Te veel handwerk → strikte checklist, max 2 uur per klant",
    scores: { korteTermijn: 4, zekerheid: 4, opbrengst: 3, julliePassen: 4, schaalbaar: 2 },
    totaal: 0,
  },
  {
    id: "excel-automatisering",
    title: "Excel / administratie automatiseren",
    tagline: "Offertes, uren, voorraad — €350–750 per bedrijf",
    category: "deze-maand",
    spoor: "verkopen",
    eersteEuro: "Week 3: eerste €350",
    problem:
      "Kleine bedrijven leven in Excel. Fouten, dubbel werk, geen overzicht. Ze willen geen SaaS — ze willen dat het probleem weg is.",
    aanpak:
      "Intake: welk Excel-sheet? Maarten bouwt simpele tool (Google Sheet + script of mini-app). Vaste prijs, 1 week levering.",
    geld: "€350–750 eenmalig",
    geldDetail: "1 per 2 weken = €700–1.500/maand. Vaak zelfde klanten als site-verkoop.",
    wie: {
      mike: ["Intake: welk probleem?", "Testen met klant", "Verkopen via netwerk"],
      maarten: ["Sheet/script bouwen", "Korte uitleg video", "Oplevering"],
    },
    stappen: [
      "3 veelvoorkomende templates (uren, offerte, voorraad)",
      "Mike: 3 bedrijven met Excel-pijn",
      "Vaste scope: 1 sheet, 1 flow, klaar",
    ],
    risico: "Wordt maatwerk → alleen vanuit template, geen custom ERP",
    scores: { korteTermijn: 4, zekerheid: 4, opbrengst: 4, julliePassen: 5, schaalbaar: 3 },
    totaal: 0,
  },
  {
    id: "ai-snelstart",
    title: "AI-snelstart voor ondernemers",
    tagline: "ChatGPT + prompts voor offertes en mail — €199",
    category: "deze-maand",
    spoor: "verkopen",
    eersteEuro: "Week 2: eerste €199",
    problem:
      "Ondernemers horen over AI maar weten niet waar te beginnen. Ze betalen graag voor iemand die het in 1 uur werkend maakt.",
    aanpak:
      "Setup: account, 10 kant-en-klare prompts (offerte, klantmail, social post). 1 uur Zoom + handleiding PDF.",
    geld: "€199 eenmalig",
    geldDetail: "4 per maand = €800. Weinig code — veel waarde.",
    wie: {
      mike: ["Verkopen ('uw AI-assistent in 1 uur')", "Prompts schrijven (offerte/branche)", "Zoom uitleg"],
      maarten: ["Technische setup", "PDF handleiding", "Optioneel: eigen GPT"],
    },
    stappen: [
      "Prompt-bibliotheek voor installateurs/zzp",
      "Mike: 5 ondernemers uit netwerk",
      "Lever binnen 3 dagen",
    ],
    risico: "Gratis alternatieven → focus op branche-specifieke prompts, niet 'ChatGPT installeren'",
    scores: { korteTermijn: 4, zekerheid: 4, opbrengst: 3, julliePassen: 4, schaalbaar: 3 },
    totaal: 0,
  },
  {
    id: "workshop",
    title: "Workshop 'digitaal zelf doen'",
    tagline: "2 uur live · €49 p.p. · max 8 mensen",
    category: "deze-maand",
    spoor: "verkopen",
    eersteEuro: "Week 3–4: eerste workshop €245–392",
    problem:
      "Lokale ondernemers willen leren, niet alles uitbesteden. Ze betalen voor uitleg + handvatten.",
    aanpak:
      "Thema kiezen: 'Google Business zelf bijhouden' of 'AI voor uw offertes'. Bibliotheek of horeca-lokaal. Eventbrite/HeyInvite.",
    geld: "€49 p.p. × 5–8 = €245–392",
    geldDetail: "1 workshop/maand = extra cash + leads voor pakketten. Upsell: €299 Google-pakket.",
    wie: {
      mike: ["Locatie regelen", "Uitnodigen via netwerk", "Presenteren + Q&A"],
      maarten: ["Slides + demo", "Follow-up mail met aanbod", "Aanwezig voor technische vragen"],
    },
    stappen: [
      "Datum + thema vastleggen",
      "15 uitnodigingen, 5 betalen = break-even",
      "Aan einde: kort aanbod Google-pakket / site",
    ],
    risico: "Te weinig opkomst → gratis voor eerste keer, video opnemen voor marketing",
    scores: { korteTermijn: 3, zekerheid: 3, opbrengst: 2, julliePassen: 4, schaalbaar: 2 },
    totaal: 0,
  },
  {
    id: "onderhoud",
    title: "Onderhoudsabonnement",
    tagline: "€49/maand per site die jullie bouwden",
    category: "deze-maand",
    spoor: "recurring",
    eersteEuro: "Maand 2: eerste recurring €49",
    problem: "Klant heeft site maar kan niet updaten. Belt jullie elk kwartaal paniekerig.",
    aanpak: "Bij elke site-verkoop: 'Onderhoud €49/maand — tekst wijzigen, updates, backup'.",
    geld: "€49/maand × klanten",
    geldDetail: "10 klanten = €490/maand passief. Kost 1–2 uur/maand totaal.",
    wie: {
      mike: ["Verkopen bij oplevering", "Kleine content-wijzigingen", "Klantcontact"],
      maarten: ["Updates, security patches", "Monitoring", "Backup"],
    },
    stappen: [
      "Standaard contract 1 A4",
      "Bied aan bij elke site-verkoop",
      "Batch updates 1x per maand",
    ],
    risico: "Scope creep → alleen tekst/foto, geen nieuwe features",
    scores: { korteTermijn: 3, zekerheid: 4, opbrengst: 3, julliePassen: 5, schaalbaar: 4 },
    totaal: 0,
  },
  {
    id: "hosting-doorverkoop",
    title: "Hosting & tools doorverkopen",
    tagline: "Marge op Vercel, e-mail, domein — €10–25/maand per klant",
    category: "deze-maand",
    spoor: "doorverkoop",
    eersteEuro: "Maand 2: eerste €15/maand marge",
    problem:
      "Elke site-klant heeft hosting, domein, soms e-mail nodig. Jullie regelen het — klant betaalt één factuur.",
    aanpak:
      "Reseller of simpel: jullie betaalt Vercel/TransIP, klant betaalt jullie €25/maand all-in. Geen support-drama: standaard pakket.",
    geld: "€10–25 marge/maand per klant",
    geldDetail: "20 klanten × €15 = €300/maand. Stapelen bij elke site-verkoop.",
    wie: {
      mike: ["All-in prijs communiceren", "Factuur", "Jaarlijks incasso"],
      maarten: ["Technisch beheer", "Domein + DNS", "Vercel project"],
    },
    stappen: [
      "Standaard hosting-prijs: €25/maand all-in",
      "Bij elke site-verkoop automatisch aanbieden",
      "Jaarlijks factureren = minder churn",
    ],
    risico: "Support bij uitval → SLA in contract, niet 24/7",
    scores: { korteTermijn: 3, zekerheid: 4, opbrengst: 3, julliePassen: 4, schaalbaar: 4 },
    totaal: 0,
  },
  {
    id: "offertewijs-pilot",
    title: "OfferteWijs pilot",
    tagline: "3 gratis testers → 2 betalen €29/maand",
    category: "deze-maand",
    spoor: "recurring",
    eersteEuro: "Week 3–4: eerste €29/maand",
    problem: "Offertes in Word — maar SaaS verkoop is trager dan een site verkopen.",
    aanpak:
      "Geef 3 installateurs gratis toegang. Als ze na 2 weken nog gebruiken → €29/maand. Klein, niet perfect.",
    geld: "€29–39/maand (na pilot)",
    geldDetail: "5 betalende = €145–195/maand. Pas schalen als site-verkoop loopt.",
    wie: {
      mike: ["3 pilot-klanten werven (uit site-klanten!)", "Prijzen instellen", "Feedback"],
      maarten: ["MVP configurator + PDF", "Login simpel houden", "Deploy"],
    },
    stappen: [
      "Kopieer ZonComfort-logica",
      "PDF export (week 2)",
      "Pilot met klant van site-verkoop",
    ],
    risico: "Te lang bouwen zonder geld → max 3 weken, dan betalen of stoppen",
    scores: { korteTermijn: 3, zekerheid: 3, opbrengst: 4, julliePassen: 5, schaalbaar: 5 },
    totaal: 0,
  },
  {
    id: "klusboard",
    title: "KlusBoard verkopen",
    tagline: "Mikes renovatie-app doorverkopen aan 5 zzp'ers",
    category: "deze-maand",
    spoor: "recurring",
    eersteEuro: "Week 4: €9/maand × eerste gebruiker",
    problem: "Renovateurs gebruiken Excel voor uren en materialen.",
    aanpak: "Mike gebruikt het zelf. Nodig 5 kennissen uit. €9/maand of €79/jaar.",
    geld: "€9/maand of €79/jaar",
    geldDetail: "20 gebruikers = €180/maand. Klein maar eigen product.",
    wie: {
      mike: ["App afmaken", "5 renovateurs benaderen", "Support"],
      maarten: ["Web-dashboard (optioneel)", "Landing page", "Betaling Stripe"],
    },
    stappen: [
      "Mike: app bruikbaar voor eigen klus",
      "Simpele landingspagina",
      "5 gratis trials → betalen",
    ],
    risico: "Te niche → combineer met site-verkoop aan zelfde klanten",
    scores: { korteTermijn: 2, zekerheid: 3, opbrengst: 2, julliePassen: 5, schaalbaar: 3 },
    totaal: 0,
  },
  {
    id: "leads-lokaal",
    title: "Lokale lead-pagina's",
    tagline: "Rank op 'zonwering [stad]' — verkoop leads",
    category: "deze-maand",
    spoor: "doorverkoop",
    eersteEuro: "Week 4–8: eerste lead €15–25",
    problem: "Installateurs betalen voor leads (Werkspot, Trustoo) maar die zijn duur en slecht.",
    aanpak:
      "5 steden × landingspagina 'offerte zonwering Utrecht'. SEO. Formulier → doorverkopen aan installateur.",
    geld: "€15–25 per lead",
    geldDetail: "20 leads/maand = €300–500. Kost tijd (SEO) maar weinig bouw.",
    wie: {
      mike: ["Steden kiezen", "Installateur die leads koopt vinden", "Content lokaal"],
      maarten: ["Landingspagina template", "SEO technisch", "Form + tracking"],
    },
    stappen: [
      "1 stad live als test",
      "Google Search Console",
      "Deal met 1 installateur: €20/lead",
    ],
    risico: "SEO duurt → combineer met betaalde ads (klein budget)",
    scores: { korteTermijn: 2, zekerheid: 2, opbrengst: 3, julliePassen: 3, schaalbaar: 4 },
    totaal: 0,
  },
  {
    id: "referral-fee",
    title: "Referral fee (doorverwijzen)",
    tagline: "Kennissen doorverwijzen — €50–200 per deal",
    category: "deze-maand",
    spoor: "doorverkoop",
    eersteEuro: "Week 2–4: eerste commissie",
    problem:
      "Mike kent installateurs, leveranciers, andere vakmannen. Die betalen soms voor warme intro's of leads.",
    aanpak:
      "Vraag actief: 'Betaalt u iets voor een klant die ik aanlever?' Niet alleen digitaal — ook materialen, onderaanneming.",
    geld: "€50–200 per succesvolle intro",
    geldDetail: "2 referrals/maand = €100–400. Nul bouwwerk.",
    wie: {
      mike: ["Netwerk in kaart", "Intro's maken", "Follow-up"],
      maarten: ["Optioneel: simpele landingspagina voor tracking", "Niet verplicht"],
    },
    stappen: [
      "Lijst: wie betaalt voor leads/referrals?",
      "1 intro testen met duidelijke afspraak",
      "Documenteer wat werkt",
    ],
    risico: "Informeel → vooraf schriftelijk percentage/bedrag afspreken",
    scores: { korteTermijn: 4, zekerheid: 3, opbrengst: 2, julliePassen: 4, schaalbaar: 2 },
    totaal: 0,
  },
  {
    id: "zonscan",
    title: "ZonScan (foto → prijs)",
    tagline: "Wow-tool — pas na eerste cash",
    category: "later",
    spoor: "recurring",
    eersteEuro: "Maand 2+",
    problem: "Cool maar AI + marketing = tijd en geld zonder snelle return.",
    aanpak: "Bewaren voor als site-verkoop of OfferteWijs draait. Niet nu starten.",
    geld: "€15–25/lead (later)",
    geldDetail: "Potentieel hoog, maar niet korte termijn.",
    wie: {
      mike: ["Productregels", "Later: sales"],
      maarten: ["AI integratie", "Later: UI"],
    },
    stappen: ["Wacht", "Herbeoordelen Q3"],
    risico: "Afleiding van geld nu → expliciet 'later'",
    scores: { korteTermijn: 1, zekerheid: 2, opbrengst: 4, julliePassen: 3, schaalbaar: 5 },
    totaal: 0,
  },
].map((i) => ({ ...i, totaal: total(i.scores) })) as MoneyIdea[];

export const scoreLabels: Record<keyof IdeaScores, string> = {
  korteTermijn: "Geld snel",
  zekerheid: "Zekerheid",
  opbrengst: "Opbrengst",
  julliePassen: "Past bij jullie",
  schaalbaar: "Schaalbaar",
};

export const aanbeveling = {
  titel: "Kortetermijnplan: 5 sporen, niet 1 product",
  tekst: "Jullie hoeven geen startup. Combineer: verkopen (sites/pakketten), uren (kluswerk + digitale opruiming), netwerk (Mike's contacten), en stapel recurring erachteraan.",
  sporen: [
    { spoor: "verkopen" as IncomeSpoor, actie: "Site of Google-pakket aan installateur", euro: "€299–1.200" },
    { spoor: "uren" as IncomeSpoor, actie: "ZonComfort afmaken + digitale opruiming zzp", euro: "€250–1.500" },
    { spoor: "netwerk" as IncomeSpoor, actie: "Renovatie-upsell + 5 WhatsApps", euro: "€149–800" },
    { spoor: "doorverkoop" as IncomeSpoor, actie: "Hosting-marge + referral fee", euro: "€15–200" },
    { spoor: "recurring" as IncomeSpoor, actie: "Onderhoud na elke levering", euro: "€49/maand" },
  ],
  plan: [
    {
      fase: "Week 1",
      actie: "Tarief afspreken + demo-site + 5 contacten bellen (site, Google, of digitale opruiming)",
      euro: "€250–1.200 mogelijk",
    },
    {
      fase: "Week 2–3",
      actie: "Leveren + upsell (onderhoud, hosting, AI-pakket) + optioneel 1 platform-gig",
      euro: "€299–1.500",
    },
    {
      fase: "Week 4",
      actie: "Recurring starten + OfferteWijs pilot bij tevreden klant",
      euro: "€49–78/maand extra",
    },
  ],
  nietNu: ["ZonScan", "Perfecte SaaS", "Alles tegelijk", "Alleen maar bouwen zonder verkopen"],
};