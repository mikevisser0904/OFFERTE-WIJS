#!/usr/bin/env node
/**
 * Traffic-agent: pool vullen, landings toevoegen, sitemap, IndexNow, status.
 * Geen VakScan-outreach. Wel SEO-pagina's voor organisch verkeer.
 */
import { spawnSync } from "child_process";
import { readFileSync, writeFileSync, copyFileSync, existsSync } from "fs";
import { join } from "path";

const ROOT = join(import.meta.dirname, "..");
const MAX_ADD = Number(process.env.TRAFFIC_LANDINGS_PER_RUN || "3");
const DATA_STATUS = join(ROOT, "data/traffic-status.json");
const PUBLIC_STATUS = join(ROOT, "public/traffic-status.json");

function runNode(script, args = []) {
  const r = spawnSync("node", [join(ROOT, script), ...args], {
    cwd: ROOT,
    encoding: "utf8",
    timeout: 600_000,
  });
  return { ok: r.status === 0, out: (r.stdout || "") + (r.stderr || "") };
}

const started = new Date().toISOString();
const steps = [];

steps.push({ id: "fill-pool", ...runNode("scripts/seo-fill-pool.mjs") });
let added = 0;
for (let i = 0; i < MAX_ADD; i++) {
  const r = runNode("scripts/seo-add-from-pool.mjs");
  steps.push({ id: `add-${i + 1}`, ...r });
  if (!r.ok || r.out.includes("leeg") || r.out.includes("bestaat al")) break;
  if (r.out.includes("toegevoegd")) added++;
}

const sitemap = runNode("scripts/generate-sitemap.mjs");
steps.push({ id: "sitemap", ...sitemap });

const indexnow = runNode("scripts/indexnow-submit.mjs");
steps.push({ id: "indexnow", ...indexnow });

let urlCount = 0;
try {
  const xml = readFileSync(join(ROOT, "public/sitemap.xml"), "utf8");
  urlCount = (xml.match(/<loc>/g) || []).length;
} catch {
  /* */
}

const landText = readFileSync(join(ROOT, "data/seo-landingen.ts"), "utf8");
const landingCount = (landText.match(/slug: "/g) || []).length - 1; // minus type slug

const status = {
  versie: 1,
  updatedAt: new Date().toISOString(),
  startedAt: started,
  landingsAddedThisRun: added,
  landingPagesTotal: landingCount,
  sitemapUrls: urlCount,
  steps: steps.map((s) => ({ id: s.id, ok: s.ok })),
  ok: steps.every((s) => s.ok !== false),
  next: "Google Search Console: npm run setup:gsc · Deel /start/ op social",
  grokPrompt: `traffic OK — ${added} landings toegevoegd, ${urlCount} URLs sitemap. Geen outreach.`,
};

const payload = JSON.stringify(status, null, 2);
writeFileSync(DATA_STATUS, payload);
if (existsSync(join(ROOT, "public"))) {
  writeFileSync(PUBLIC_STATUS, payload);
}

console.log(JSON.stringify(status));
process.exit(status.ok ? 0 : 1);