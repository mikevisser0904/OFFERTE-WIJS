#!/usr/bin/env node
/** Houd alleen actionable hits in leak-hits.json (lead-pipeline). */
import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { hitIsActionable, sanitizeHitEntry } from "./leak-actionable.mjs";

const root = process.cwd();
const path = join(root, "data/leak-hits.json");

function main() {
  const store = JSON.parse(readFileSync(path, "utf8"));
  const before = (store.hits || []).length;
  const kept = (store.hits || []).filter(hitIsActionable).map(sanitizeHitEntry);
  store.hits = kept;
  store.updatedAt = new Date().toISOString();
  store.sanitizedAt = store.updatedAt;
  writeFileSync(path, JSON.stringify(store, null, 2));
  mkdirSync(join(root, "public"), { recursive: true });
  copyFileSync(path, join(root, "public/leak-hits.json"));
  console.log(`Sanitize leak-hits: ${before} → ${kept.length} (alleen actionable phpMyAdmin/datalek)`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}