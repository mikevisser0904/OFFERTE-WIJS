#!/usr/bin/env node
import { spawnSync } from "child_process";
import { join } from "path";
import { fileURLToPath } from "url";
import { patchAgent } from "../patch-status.mjs";

const ROOT = join(import.meta.dirname, "../../..");
const file = process.argv[2];
const args = file ? [join(ROOT, "scripts/kpi-snapshot.mjs"), file] : [join(ROOT, "scripts/kpi-snapshot.mjs")];
const r = spawnSync("node", args, { cwd: ROOT, encoding: "utf8" });

patchAgent("kpi", {
  ok: r.status === 0,
  agentPrompt: r.status === 0 ? "KPI snapshot OK" : "kpi agent: npm run kpi:snapshot -- export.json",
});

console.log(r.stdout || r.stderr);
process.exit(r.status === 0 ? 0 : 1);