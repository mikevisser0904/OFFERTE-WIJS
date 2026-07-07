#!/usr/bin/env node
/**
 * Lead hunter pipeline: OSM → import queue → (optioneel) leak-scan
 * npm run lead:hunt
 * LEAD_SCAN=1 npm run lead:hunt   # direct leak-scan pending
 */
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function run(cmd, args) {
  console.log(`\n> ${cmd} ${args.join(" ")}`);
  const r = spawnSync(cmd, args, { cwd: root, stdio: "inherit", shell: false });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

run("node", ["scripts/lead-hunter/osm-fetch.mjs"]);
run("node", ["scripts/security-scan/import-queue.mjs", "data/klanten-leads-import.txt"]);
run("node", ["scripts/lead-hunter/queue-clean.mjs"]);
run("node", ["scripts/lead-hunter/enrich-score.mjs"]);

if (process.env.LEAD_SCAN === "1") {
  run("node", [
    "scripts/security-scan/batch.mjs",
    "--mode=leaks",
    `--limit=${process.env.VAKSCAN_LIMIT || "300"}`,
    `--concurrency=${process.env.VAKSCAN_CONCURRENCY || "4"}`,
  ]);
  run("node", ["scripts/lead-hunter/enrich-score.mjs"]);
}

console.log("\nLead hunt klaar → /dashboard/ (top vandaag) · /leads/ · leak-hits na scan.");