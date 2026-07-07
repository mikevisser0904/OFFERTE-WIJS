#!/usr/bin/env node
/**
 * Voegt max 1 landing toe uit data/seo-landing-pool.json → data/seo-landingen.ts
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const ROOT = join(import.meta.dirname, "..");
const POOL = join(ROOT, "data/seo-landing-pool.json");
const LAND = join(ROOT, "data/seo-landingen.ts");

function main() {
  if (!existsSync(POOL)) {
    console.log("seo-pool: geen pool file");
    return;
  }
  const pool = JSON.parse(readFileSync(POOL, "utf8"));
  const pending = pool.pending || [];
  if (!pending.length) {
    console.log("seo-pool: leeg");
    return;
  }

  let land = readFileSync(LAND, "utf8");
  const next = pending[0];
  if (land.includes(`slug: "${next.slug}"`)) {
    console.log(`seo-pool: ${next.slug} bestaat al`);
    pool.pending = pending.slice(1);
    writeFileSync(POOL, JSON.stringify(pool, null, 2));
    return;
  }

  const block = `  {
    slug: "${next.slug}",
    title: ${JSON.stringify(next.title)},
    h1: ${JSON.stringify(next.h1)},
    metaDescription: ${JSON.stringify(next.metaDescription)},
    keywords: ${JSON.stringify(next.keywords)},
    intro: ${JSON.stringify(next.intro)},
    paragraphs: ${JSON.stringify(next.paragraphs)},
    dienst: "${next.dienst || "vakman-site"}",
${next.stad ? `    stad: ${JSON.stringify(next.stad)},\n` : ""}  },
`;

  const marker = "\n];\n\nexport function getSeoLanding";
  if (!land.includes(marker)) {
    console.error("seo-pool: kan seo-landingen.ts niet patchen");
    process.exit(1);
  }
  land = land.replace(marker, `,\n${block}];\n\nexport function getSeoLanding`);
  writeFileSync(LAND, land);

  pool.pending = pending.slice(1);
  pool.lastAdded = { slug: next.slug, at: new Date().toISOString() };
  writeFileSync(POOL, JSON.stringify(pool, null, 2));
  console.log(`seo-pool: toegevoegd ${next.slug}`);
}

main();