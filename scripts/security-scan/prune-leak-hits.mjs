#!/usr/bin/env node
/**
 * Verwijder verouderde false-positive panel-hits uit leak-hits.json (strikte detectie).
 */
import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { looksLikePhpMyAdminBody, isSiteNoisePage } from "./admin-panel-detect.mjs";

const root = process.cwd();
const path = join(root, "data/leak-hits.json");

async function fetchSnippet(url) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": "VakScan-Prune/1.0" },
    signal: AbortSignal.timeout(12_000),
  });
  const buf = await res.arrayBuffer();
  const body = new TextDecoder("utf8", { fatal: false }).decode(buf.slice(0, 80_000));
  return { status: res.status, body, url: res.url };
}

async function panelStillValid(finding) {
  if (finding.check !== "database") return true;
  if (!/phpmyadmin|adminer/i.test(finding.title + (finding.evidence || ""))) return true;
  if (!finding.evidence) return false;
  try {
    const pr = await fetchSnippet(finding.evidence);
    if (/adminer/i.test(finding.title)) {
      return pr.status === 200 && pr.body.toLowerCase().includes("adminer") && !isSiteNoisePage(pr.body, pr.status);
    }
    return looksLikePhpMyAdminBody(pr.body, pr.status);
  } catch {
    return false;
  }
}

async function main() {
  const store = JSON.parse(readFileSync(path, "utf8"));
  const hits = store.hits || [];
  let removedFindings = 0;
  let removedHits = 0;
  const kept = [];

  for (const hit of hits) {
    const findings = [];
    for (const f of hit.findings || []) {
      const ok = await panelStillValid(f);
      if (ok) findings.push(f);
      else removedFindings++;
    }
    if (!findings.length) {
      removedHits++;
      continue;
    }
    if (findings.length !== (hit.findings || []).length) {
      hit.findings = findings;
      hit.titles = findings.map((x) => x.title);
    }
    kept.push(hit);
  }

  store.hits = kept;
  store.updatedAt = new Date().toISOString();
  store.prunedAt = store.updatedAt;
  writeFileSync(path, JSON.stringify(store, null, 2));
  mkdirSync(join(root, "public"), { recursive: true });
  copyFileSync(path, join(root, "public/leak-hits.json"));
  console.log(`Prune klaar: ${kept.length} hits behouden, ${removedHits} hits weg, ${removedFindings} false panel-bevindingen verwijderd`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}