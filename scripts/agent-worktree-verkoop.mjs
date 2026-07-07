#!/usr/bin/env node
/**
 * Worktree voor Verkoop-bewijs agent — geïsoleerd van main checkout.
 * npm run agent:verkoop-bewijs:worktree
 */
import { spawnSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

const ROOT = join(import.meta.dirname, "..");
const WT = process.env.AGENT_WORKTREE || join(ROOT, "..", "offerte-wijs-wt-verkoop-bewijs");
const BRANCH = "agent/verkoop-bewijs";

function run(cmd, args, cwd = ROOT) {
  const r = spawnSync(cmd, args, { cwd, stdio: "inherit", encoding: "utf8" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

if (!existsSync(join(WT, ".git"))) {
  console.log(`Worktree aanmaken: ${WT} (${BRANCH})`);
  run("git", ["worktree", "add", WT, "-b", BRANCH, "main"], ROOT);
}

const extra = process.argv.slice(2);
const agentArgs = extra.length ? extra : [];

console.log(`\n▶ Agent in worktree: ${WT}\n`);
run("npm", ["run", "agent:verkoop-bewijs", "--", ...agentArgs], WT);
console.log(`\nOpen in Cursor: ${WT}`);
console.log(`Branch: ${BRANCH} (merge naar main als je klaar bent)\n`);