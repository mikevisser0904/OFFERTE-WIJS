#!/usr/bin/env node
/** Organisch verkeer — geen VakScan, geen outreach */
import { spawnSync } from "child_process";
import { join } from "path";

const ROOT = join(import.meta.dirname, "..");

function step(label, script, args = [], env = {}) {
  console.log(`\n━━ ${label} ━━`);
  const r = spawnSync("node", [join(ROOT, script), ...args], {
    cwd: ROOT,
    stdio: "inherit",
    env: { ...process.env, VAKSCAN_SALES: "0", ...env },
    timeout: 900_000,
  });
  return r.status === 0;
}

step("Data-flow", "scripts/agents/data-flow/run.mjs");
step("Traffic", "scripts/traffic-run.mjs", [], { TRAFFIC_LANDINGS_PER_RUN: "3" });
step("Health", "scripts/agents/health-monitor/run.mjs");
step("Manager", "scripts/manager-agent/run.mjs");
console.log("\n✓ funnel:traffic klaar — commit + push voor live landings");