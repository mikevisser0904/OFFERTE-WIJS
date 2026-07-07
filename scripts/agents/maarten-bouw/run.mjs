#!/usr/bin/env node
/**
 * Maarten-bouw agent — geen code zelf; wijst Grok naar pending wachtrij.
 */
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { patchAgent } from "../patch-status.mjs";

const ROOT = join(import.meta.dirname, "../../..");
const wPath = join(ROOT, "data/maarten-wachtrij.json");
const pending = [];
if (existsSync(wPath)) {
  const w = JSON.parse(readFileSync(wPath, "utf8"));
  for (const i of w.ideeen || []) {
    if (i.status === "pending") pending.push(i);
  }
}

const eerste = pending[0];
const prompt =
  pending.length > 0
    ? `voer maarten wachtrij uit — ${pending.length} pending. Eerste: ${eerste?.tekst?.slice(0, 100)}`
    : "maarten-bouw: geen pending — focus verkopen (outreach agent)";

patchAgent("maarten-bouw", {
  ok: pending.length === 0,
  pending: pending.length,
  eerstePending: eerste ? { id: eerste.id, tekst: eerste.tekst?.slice(0, 120), euro: eerste.euro } : null,
  agentPrompt: prompt,
});

console.log(prompt);
process.exit(0);