#!/usr/bin/env node
import { spawnSync } from "child_process";
import { join } from "path";
import { fileURLToPath } from "url";
import { patchAgent } from "../patch-status.mjs";

const ROOT = join(import.meta.dirname, "../../..");
const sitemap = spawnSync("node", [join(ROOT, "scripts/generate-sitemap.mjs")], { cwd: ROOT, encoding: "utf8" });
const indexnow = spawnSync("node", [join(ROOT, "scripts/indexnow-submit.mjs")], { cwd: ROOT, encoding: "utf8" });

const ok = sitemap.status === 0;
patchAgent("seo", {
  ok,
  sitemapOk: sitemap.status === 0,
  indexnowOk: indexnow.status === 0,
  agentPrompt: ok ? "SEO sitemap bijgewerkt" : "seo agent: sitemap fixen",
});

process.exit(ok ? 0 : 1);