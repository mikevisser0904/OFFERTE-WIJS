#!/usr/bin/env node
import { spawnSync } from "child_process";
import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { patchAgent } from "../patch-status.mjs";

const ROOT = join(import.meta.dirname, "../../..");
const r = spawnSync("node", [join(ROOT, "scripts/health-check.mjs")], { cwd: ROOT, encoding: "utf8" });
let health = { healthy: false };
try {
  health = JSON.parse(readFileSync(join(ROOT, "public/health.json"), "utf8"));
} catch {
  /* */
}

patchAgent("health-monitor", {
  ok: health.healthy === true && r.status === 0,
  healthy: health.healthy,
  avgResponseMs: health.avgResponseMs,
  agentPrompt: health.healthy ? "health OK" : "URGENT: fix site — health-check failed",
});

console.log(health.healthy ? "Health: OK" : "Health: FAIL");
process.exit(health.healthy ? 0 : 1);