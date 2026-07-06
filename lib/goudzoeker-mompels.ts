export const goudMompels = [
  "mmm... geld...",
  "kanker veel geld nodig",
  "10 ruggen Mike, 10 RUGGEN",
  "wiggel wiggel... bingo?",
  "hier ruikt het naar euro's",
  "€899... €899...",
  "niet bouwen — VERKOPEN",
  "WhatsApp = cash",
  "waar is me goud",
  "brrr warm goud",
  "ik voel cash",
  "nog 5 contacten",
  "Maarten bouwt, ik tel",
  "demo-link = goud",
  "snel snel SNEL",
  "ruggen op de bank",
  "hier... of hier...?",
  "slagingskans omhoog",
  "factuur factuur factuur",
  "pikhouweel? nee WIGGELRODE",
] as const;

export function randomMompel(vorige?: string): string {
  const pool = vorige
    ? goudMompels.filter((m) => m !== vorige)
    : [...goudMompels];
  return pool[Math.floor(Math.random() * pool.length)] ?? goudMompels[0];
}

export const GROOTTE = { w: 130, h: 150 } as const;
export const MARGIN = 16;
export const SNELHEID = 1.35;
export const GOUD_PAUSE_MS = 3200;
export const GOUD_NAAR_INTERVAL_MS = 14000;