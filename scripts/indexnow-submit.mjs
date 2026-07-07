import { readFileSync } from "fs";
import { join } from "path";

const SITE = "https://mikevisser0904.github.io/OFFERTE-WIJS";
const KEY = "webklaar2026indexnowkey";
const KEY_LOCATION = `${SITE}/${KEY}.txt`;

const staticUrls = ["", "start/", "diensten/", "bestellen/", "demo/", "webklaar/"];
const root = process.cwd();
const landingsTs = readFileSync(join(root, "data/seo-landingen.ts"), "utf8");
const landingSlugs = [...landingsTs.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]);
const dienstenTs = readFileSync(join(root, "data/diensten-online.ts"), "utf8");
const dienstSlugs = [...dienstenTs.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]);

const urlList = [
  ...staticUrls.map((p) => `${SITE}/${p}`),
  ...dienstSlugs.map((s) => `${SITE}/diensten/${s}/`),
  ...landingSlugs.map((s) => `${SITE}/land/${s}/`),
].slice(0, 10_000);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    host: "mikevisser0904.github.io",
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  }),
});

console.log("IndexNow:", res.status, await res.text());
console.log("URLs submitted:", urlList.length);