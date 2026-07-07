import { readFileSync, writeFileSync, copyFileSync } from "fs";
import { join } from "path";

const SITE = "https://mikevisser0904.github.io/OFFERTE-WIJS";
const root = process.cwd();

const staticPaths = [
  "",
  "start/",
  "spoed/",
  "diensten/",
  "bestellen/",
  "demo/",
  "webklaar/",
  "fiverr/",
  "marktplaats/",
  "land/",
  "spoed/",
];

const landingsTs = readFileSync(join(root, "data/seo-landingen.ts"), "utf8");
const landingSlugs = [...landingsTs.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]);

const dienstenTs = readFileSync(join(root, "data/diensten-online.ts"), "utf8");
const dienstSlugs = [...dienstenTs.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]);

const urls = [
  ...staticPaths.map((p) => `${SITE}/${p}`),
  ...landingSlugs.map((s) => `${SITE}/land/${s}/`),
  ...dienstSlugs.map((s) => `${SITE}/diensten/${s}/`),
];

const unique = [...new Set(urls)];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${unique
  .map(
    (loc) => `  <url>
    <loc>${loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${loc.endsWith("/OFFERTE-WIJS/") ? "1.0" : loc.includes("/bestellen/") || loc.includes("/diensten/") ? "0.9" : loc.includes("/land/") ? "0.8" : "0.6"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

writeFileSync(join(root, "public/sitemap.xml"), xml);
copyFileSync(join(root, "public/sitemap.xml"), join(root, "out/sitemap.xml"));
console.log(`Sitemap: ${unique.length} URLs`);