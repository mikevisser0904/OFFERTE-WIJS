#!/usr/bin/env node
import { spawnSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { patchAgent } from "../patch-status.mjs";

const ROOT = join(import.meta.dirname, "../../..");
const r = spawnSync("node", [join(ROOT, "scripts/sync-maarten-wachtrij.mjs")], { cwd: ROOT, encoding: "utf8" });
const wPath = join(ROOT, "data/maarten-wachtrij.json");
let pending = 0;
if (existsSync(wPath)) {
  const w = JSON.parse(readFileSync(wPath, "utf8"));
  pending = (w.ideeen || []).filter((i) => i.status === "pending").length;
}

patchAgent("maarten-sync", {
  ok: r.status === 0,
  pending,
  agentPrompt: pending > 0 ? `${pending} nieuwe/synced ideeën — zie maarten-bouw agent` : "maarten-sync OK, geen nieuwe pending",
});

console.log(`Maarten-sync: ${pending} pending`);
process.exit(r.status === 0 ? 0 : 1);