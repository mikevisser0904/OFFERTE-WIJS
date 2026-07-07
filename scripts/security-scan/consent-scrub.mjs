#!/usr/bin/env node
/**
 * Ruimt scan-toestemming.json op: geen actieve entries zonder evidenceUrl of met bulk zonder echt akkoord.
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const root = process.cwd();
const path = join(root, "data/scan-toestemming.json");

function main() {
  const store = JSON.parse(readFileSync(path, "utf8"));
  let revoked = 0;
  for (const e of store.entries || []) {
    if (e.status !== "active") continue;
    const badEvidence = !e.evidenceUrl || String(e.evidenceUrl).includes("/404");
    const ref = (e.consentRef || "").toLowerCase();
    const bulkOnly =
      !e.individualConsent &&
      (e.bulkGenerated || ref.includes("bundeltoestemming")) &&
      !(e.scope || []).includes("auth-verify");
    if (e.individualConsent && e.evidenceUrl && !String(e.evidenceUrl).includes("/404")) continue;
    if (badEvidence || bulkOnly) {
      e.status = "revoked";
      e.revokedReden = badEvidence
        ? "geen geldige evidenceUrl — eerst VakScan/leak-hit"
        : "bulk-toestemming — vervang door echte schriftelijke ref van klant";
      revoked++;
    }
  }
  store.updatedAt = new Date().toISOString();
  writeFileSync(path, JSON.stringify(store, null, 2));
  const active = (store.entries || []).filter((e) => e.status === "active").length;
  console.log(`Consent scrub: ${revoked} revoked, ${active} actief over`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}