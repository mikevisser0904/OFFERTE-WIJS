import { writeFileSync, copyFileSync } from "fs";
import { join } from "path";

const SITE = "https://mikevisser0904.github.io/OFFERTE-WIJS";

const checks = [
  { name: "Homepage", path: "/" },
  { name: "Geld Dashboard", path: "/dashboard/" },
  { name: "Monitor", path: "/monitor/" },
  { name: "VakScan", path: "/scan/" },
  { name: "Agents", path: "/agents/" },
  { name: "Bestellen", path: "/bestellen/" },
  { name: "Ideeën", path: "/ideeen/" },
  { name: "Diensten", path: "/diensten/" },
  { name: "Demo", path: "/demo/" },
  { name: "Sitemap", path: "/sitemap.xml" },
  { name: "SEO Utrecht", path: "/land/website-vakman-utrecht/" },
];

async function ping(name, url) {
  const start = Date.now();
  try {
    const res = await fetch(url, { redirect: "follow" });
    return {
      name,
      url,
      ok: res.ok,
      status: res.status,
      ms: Date.now() - start,
    };
  } catch (e) {
    return {
      name,
      url,
      ok: false,
      status: 0,
      ms: Date.now() - start,
      error: String(e),
    };
  }
}

const results = await Promise.all(
  checks.map((c) => ping(c.name, `${SITE}${c.path}`))
);

const allOk = results.every((r) => r.ok);
const avgMs = Math.round(results.reduce((s, r) => s + r.ms, 0) / results.length);

const payload = {
  checkedAt: new Date().toISOString(),
  site: SITE,
  healthy: allOk,
  avgResponseMs: avgMs,
  checks: results,
  seo: {
    sitemap: results.find((r) => r.name === "Sitemap")?.ok ?? false,
    landingPages: results.find((r) => r.name === "SEO Utrecht")?.ok ?? false,
  },
};

const root = process.cwd();
const outPath = join(root, "public/health.json");
writeFileSync(outPath, JSON.stringify(payload, null, 2));

try {
  copyFileSync(outPath, join(root, "out/health.json"));
} catch {
  // out/ may not exist in CI before build
}

console.log(JSON.stringify({ healthy: allOk, avgMs, failed: results.filter((r) => !r.ok) }));
process.exit(allOk ? 0 : 1);