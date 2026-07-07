#!/usr/bin/env node
/**
 * Geïntegreerde funnel — alle agents in de juiste volgorde.
 * npm run funnel          # volledig (incl. leak-scan)
 * npm run funnel:light    # zonder zware scan
 */
import { spawnSync } from "child_process";
import { writeFileSync, mkdirSync, copyFileSync } from "fs";
import { join } from "path";
const ROOT = join(import.meta.dirname, "..");

function step(label, cmd, args = [], env = {}) {
  console.log(`\n━━ ${label} ━━`);
  const r = spawnSync(cmd, args, {
    cwd: ROOT,
    stdio: "inherit",
    shell: cmd === "npm",
    env: { ...process.env, ...env },
    timeout: 1_800_000,
  });
  const ok = r.status === 0;
  if (!ok) console.warn(`⚠ ${label} exit ${r.status}`);
  return ok;
}

const light = process.argv.includes("--light") || process.env.FUNNEL_LIGHT === "1";
const withKlantenLek = process.argv.includes("--klanten-lek") || process.env.FUNNEL_KLANTEN_LEK === "1";

const steps = [];
const started = new Date().toISOString();

steps.push({ id: "dataflow", ok: step("1 Data-flow sync", "node", ["scripts/agents/data-flow/run.mjs"]) });
steps.push({ id: "leads", ok: step("2 Lead hunt (OSM+queue+score)", "node", ["scripts/lead-hunter/run.mjs"], light ? {} : { LEAD_SCAN: "1" }) });

if (withKlantenLek) {
  steps.push({
    id: "klanten-lek",
    ok: step("3 Klanten-lek (diep)", "node", ["scripts/agents/klanten-lek/run.mjs", "--limit=40"]),
  });
} else if (!light) {
  steps.push({ id: "vakscan-leaks", ok: step("3 VakScan leaks", "npm", ["run", "agent:vakscan-leaks"]) });
}

steps.push({ id: "score", ok: step("4 Lead score refresh", "node", ["scripts/lead-hunter/enrich-score.mjs"]) });
steps.push({ id: "contact", ok: step("4b Contact + verkooptekst", "node", ["scripts/lead-hunter/grab-contact.mjs"]) });
steps.push({ id: "berichten", ok: step("4c Persoonlijke schrik-berichten", "node", ["scripts/lead-hunter/personalize-verkoop.mjs"]) });
steps.push({ id: "outreach", ok: step("5 Outreach", "npm", ["run", "agent:outreach"]) });
steps.push({ id: "optimizer", ok: step("6 Optimizer (meten)", "node", ["scripts/optimizer-agent/run.mjs"]) });
steps.push({ id: "dataflow2", ok: step("7 Data-flow sync", "node", ["scripts/agents/data-flow/run.mjs"]) });
steps.push({ id: "manager", ok: step("8 Manager", "npm", ["run", "agent:manager"]) });

const payload = {
  startedAt: started,
  finishedAt: new Date().toISOString(),
  mode: light ? "light" : withKlantenLek ? "klanten-lek" : "full",
  steps,
  ok: steps.every((s) => s.ok),
  next: "Mike: /dashboard/ (top vandaag) · /agents/ (outreach) · /actie/",
};

const out = join(ROOT, "data/funnel-status.json");
writeFileSync(out, JSON.stringify(payload, null, 2));
mkdirSync(join(ROOT, "public"), { recursive: true });
copyFileSync(out, join(ROOT, "public/funnel-status.json"));

console.log("\n" + payload.next);
process.exit(payload.ok ? 0 : 1);