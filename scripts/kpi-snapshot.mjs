#!/usr/bin/env node
/**
 * Merge exported monitor KPI JSON into data/ + public/ kpi-snapshot.json
 * Usage: npm run kpi:snapshot -- ./webklaar-monitor-2026-07-07.json
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const file = process.argv[2];
if (!file) {
  console.error("Geef pad naar geëxporteerde KPI JSON (van Monitor → Exporteer JSON)");
  process.exit(1);
}

const kpi = JSON.parse(readFileSync(file, "utf8"));
const payload = {
  versie: 1,
  updatedAt: new Date().toISOString(),
  updatedBy: process.env.USER || "local",
  kpi,
  note: "Team-snapshot voor GitHub Pages monitor",
};

const root = process.cwd();
for (const dir of ["data", "public"]) {
  writeFileSync(join(root, dir, "kpi-snapshot.json"), JSON.stringify(payload, null, 2));
}
console.log("kpi-snapshot.json geschreven in data/ en public/");