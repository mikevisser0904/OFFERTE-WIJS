export const goudMompels = [
  // geld (niet alleen actie)
  "mmm... geld...",
  "kanker veel geld nodig",
  "10 ruggen Mike, 10 RUGGEN",
  "hier ruikt het naar euro's",
  "ruggen op de bank zouden nice zijn",
  "ik voel cash in deze hoek",
  // grappen
  "wiggel wiggel... bingo? nee koffie",
  "mijn hoed heeft 99.9% uptime",
  "GitHub Pages host ook mijn ego",
  "Maarten bouwt, ik philosopheer",
  "Windows vs Mac — goud is platform-onafhankelijk",
  "ben ik SVG of ben ik legende",
  "de wiggelrode liegt... maar graag",
  "SEO? ik doe SMO: Spiritueel Mijn Onderbewustzijn",
  "localStorage is mijn dagboek",
  "ik loop in 3D, jij zit in 2D — advantage mij",
  "dashboard dashboard dashboard... zen",
  "webshop ruikt naar verse ruggen",
  "monitor zegt nee, ik zeg JA",
  "configurator: IKEA maar dan duurder",
  "ideeën-pagina: mijn horoscoop",
  "Fiverr? meer like Fiverr-get-rich-quick-maybe",
  "wie heeft mijn pikhouweel gestolen",
  "dit is geen bug, dit is prospecting",
  "UptimeRobot kijkt mee, awkward",
  "ntfy bij down — story of my life",
  "ik mompel dus ik ben",
  "brrr... warm goud... koude koffie",
  "slagingskans: ja",
  "factuur of it didn't happen",
  "demo-site is mijn Tinder-profiel",
  "LinkedIn is vreemd maar €899 is €899",
  "even rustig... NEIN MEER GOUD",
  "mijn schaduw is ook freelancer",
  "loop ik weg of kom ik dichterbij",
  "perspective: 900px, attitude: onbeperkt",
] as const;

export function randomMompel(vorige?: string): string {
  const pool = vorige ? goudMompels.filter((m) => m !== vorige) : [...goudMompels];
  return pool[Math.floor(Math.random() * pool.length)] ?? goudMompels[0];
}

export function randomMompelBijDoel(doelLabel: string): string {
  const extras = [
    `hier bij ${doelLabel}... interessant`,
    `${doelLabel}? ruikt naar potentie`,
    `wiggel zegt: check ${doelLabel}`,
    `oké ${doelLabel} is ook goud hoor`,
  ];
  return extras[Math.floor(Math.random() * extras.length)]!;
}

export const GROOTTE = { w: 130, h: 150 } as const;
export const MARGIN = 16;
export const SNELHEID = 1.45;
export const GOUD_PAUSE_MS = 2800;
export const GOUD_NAAR_INTERVAL_MS = 10000;