#!/usr/bin/env node
/** Draait alle lichte status-agents (geen zware scan). */
import { spawnSync } from "child_process";
import { join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(import.meta.dirname, "../..");
const LIGHT = [
  "scripts/agents/health-monitor/run.mjs",
  "scripts/agents/maarten-sync/run.mjs",
  "scripts/agents/maarten-bouw/run.mjs",
  "scripts/outreach-agent/run.mjs",
];

for (const script of LIGHT) {
  spawnSync("node", [join(ROOT, script)], { cwd: ROOT, encoding: "utf8", stdio: "inherit" });
}
spawnSync("node", [join(ROOT, "scripts/manager-agent/run.mjs")], { cwd: ROOT, stdio: "inherit" });

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  /* main */
}