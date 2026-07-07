#!/usr/bin/env node
/**
 * Nieuwe order (Fiverr / Marktplaats / direct) → Maarten-wachtrij + optioneel ntfy.
 *
 * npm run order:intake -- --bedrijf "X" --kanaal fiverr --prijs 199 --email a@b.nl --notities "..."
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync } from "fs";
import { join } from "path";
import { randomBytes } from "crypto";

const ROOT = join(import.meta.dirname, "..");
const WACHTRIJ = join(ROOT, "data/maarten-wachtrij.json");
const PUBLIC = join(ROOT, "public/maarten-wachtrij.json");
const NTFY = process.env.VAKSCAN_NTFY_TOPIC || "webklaar-mike";
const DEMO = "https://mikevisser0904.github.io/OFFERTE-WIJS/demo/";

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : null;
}

function loadWachtrij() {
  if (!existsSync(WACHTRIJ)) {
    return { versie: 1, repo: "OFFERTE-WIJS", lastSync: null, lastNtfyId: null, ideeen: [] };
  }
  return JSON.parse(readFileSync(WACHTRIJ, "utf8"));
}

function main() {
  const bedrijf = arg("bedrijf");
  const kanaal = arg("kanaal") || "direct";
  const prijs = arg("prijs") || "?";
  const email = arg("email") || "";
  const telefoon = arg("telefoon") || "";
  const notities = arg("notities") || "";

  if (!bedrijf) {
    console.error(
      'Gebruik: npm run order:intake -- --bedrijf "Naam" --kanaal fiverr|marktplaats|direct --prijs 199 [--email] [--notities]',
    );
    process.exit(1);
  }

  const id = `order-${randomBytes(4).toString("hex")}`;
  const tijd = Date.now();
  const euro = kanaal === "fiverr" ? `$${prijs}` : `€${prijs}`;
  const tekst = `ORDER ${kanaal}: ${bedrijf} — 5-pagina site (template demo)`;

  const agentOpdracht = `## Site-order — leveren (Maarten)

**Order-ID:** ${id}
**Kanaal:** ${kanaal}
**Bedrijf:** ${bedrijf}
**Prijs:** ${euro}
**Contact:** ${email || telefoon || "via platform"}

### Checklist
1. Template klonen van OFFERTE-WIJS demo (${DEMO})
2. Logo, kleuren, teksten, foto's van klant
3. 5 pagina's: home, diensten, over, projecten, contact
4. Build + deploy naar klant-hosting
5. Mike: oplevering op ${kanaal} + review vragen

### Notities
${notities || "(geen)"}

_Grok hoeft dit niet te coden tenzij Maarten een aparte repo wil — dit is bouw-werk voor Maarten._`;

  const item = {
    id,
    tekst,
    euro,
    tijd,
    van: "Mike",
    status: "pending",
    agentOpdracht,
    aangemaakt: new Date(tijd).toISOString(),
    orderMeta: { kanaal, bedrijf, email, telefoon, prijs },
  };

  const w = loadWachtrij();
  w.ideeen.unshift(item);
  w.lastSync = new Date().toISOString();
  writeFileSync(WACHTRIJ, JSON.stringify(w, null, 2));
  copyFileSync(WACHTRIJ, PUBLIC);

  console.log(`Wachtrij: ${id} — ${bedrijf} (${kanaal})`);
  console.log("Maarten: open data/maarten-wachtrij.json");

  void fetch(`https://ntfy.sh/${NTFY}`, {
    method: "POST",
    headers: { Title: `Order: ${bedrijf}`, Tags: "moneybag,package", Priority: "high" },
    body: `${kanaal} · ${euro}\n${tekst}\n${email || ""}`,
  }).catch(() => {});
}

main();