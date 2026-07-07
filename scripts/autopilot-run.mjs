#!/usr/bin/env node
/**
 * Autopilot: health + maarten-sync + status + ntfy digest (GitHub Actions / lokaal)
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { spawnSync } from "child_process";

const ROOT = join(import.meta.dirname, "..");
const DATA_STATUS = join(ROOT, "data/autopilot-status.json");
const PUBLIC_STATUS = join(ROOT, "public/autopilot-status.json");
const WACHTRIJ = join(ROOT, "data/maarten-wachtrij.json");
const AGENTS_STATUS = join(ROOT, "data/agents-status.json");
const NTFY = "https://ntfy.sh/webklaar-mike";

function runNode(script) {
  const r = spawnSync("node", [join(ROOT, script)], {
    cwd: ROOT,
    encoding: "utf8",
  });
  return { ok: r.status === 0, out: (r.stdout || "") + (r.stderr || "") };
}

const health = runNode("scripts/health-check.mjs");
const sync = runNode("scripts/sync-maarten-wachtrij.mjs");

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

const managerRun = runNode("scripts/manager-agent/run.mjs");
let agentHint = null;
if (existsSync(AGENTS_STATUS)) {
  try {
    const a = JSON.parse(readFileSync(AGENTS_STATUS, "utf8"));
    agentHint = a.manager?.grokPrompt || a.agents?.manager?.grokPrompt || null;
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
  nextAgentPrompt:
    pending.length > 0
      ? `voer maarten wachtrij uit — ${pending.length} pending in OFFERTE-WIJS`
      : agentHint || "monitor check — of: npm run agent:pipeline voor leads + outreach",
  agentHint,
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