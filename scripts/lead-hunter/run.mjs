#!/usr/bin/env node
/**
 * Lead hunter pipeline: OSM → import queue → (optioneel) leak-scan
 * npm run lead:hunt
 * LEAD_SCAN=1 npm run lead:hunt   # direct leak-scan pending
 */
import { spawnSync } from "child_process";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { patchAgent } from "../agents/patch-status.mjs";

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
  run("node", ["scripts/agents/vakscan-leaks/run.mjs"]);
  run("node", ["scripts/security-scan/sanitize-leak-hits.mjs"]);
  run("node", ["scripts/lead-hunter/enrich-score.mjs"]);
}

let leadsTotaal = 0;
let queuePending = 0;
try {
  const leads = JSON.parse(readFileSync(join(root, "data/potentiele-klanten.json"), "utf8"));
  leadsTotaal = leads.totaal ?? leads.leads?.length ?? 0;
  const queue = JSON.parse(readFileSync(join(root, "data/scan-queue.json"), "utf8"));
  queuePending = (queue.items || []).filter((i) => i.status === "pending").length;
} catch {
  /* ignore */
}

patchAgent("lead-hunter", {
  ok: leadsTotaal >= 15,
  leadsTotaal,
  queuePending,
  agentPrompt:
    leadsTotaal > 0
      ? `Lead Hunter: ${leadsTotaal} leads, ${queuePending} queue pending — npm run funnel voor outreach`
      : "Lead Hunter: weinig leads — OSM opnieuw of import-queue",
});

console.log("\nLead hunt klaar → /dashboard/ (top vandaag) · /leads/ · npm run funnel voor outreach.");