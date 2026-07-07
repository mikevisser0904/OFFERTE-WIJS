#!/usr/bin/env node
/**
 * Demo: toon dat VakScan phpMyAdmin live kan bevestigen (GET, geen inlog).
 * npm run demo:pma-proof
 */
import { writeFileSync, copyFileSync, mkdirSync } from "fs";
import { join } from "path";
import { haalAdminBewijs } from "../lead-hunter/admin-proof.mjs";
import { detectPhpMyAdmin, extractTitle } from "./admin-panel-detect.mjs";
import { confirmDatabaseEvidence } from "./leak-actionable.mjs";

const DEMO_URLS = [
  { bedrijf: "Burggraeve Woonstyling", url: "https://www.bwstyling.nl/phpmyadmin/" },
  { bedrijf: "Firma Fred van Rijn", url: "https://s230.webhostingserver.nl/phpMyAdmin/" },
  { bedrijf: "Tafelboom", url: "https://tafelboom.nl/phpMyAdmin/" },
];

async function probe(loginUrl) {
  const res = await fetch(loginUrl, {
    method: "GET",
    redirect: "follow",
    headers: { "User-Agent": "VakScan-Demo/1.0", Accept: "text/html" },
    signal: AbortSignal.timeout(15_000),
  });
  const html = new TextDecoder("utf8", { fatal: false }).decode(
    (await res.arrayBuffer()).slice(0, 80_000),
  );
  const pma = detectPhpMyAdmin(html);
  return {
    httpStatus: res.status,
    finalUrl: res.url,
    title: extractTitle(html),
    hasPmaUsername: /name=["']pma_username/i.test(html),
    panelKind: pma?.kind ?? null,
    snippet: html.replace(/\s+/g, " ").slice(0, 280),
  };
}

async function main() {
  const runs = [];
  for (const d of DEMO_URLS) {
    const proof = await haalAdminBewijs(d.url);
    const raw = await probe(d.url);
    const dbOk = await confirmDatabaseEvidence(d.url);
    runs.push({
      bedrijf: d.bedrijf,
      loginUrl: d.url,
      adminProofOk: !!proof?.ok,
      databaseEvidence: dbOk,
      proofSummary: proof?.magClaimen || proof?.zichtbaar || proof?.reden,
      ...raw,
    });
    console.log(`\n▸ ${d.bedrijf}`);
    console.log(`  URL: ${d.url}`);
    console.log(`  HTTP ${raw.httpStatus} · proof.ok=${proof?.ok} · dbEvidence=${dbOk}`);
    console.log(`  ${proof?.magClaimen || raw.title || "—"}`);
  }

  const out = {
    at: new Date().toISOString(),
    disclaimer: "Passieve demo — geen wachtwoord, geen data-export. Inlog: scan-toestemming.local.json + scan:consent.",
    runs,
  };
  const path = join(process.cwd(), "data/demo-pma-proof.json");
  writeFileSync(path, JSON.stringify(out, null, 2));
  mkdirSync(join(process.cwd(), "public"), { recursive: true });
  copyFileSync(path, join(process.cwd(), "public/demo-pma-proof.json"));
  console.log("\n→ data/demo-pma-proof.json (ook public/ voor dashboard)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});