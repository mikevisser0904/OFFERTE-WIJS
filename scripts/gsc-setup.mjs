#!/usr/bin/env node
/**
 * GSC: check verificatie + sitemap live, update status, open console (macOS).
 * Sitemap indienen in GSC UI blijft 1 klik na verificatie (geen API-key in repo).
 */
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { spawnSync } from "child_process";

const ROOT = join(import.meta.dirname, "..");
const SITE = "https://mikevisser0904.github.io/OFFERTE-WIJS/";
const SITEMAP = `${SITE}sitemap.xml`;
const HOME = SITE;
const VERIFY_FILE = `${SITE}googlec6b9c20bff6e7f49.html`;
const DATA = join(ROOT, "data/gsc-status.json");
const PUBLIC = join(ROOT, "public/gsc-status.json");

async function fetchOk(url, ms = 25_000) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ms);
  try {
    const r = await fetch(url, { signal: ac.signal, redirect: "follow" });
    const text = await r.text();
    return { ok: r.ok, status: r.status, text };
  } catch (e) {
    return { ok: false, status: 0, text: String(e?.message || e) };
  } finally {
    clearTimeout(t);
  }
}

const [home, map, vfile] = await Promise.all([
  fetchOk(HOME),
  fetchOk(SITEMAP),
  fetchOk(VERIFY_FILE),
]);

const metaVerify =
  home.ok && /google-site-verification|name="google-site-verification"/i.test(home.text);
const fileVerify =
  vfile.ok && vfile.text.includes("google-site-verification: googlec6b9c20bff6e7f49");
const sitemapOk = map.ok && map.text.includes("<urlset");
const urlCount = sitemapOk ? (map.text.match(/<loc>/g) || []).length : 0;

const verified = metaVerify || fileVerify;
const status = {
  versie: 1,
  updatedAt: new Date().toISOString(),
  property: SITE,
  sitemap: SITEMAP,
  verified,
  checks: {
    homepage: home.status,
    sitemap: map.status,
    verifyFile: vfile.status,
    metaTag: metaVerify,
    htmlFile: fileVerify,
    sitemapUrls: urlCount,
  },
  mikeActie: verified
    ? `GSC open → Sitemaps → voeg toe: sitemap.xml (of herindienen)`
    : `GSC → property ${SITE} → HTML-tag OF bestand googlec6b9… — daarna Verifiëren`,
  urls: {
    welcome: "https://search.google.com/search-console/welcome",
    sitemaps: `https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent(SITE)}`,
    addProperty: `https://search.google.com/search-console?resource_id=${encodeURIComponent(SITE)}`,
  },
};

writeFileSync(DATA, JSON.stringify(status, null, 2));
mkdirSync(join(ROOT, "public"), { recursive: true });
writeFileSync(PUBLIC, JSON.stringify(status, null, 2));

if (process.platform === "darwin") {
  spawnSync("open", [status.urls.sitemaps], { stdio: "ignore" });
}

console.log(JSON.stringify(status));
if (!sitemapOk) process.exit(1);
process.exit(verified ? 0 : 2);