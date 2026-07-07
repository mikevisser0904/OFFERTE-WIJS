#!/usr/bin/env node
import { spawnSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { patchAgent } from "../patch-status.mjs";

const ROOT = join(import.meta.dirname, "../../..");
const r = spawnSync("node", [join(ROOT, "scripts/security-scan/batch.mjs"), "--mode=leaks"], {
  cwd: ROOT,
  encoding: "utf8",
  timeout: 900_000,
});

let leaks = 0;
let pending = 0;
const lPath = join(ROOT, "data/leak-hits.json");
const qPath = join(ROOT, "data/scan-queue.json");
if (existsSync(lPath)) leaks = JSON.parse(readFileSync(lPath, "utf8")).hits?.length ?? 0;
if (existsSync(qPath)) pending = JSON.parse(readFileSync(qPath, "utf8")).items?.filter((i) => i.status === "pending").length ?? 0;

spawnSync("node", [join(ROOT, "scripts/security-scan/sanitize-leak-hits.mjs")], { cwd: ROOT, stdio: "inherit" });
if (existsSync(lPath)) leaks = JSON.parse(readFileSync(lPath, "utf8")).hits?.length ?? 0;

patchAgent("vakscan-leaks", {
  ok: r.status === 0,
  leakHits: leaks,
  queuePending: pending,
  agentPrompt: leaks > 0 ? `${leaks} lek(ken) — outreach agent` : `scan klaar, ${pending} nog pending`,
});

console.log((r.stdout || "").slice(-1500));
process.exit(r.status === 0 ? 0 : 1);