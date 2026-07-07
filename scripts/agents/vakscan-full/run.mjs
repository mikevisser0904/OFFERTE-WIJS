#!/usr/bin/env node
import { spawnSync } from "child_process";
import { join } from "path";
import { fileURLToPath } from "url";
import { patchAgent } from "../patch-status.mjs";

const ROOT = join(import.meta.dirname, "../../..");
const r = spawnSync("node", [join(ROOT, "scripts/security-scan/batch.mjs")], {
  cwd: ROOT,
  encoding: "utf8",
  timeout: 900_000,
});

patchAgent("vakscan-full", {
  ok: r.status === 0,
  agentPrompt: r.status === 0 ? "volledige VakScan batch klaar" : "vakscan-full mislukt — logs checken",
});

console.log((r.stdout || "").slice(-1500));
process.exit(r.status === 0 ? 0 : 1);