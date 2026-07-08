#!/usr/bin/env node
/**
 * Autopilot: health + dataflow + maarten-sync + (optioneel optimizer apply) + manager + status + ntfy
 * Optimizer apply standaard; alleen meten: OPTIMIZER_MEASURE_ONLY=1
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { spawnSync } from "child_process";

const ROOT = join(import.meta.dirname, "..");
const DATA_STATUS = join(ROOT, "data/autopilot-status.json");
const PUBLIC_STATUS = join(ROOT, "public/autopilot-status.json");
const WACHTRIJ = join(ROOT, "data/maarten-wachtrij.json");
const AGENTS_STATUS = join(ROOT, "data/agents-status.json");
const MANAGER_STATUS = join(ROOT, "data/manager-status.json");
const NTFY = "https://ntfy.sh/webklaar-mike";

function runNode(script, args = [], extraEnv = {}) {
  const r = spawnSync("node", [join(ROOT, script), ...args], {
    cwd: ROOT,
    encoding: "utf8",
    timeout: 900_000,
    env: { ...process.env, ...extraEnv },
  });
  return { ok: r.status === 0, out: (r.stdout || "") + (r.stderr || "") };
}

const health = runNode("scripts/agents/health-monitor/run.mjs");
runNode("scripts/agents/data-flow/run.mjs");
const sync = runNode("scripts/agents/maarten-sync/run.mjs");
runNode("scripts/agents/maarten-bouw/run.mjs");

let healthJson = { healthy: false };
try {
  healthJson = JSON.parse(readFileSync(join(ROOT, "public/health.json"), "utf8"));
} catch {
  /* ignore */
}

let pending = [];
let wachtrijTotaal = 0;
if (existsSync(WACHTRIJ)) {
  try {
    const w = JSON.parse(readFileSync(WACHTRIJ, "utf8"));
    wachtrijTotaal = w.ideeen?.length ?? 0;
    pending = (w.ideeen ?? []).filter((i) => i.status === "pending");
  } catch {
    /* ignore */
  }
}

// Standaard apply op elke autopilot-run (4u); uitzetten met OPTIMIZER_MEASURE_ONLY=1
const measureOnly =
  process.env.OPTIMIZER_MEASURE_ONLY === "1" || process.argv.includes("--optimizer-measure-only");
if (measureOnly) {
  runNode("scripts/optimizer-agent/run.mjs");
} else {
  runNode("scripts/optimizer-agent/run.mjs", ["--apply"]);
}

const managerRun = runNode("scripts/manager-agent/run.mjs");

if (process.env.OUTBOUND_IN_AUTOPILOT === "1") {
  runNode("scripts/outbound-agent/run.mjs", [], {
    SKIP_VERKOOP_PIPELINE: process.env.OUTBOUND_SKIP_PIPELINE || "1",
    VAKSCAN_SALES: process.env.VAKSCAN_SALES || "0",
  });
}

let managerGrok = null;
let managerFase = null;
let managerMike = null;
if (existsSync(MANAGER_STATUS)) {
  try {
    const m = JSON.parse(readFileSync(MANAGER_STATUS, "utf8"));
    managerGrok = m.grokPrompt || null;
    managerFase = m.fase || null;
    managerMike = m.mikeActie || null;
  } catch {
    /* ignore */
  }
}

let agentHint = managerGrok;
if (existsSync(AGENTS_STATUS)) {
  try {
    const a = JSON.parse(readFileSync(AGENTS_STATUS, "utf8"));
    agentHint = managerGrok || a.manager?.grokPrompt || a.agents?.manager?.grokPrompt || null;
  } catch {
    /* ignore */
  }
}

const now = new Date().toISOString();
const status = {
  versie: 1,
  updatedAt: now,
  healthy: healthJson.healthy === true,
  avgResponseMs: healthJson.avgResponseMs ?? null,
  pendingMaarten: pending.length,
  wachtrijTotaal,
  lastHealthCheck: healthJson.checkedAt ?? null,
  healthOk: health.ok,
  syncOk: sync.ok,
  managerOk: managerRun.ok,
  managerFase: managerFase || undefined,
  nextAgentPrompt:
    pending.length > 0
      ? `voer maarten wachtrij uit — ${pending.length} pending in OFFERTE-WIJS`
      : agentHint ||
        (process.env.VAKSCAN_SALES === "1"
          ? "npm run funnel:light of outreach — VakScan → /actie/"
          : "Mike: /fiverr/ — Fiverr gig + Marktplaats-advertentie (docs/ZERO-START.md)"),
  agentHint,
  mikeActie:
    managerMike ||
    (pending.length > 0
      ? "Maarten eerst"
      : process.env.VAKSCAN_SALES === "1"
        ? "VakScan-verkoop: /actie/ · /dashboard/"
        : "€0: Fiverr + Marktplaats op /fiverr/"),
  eerstePending: pending[0]
    ? { id: pending[0].id, tekst: pending[0].tekst?.slice(0, 120), euro: pending[0].euro }
    : null,
};

const payload = JSON.stringify(status, null, 2);
writeFileSync(DATA_STATUS, payload);
writeFileSync(PUBLIC_STATUS, payload);

const lines = [
  `Autopilot ${now.slice(0, 16)}Z`,
  healthJson.healthy ? "Site: OK" : "Site: PROBLEEM",
  `Wachtrij: ${pending.length} pending`,
  status.nextAgentPrompt,
];
if (pending.length > 0) {
  lines.push(`Eerste: ${pending[0].tekst?.slice(0, 80)}`);
}

const title = pending.length > 0 ? "Goud: agent-wachtrij" : healthJson.healthy ? "Autopilot OK" : "Site check";
const priority = !healthJson.healthy ? "urgent" : pending.length > 0 ? "high" : "default";

try {
  await fetch(NTFY, {
    method: "POST",
    headers: {
      Title: title,
      Priority: priority,
      Tags: pending.length > 0 ? "moneybag,robot" : "white_check_mark",
    },
    body: lines.join("\n"),
  });
} catch (e) {
  console.error("ntfy failed", e);
}

console.log(JSON.stringify(status));
process.exit(healthJson.healthy ? 0 : 1);