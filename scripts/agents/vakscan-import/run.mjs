#!/usr/bin/env node
import { spawnSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { patchAgent } from "../patch-status.mjs";

const ROOT = join(import.meta.dirname, "../../..");
const file = process.argv[2] || "data/klanten-leads-import.txt";
const r = spawnSync("node", [join(ROOT, "scripts/security-scan/import-queue.mjs"), file], {
  cwd: ROOT,
  encoding: "utf8",
  shell: false,
});

let pending = 0;
const qPath = join(ROOT, "data/scan-queue.json");
if (existsSync(qPath)) {
  const q = JSON.parse(readFileSync(qPath, "utf8"));
  pending = (q.items || []).filter((i) => i.status === "pending").length;
}

patchAgent("vakscan-import", {
  ok: r.status === 0,
  importFile: file,
  queuePending: pending,
  agentPrompt: `import klaar — ${pending} pending. Start vakscan-leaks agent.`,
});

console.log(r.stdout || r.stderr);
process.exit(r.status === 0 ? 0 : 1);