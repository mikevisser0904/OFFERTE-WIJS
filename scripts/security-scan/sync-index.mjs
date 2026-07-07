#!/usr/bin/env node
/** Herbouw public/reports/index.json vanuit data/reports */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

const root = process.cwd();
const dataReports = join(root, "data/reports");
const publicReports = join(root, "public/reports");
const listFile = join(dataReports, ".index-list");
const indexPath = join(publicReports, "index.json");

const files = existsSync(listFile) ? readFileSync(listFile, "utf8").split("\n").filter(Boolean) : [];
const byId = new Map();
for (const id of files) {
  const p = join(dataReports, `${id}.json`);
  if (!existsSync(p)) continue;
  const report = JSON.parse(readFileSync(p, "utf8"));
  byId.set(report.id, {
    id: report.id,
    url: report.url,
    bedrijf: report.bedrijf,
    plaats: report.plaats,
    scannedAt: report.scannedAt,
    risicoScore: report.risicoScore,
    niveau: report.niveau,
    niveauLabel: report.niveauLabel,
    scanMode: report.scanMode,
    leakHit: !!report.leakHit,
  });
}
const merged = [...byId.values()].sort((a, b) => new Date(b.scannedAt) - new Date(a.scannedAt));
mkdirSync(publicReports, { recursive: true });
writeFileSync(indexPath, JSON.stringify(merged, null, 2));
console.log(`index: ${merged.length} rapporten`);