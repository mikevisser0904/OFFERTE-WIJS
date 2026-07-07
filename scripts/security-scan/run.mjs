#!/usr/bin/env node
import { mkdirSync, writeFileSync, readFileSync, existsSync, copyFileSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";
import { fileURLToPath } from "url";
import { runAllChecks } from "./checks.mjs";
import { runLeakChecks } from "./leak-probes.mjs";
import { buildReport, reportToMarkdown } from "./report.mjs";
import { normalizeTargetUrl } from "./fetch-util.mjs";
import { appendHit, hasLeakFindings } from "./leak-hits.mjs";

const root = process.cwd();
const dataReports = join(root, "data/reports");
const publicReports = join(root, "public/reports");

function slugFromUrl(url) {
  return createHash("sha256").update(url).digest("hex").slice(0, 12);
}

function syncIndex() {
  const indexPath = join(publicReports, "index.json");
  const listFile = join(dataReports, ".index-list");
  const files = existsSync(listFile) ? readFileSync(listFile, "utf8").split("\n").filter(Boolean) : [];
  let list = [];
  try {
    list = JSON.parse(readFileSync(indexPath, "utf8"));
  } catch {
    list = [];
  }
  const byId = new Map(list.map((r) => [r.id, r]));
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
    });
  }
  const merged = [...byId.values()].sort((a, b) => new Date(b.scannedAt) - new Date(a.scannedAt));
  mkdirSync(publicReports, { recursive: true });
  writeFileSync(indexPath, JSON.stringify(merged, null, 2));
}

function persistReport(report) {
  mkdirSync(dataReports, { recursive: true });
  mkdirSync(publicReports, { recursive: true });

  const jsonPath = join(dataReports, `${report.id}.json`);
  const mdPath = join(dataReports, `${report.id}.md`);
  writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  writeFileSync(mdPath, reportToMarkdown(report));
  copyFileSync(jsonPath, join(publicReports, `${report.id}.json`));
  copyFileSync(mdPath, join(publicReports, `${report.id}.md`));

  const listFile = join(dataReports, ".index-list");
  let ids = existsSync(listFile) ? readFileSync(listFile, "utf8").split("\n").filter(Boolean) : [];
  if (!ids.includes(report.id)) ids.push(report.id);
  writeFileSync(listFile, ids.join("\n") + "\n");
  syncIndex();
}

/**
 * @param {{ url: string, bedrijf?: string, plaats?: string, mode?: 'full'|'leaks', saveIfClean?: boolean }} opts
 */
export async function scanOne(opts) {
  const {
    url,
    bedrijf = "",
    plaats = "",
    mode = "full",
    saveIfClean = true,
  } = opts;

  const normalized = normalizeTargetUrl(url);
  const id = slugFromUrl(normalized.href);
  const scannedAt = new Date().toISOString();

  const { findings, ctx } =
    mode === "leaks"
      ? await runLeakChecks(normalized.href)
      : await runAllChecks(normalized.href, { bedrijf, plaats });

  const leakHit = hasLeakFindings(findings);

  if (mode === "leaks" && !leakHit && !saveIfClean) {
    return {
      id,
      url: normalized.href,
      bedrijf,
      plaats,
      scannedAt,
      risicoScore: 0,
      niveau: "ok",
      niveauLabel: "OK",
      scanMode: "leaks",
      leakHit: false,
      skippedReport: true,
      findings: [],
    };
  }

  const report = buildReport({
    id,
    url: normalized.href,
    bedrijf,
    plaats,
    findings,
    scannedAt,
  });
  report.scanMode = mode;
  report.leakHit = leakHit;

  persistReport(report);

  if (leakHit) {
    appendHit({
      url: report.url,
      bedrijf: report.bedrijf,
      plaats: report.plaats,
      reportId: report.id,
      scannedAt: report.scannedAt,
      risicoScore: report.risicoScore,
      titles: report.findings.filter((f) => f.check === "database" || f.check === "datalek").map((f) => f.title),
      findings: report.findings.filter((f) => f.check === "database" || f.check === "datalek"),
    });
  }

  return report;
}

async function main() {
  const args = process.argv.slice(2);
  const urlArg = args.find((a) => !a.startsWith("--"));
  const bedrijf = args.includes("--bedrijf") ? args[args.indexOf("--bedrijf") + 1] : "";
  const plaats = args.includes("--plaats") ? args[args.indexOf("--plaats") + 1] : "";
  const mode = args.includes("--leaks") || args.includes("--mode=leaks") ? "leaks" : "full";

  if (!urlArg) {
    console.error("Gebruik: node scripts/security-scan/run.mjs <url> [--bedrijf Naam] [--plaats Stad] [--leaks]");
    process.exit(1);
  }

  console.log(`VakScan (${mode}): ${urlArg} ...`);
  const report = await scanOne({
    url: urlArg,
    bedrijf,
    plaats,
    mode,
    saveIfClean: mode !== "leaks",
  });
  if (report.skippedReport) {
    console.log("Geen database-lek — rapport niet opgeslagen.");
    return;
  }
  console.log(`Klaar — score ${report.risicoScore} (${report.niveauLabel})${report.leakHit ? " ⚠ LEK" : ""}`);
  if (report.id) console.log(`Rapport: data/reports/${report.id}.json`);
  if (report.verkoop?.whatsapp) console.log(`WhatsApp: ${report.verkoop.whatsapp}`);
}

const isCli = process.argv[1] === fileURLToPath(import.meta.url);
if (isCli) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}