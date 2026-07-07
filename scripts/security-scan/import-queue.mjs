#!/usr/bin/env node
/**
 * Importeer bulk URL's in scan-queue.json
 *
 * npm run scan:import -- urls.txt
 * npm run scan:import -- leads.csv
 *
 * txt: één URL per regel, optioneel "Naam|Plaats|https://..."
 * csv: kolommen url,bedrijf,plaats (header optioneel)
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = process.cwd();
const queuePath = join(root, "data/scan-queue.json");
const publicQueue = join(root, "public/scan-queue.json");

function loadQueue() {
  if (!existsSync(queuePath)) {
    return { updatedAt: new Date().toISOString(), items: [] };
  }
  return JSON.parse(readFileSync(queuePath, "utf8"));
}

function saveQueue(queue) {
  queue.updatedAt = new Date().toISOString();
  mkdirSync(dirname(publicQueue), { recursive: true });
  writeFileSync(queuePath, JSON.stringify(queue, null, 2));
  copyFileSync(queuePath, publicQueue);
}

function parseLine(line) {
  const t = line.trim();
  if (!t || t.startsWith("#")) return null;
  if (t.includes("|")) {
    const [bedrijf, plaats, url] = t.split("|").map((s) => s.trim());
    return { bedrijf: bedrijf || "", plaats: plaats || "", url };
  }
  if (t.includes(",")) {
    const parts = t.split(",").map((s) => s.trim());
    if (parts[0]?.toLowerCase() === "url") return null;
    if (parts.length >= 3) return { url: parts[0], bedrijf: parts[1], plaats: parts[2] };
    if (parts.length === 1) return { url: parts[0], bedrijf: "", plaats: "" };
  }
  return { url: t, bedrijf: "", plaats: "" };
}

function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Gebruik: node scripts/security-scan/import-queue.mjs <urls.txt|leads.csv>");
    process.exit(1);
  }
  const text = readFileSync(join(root, file), "utf8");
  const queue = loadQueue();
  const seen = new Set(queue.items.map((i) => i.url.replace(/\/$/, "").toLowerCase()));
  let added = 0;

  for (const line of text.split("\n")) {
    const row = parseLine(line);
    if (!row?.url) continue;
    let url = row.url;
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
    const key = url.replace(/\/$/, "").toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    queue.items.push({
      id: `q-${Date.now().toString(36)}-${added}`,
      bedrijf: row.bedrijf || "",
      plaats: row.plaats || "",
      url,
      status: "pending",
      toegevoegd: new Date().toISOString(),
    });
    added++;
  }

  saveQueue(queue);
  console.log(`${added} URL's toegevoegd. Totaal queue: ${queue.items.length} (pending: ${queue.items.filter((i) => i.status === "pending").length})`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}