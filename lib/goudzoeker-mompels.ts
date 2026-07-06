export const goudMompels = [
  "mmm... geld...",
  "kanker veel geld nodig",
  "10 ruggen Mike, 10 RUGGEN",
  "hier ruikt het naar euro's",
  "ruggen op de bank zouden nice zijn",
  "ik voel cash in deze hoek",
  "wiggel wiggel... bingo? nee koffie",
  "mijn hoed heeft 99.9% uptime",
  "GitHub Pages host ook mijn ego",
  "Maarten bouwt, ik philosopheer",
  "ben ik SVG of ben ik legende",
  "ik loop in 3D, jij zit in 2D",
  "configurator: IKEA maar dan duurder",
  "even rustig... NEIN MEER GOUD",
  "perspective: 900px, attitude: onbeperkt",
] as const;

export const opdringerigeMompels = [
  "HEY MIKE!!!",
  "KOM HIER",
  "NIET WEGKLIKKEN",
  "IK BEN ER NOG STEEDS",
  "GOUD WACHT NIET",
  "10 RUGGEN. NU.",
  "MIKE. MIKE. MIKE.",
  "KANKER VEEL GELD MIKE",
  "WIGGELRODE ZEGT: ACTIE",
  "IK VOLG JE CURSOR",
  "JE KUNT ME NIET ONTLOPEN",
  "TERUG. GELD. NU.",
  "HÉ MAARTEN TELLEN WERKT NIET ZO",
  "€10K OF ik blijf lopen",
  "ik ben je conscience met hoed",
] as const;

export function randomMompel(vorige?: string, opdringerig = false): string {
  const bron = opdringerig
    ? [...goudMompels, ...opdringerigeMompels]
    : [...goudMompels];
  const pool = vorige ? bron.filter((m) => m !== vorige) : bron;
  return pool[Math.floor(Math.random() * pool.length)] ?? goudMompels[0];
}

export function randomMompelBijDoel(doelLabel: string, euro?: string): string {
  const extras = [
    `HEY — ${doelLabel.toUpperCase()}!!!`,
    `${doelLabel} = ${euro ?? "GELD"} — KOM`,
    `WIGGEL SCHREEUWT: ${doelLabel}`,
    `MIKE CHECK ${doelLabel.toUpperCase()}`,
  ];
  return extras[Math.floor(Math.random() * extras.length)]!;
}

export const GROOTTE = { w: 168, h: 192 } as const;
export const MARGIN = 8;
export const SNELHEID = 0.95;
export const ORBIT_SNELHEID = 0.004;
export const GOUD_PAUSE_MS = 4500;
export const GOUD_NAAR_INTERVAL_MS = 13000;
export const MUIS_VOLG_INTERVAL_MS = 16000;
export const TERUG_NA_WEG_MS = 22000;
export const MUIS_VOLG_KANS = 0.18;
export const CENTRUM_KANS = 0.22;
export const MOMPEL_INTERVAL_MS = { min: 3200, max: 4800 } as const;