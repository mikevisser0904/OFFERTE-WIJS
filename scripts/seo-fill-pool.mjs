#!/usr/bin/env node
/**
 * Vult seo-landing-pool.json met NL stad × vak-combinaties (max 20 pending).
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const ROOT = join(import.meta.dirname, "..");
const POOL = join(ROOT, "data/seo-landing-pool.json");
const LAND = join(ROOT, "data/seo-landingen.ts");

const steden = [
  "Amsterdam",
  "Rotterdam",
  "Den Haag",
  "Eindhoven",
  "Groningen",
  "Arnhem",
  "Breda",
  "Nijmegen",
  "Haarlem",
  "Alkmaar",
  "Zwolle",
  "Maastricht",
  "Leiden",
  "Amersfoort",
  "Tilburg",
];

const vakken = [
  { key: "loodgieter", label: "loodgieter", dienst: "vakman-site" },
  { key: "elektricien", label: "elektricien", dienst: "vakman-site" },
  { key: "schilder", label: "schilder", dienst: "vakman-site" },
  { key: "hovenier", label: "hovenier", dienst: "vakman-site" },
  { key: "dakdekker", label: "dakdekker", dienst: "vakman-site" },
  { key: "isolatie", label: "isolatiebedrijf", dienst: "vakman-site" },
  { key: "kozijnen", label: "kozijnenbedrijf", dienst: "vakman-site" },
  { key: "zonwering", label: "zonweringbedrijf", dienst: "vakman-site" },
  { key: "google-vakman", label: "vakman", dienst: "google-start", google: true },
];

function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function bestaat(slug, landText, pending) {
  if (landText.includes(`slug: "${slug}"`)) return true;
  return pending.some((p) => p.slug === slug);
}

function maakEntry(stad, vak) {
  const stadSlug = slugify(stad);
  const slug = vak.google
    ? `google-start-${vak.key}-${stadSlug}`
    : `website-${vak.key}-${stadSlug}`;
  const h1 = vak.google
    ? `Google Start voor ${vak.label} in ${stad}`
    : `Website voor ${vak.label} in ${stad}`;
  return {
    slug,
    title: `${h1} — vaste prijs | WebKlaar`,
    h1,
    metaDescription: vak.google
      ? `Google Business + one-pager voor ${vak.label} in ${stad}. €299, live in 2 dagen. Bestel online.`
      : `Professionele website voor ${vak.label} in ${stad}. €899, 3 dagen, mobiel + WhatsApp. Vaste prijs.`,
    keywords: vak.google
      ? [`google business ${vak.label} ${stad}`, `online vindbaar ${stad}`]
      : [`website ${vak.label} ${stad}`, `website laten maken ${stad}`],
    intro: `${stad}: klanten zoeken op Google — een verouderde of ontbrekende site kost aanvragen.`,
    paragraphs: [
      `WebKlaar levert vaste-prijs pakketten voor ${vak.label} in ${stad} en omgeving.`,
      vak.google
        ? "Google Start €299: profiel, one-pager, WhatsApp. Geen bureau-tarieven."
        : "Vakman Website €899: 5 pagina's, demo beschikbaar, hosting 1 jaar inbegrepen.",
    ],
    dienst: vak.dienst,
    stad,
  };
}

const pool = existsSync(POOL)
  ? JSON.parse(readFileSync(POOL, "utf8"))
  : { uitleg: "Pool voor seo-landingen.ts", pending: [] };
const pending = pool.pending || [];
const landText = readFileSync(LAND, "utf8");
const maxPending = 24;
const target = maxPending - pending.length;
let added = 0;

for (const stad of steden) {
  if (added >= target) break;
  for (const vak of vakken) {
    if (added >= target) break;
    const entry = maakEntry(stad, vak);
    if (bestaat(entry.slug, landText, pending)) continue;
    pending.push(entry);
    added++;
  }
}

pool.pending = pending;
pool.lastFill = { added, at: new Date().toISOString(), pendingCount: pending.length };
writeFileSync(POOL, JSON.stringify(pool, null, 2));
console.log(`seo-fill-pool: +${added} pending (totaal ${pending.length})`);