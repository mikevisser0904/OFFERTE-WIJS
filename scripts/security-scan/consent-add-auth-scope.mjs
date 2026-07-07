#!/usr/bin/env node
/**
 * Zet auth-verify op alle actieve entries met individualConsent + phpMyAdmin-evidence.
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const path = join(process.cwd(), "data/scan-toestemming.json");
const store = JSON.parse(readFileSync(path, "utf8"));
let n = 0;
for (const e of store.entries || []) {
  if (e.status !== "active" || !e.individualConsent) continue;
  const ev = String(e.evidenceUrl || "").toLowerCase();
  if (!ev || ev.includes("/404") || ev.endsWith(".env")) continue;
  if (!ev.includes("phpmyadmin") && !ev.includes("adminer")) continue;
  const scope = new Set(e.scope || ["passive-deep"]);
  scope.add("passive-deep");
  scope.add("auth-verify");
  e.scope = [...scope];
  n++;
}
store.updatedAt = new Date().toISOString();
writeFileSync(path, JSON.stringify(store, null, 2));
console.log(`auth-verify scope op ${n} entries (phpMyAdmin evidence)`);

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  /* main */
}