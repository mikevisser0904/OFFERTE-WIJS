import { readFileSync } from "fs";
import { join } from "path";

const SITE = "https://mikevisser0904.github.io/OFFERTE-WIJS";
const KEY = "webklaar2026indexnowkey";
const KEY_LOCATION = `${SITE}/${KEY}.txt`;

const staticUrls = ["", "diensten/", "bestellen/", "demo/"];
const landingsTs = readFileSync(join(process.cwd(), "data/seo-landingen.ts"), "utf8");
const landingSlugs = [...landingsTs.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]);

const urlList = [
  ...staticUrls.map((p) => `${SITE}/${p}`),
  ...landingSlugs.map((s) => `${SITE}/land/${s}/`),
].slice(0, 100);

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