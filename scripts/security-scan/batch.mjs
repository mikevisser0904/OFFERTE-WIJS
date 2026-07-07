#!/usr/bin/env node
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { scanOne } from "./run.mjs";

const root = process.cwd();
const queuePath = join(root, "data/scan-queue.json");
const publicQueue = join(root, "public/scan-queue.json");

const NTFY_TOPIC = process.env.VAKSCAN_NTFY_TOPIC || "webklaar-mike";

async function notify(title, message) {
  try {
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: "POST",
      headers: { Title: title, Tags: "warning,lock" },
      body: message,
    });
  } catch (e) {
    console.warn("ntfy mislukt:", e);
  }
}

function saveQueue(queue) {
  mkdirSync(dirname(publicQueue), { recursive: true });
  writeFileSync(queuePath, JSON.stringify(queue, null, 2));
  copyFileSync(queuePath, publicQueue);
}

async function main() {
  if (!existsSync(queuePath)) {
    console.log("Geen scan-queue.json — niets te doen.");
    return;
  }

  const queue = JSON.parse(readFileSync(queuePath, "utf8"));
  const pending = (queue.items || []).filter((i) => i.status === "pending");
  if (pending.length === 0) {
    console.log("Geen pending items.");
    return;
  }

  const done = [];
  for (const item of pending.slice(0, 10)) {
    try {
      const report = await scanOne({
        url: item.url,
        bedrijf: item.bedrijf || "",
        plaats: item.plaats || "",
      });
      item.status = "klaar";
      item.scannedAt = report.scannedAt;
      item.reportId = report.id;
      item.risicoScore = report.risicoScore;
      done.push(`${item.bedrijf || item.url} (${report.risicoScore})`);
      console.log(`OK ${item.url} → ${report.id}`);
    } catch (e) {
      item.status = "fout";
      item.fout = String(e);
      console.error(`FOUT ${item.url}:`, e);
    }
  }

  queue.updatedAt = new Date().toISOString();
  saveQueue(queue);

  if (done.length > 0) {
    await notify(`VakScan: ${done.length} rapport(en)`, done.join("\n"));
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}