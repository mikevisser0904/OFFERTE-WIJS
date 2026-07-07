#!/usr/bin/env node
/**
 * Herbouw leak-hits.json vanuit queue/leads — alleen actionable (zelfregelend).
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { runLeakChecks } from "./leak-probes.mjs";
import { hasActionableLeakFindings, sanitizeHitEntry } from "./leak-actionable.mjs";
import { createHash } from "crypto";

const root = process.cwd();
const limit = Number(process.env.REBUILD_LIMIT || 184);
const concurrency = Number(process.env.REBUILD_CONCURRENCY || 6);

function slug(url) {
  return createHash("sha256").update(url).digest("hex").slice(0, 12);
}

function loadUrls() {
  const q = join(root, "data/scan-queue.json");
  if (existsSync(q)) {
    const items = JSON.parse(readFileSync(q, "utf8")).items || [];
    return items.map((i) => ({ url: i.url, bedrijf: i.bedrijf, plaats: i.plaats }));
  }
  const p = join(root, "data/potentiele-klanten.json");
  const leads = JSON.parse(readFileSync(p, "utf8")).leads || [];
  return leads.map((l) => ({ url: l.url, bedrijf: l.bedrijf, plaats: l.plaats }));
}

async function pool(items, n, fn) {
  const out = [];
  let i = 0;
  async function w() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, w));
  return out;
}

async function main() {
  let targets = loadUrls().filter((t) => t.url);
  const seen = new Set();
  targets = targets.filter((t) => {
    const k = t.url.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  targets = targets.slice(0, limit);

  console.log(`Rebuild leak-hits: ${targets.length} URLs (parallel ${concurrency})…`);
  const hits = [];
  let scanned = 0;

  await pool(targets, concurrency, async (t) => {
    scanned++;
    if (scanned % 25 === 0) console.log(`  ${scanned}/${targets.length}…`);
    try {
      const { findings } = await runLeakChecks(t.url);
      if (!hasActionableLeakFindings(findings)) return;
      const id = slug(t.url);
      hits.push(
        sanitizeHitEntry({
          url: t.url,
          bedrijf: t.bedrijf,
          plaats: t.plaats,
          reportId: id,
          scannedAt: new Date().toISOString(),
          risicoScore: 100,
          findings: findings.filter(
            (f) =>
              f.check === "datalek" ||
              (f.check === "database" && f.verified && f.panelConfidence === "high"),
          ),
          actionable: true,
        }),
      );
      console.log(`  ✓ ${t.bedrijf || t.url}`);
    } catch (e) {
      console.warn(`  skip ${t.url}: ${e.message}`);
    }
  });

  const store = {
    updatedAt: new Date().toISOString(),
    rebuiltAt: new Date().toISOString(),
    hits: hits.sort((a, b) => b.risicoScore - a.risicoScore),
  };
  mkdirSync(join(root, "data"), { recursive: true });
  writeFileSync(join(root, "data/leak-hits.json"), JSON.stringify(store, null, 2));
  copyFileSync(join(root, "data/leak-hits.json"), join(root, "public/leak-hits.json"));
  console.log(`Klaar: ${hits.length} actionable hits (geen false positives).`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}