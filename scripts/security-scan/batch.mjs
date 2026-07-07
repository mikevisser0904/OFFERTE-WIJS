#!/usr/bin/env node
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { scanOne } from "./run.mjs";

const root = process.cwd();
const queuePath = join(root, "data/scan-queue.json");
const publicQueue = join(root, "public/scan-queue.json");

const NTFY_TOPIC = process.env.VAKSCAN_NTFY_TOPIC || "webklaar-mike";

function parseArgs(argv) {
  const mode =
    argv.includes("--leaks") || argv.includes("--mode=leaks") || process.env.VAKSCAN_MODE === "leaks"
      ? "leaks"
      : "full";
  const limit = Number(
    argv.find((a) => a.startsWith("--limit="))?.split("=")[1] ||
      process.env.VAKSCAN_LIMIT ||
      (mode === "leaks" ? 200 : 10)
  );
  const concurrency = Math.min(
    8,
    Math.max(
      1,
      Number(
        argv.find((a) => a.startsWith("--concurrency="))?.split("=")[1] ||
          process.env.VAKSCAN_CONCURRENCY ||
          (mode === "leaks" ? 4 : 1)
      )
    )
  );
  const delayMs = Number(
    argv.find((a) => a.startsWith("--delay="))?.split("=")[1] || process.env.VAKSCAN_DELAY_MS || 400
  );
  const saveIfClean = argv.includes("--save-all") || process.env.VAKSCAN_SAVE_ALL === "1";
  return { mode, limit, concurrency, delayMs, saveIfClean };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function notify(title, message) {
  try {
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: "POST",
      headers: { Title: title, Tags: "warning,lock" },
      body: message.slice(0, 3500),
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

async function runPool(items, concurrency, delayMs, worker) {
  let index = 0;
  async function loop() {
    while (true) {
      const i = index++;
      if (i >= items.length) break;
      await worker(items[i], i);
      if (delayMs > 0) await sleep(delayMs);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, loop));
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

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

  const batch = pending.slice(0, opts.limit);
  console.log(
    `VakScan batch: mode=${opts.mode} sites=${batch.length} concurrency=${opts.concurrency} delay=${opts.delayMs}ms`
  );

  const done = [];
  const leaks = [];
  let processed = 0;

  await runPool(batch, opts.concurrency, opts.delayMs, async (item) => {
    try {
      const report = await scanOne({
        url: item.url,
        bedrijf: item.bedrijf || "",
        plaats: item.plaats || "",
        mode: opts.mode,
        saveIfClean: opts.mode === "full" || opts.saveIfClean,
      });
      item.status = "klaar";
      item.scannedAt = report.scannedAt || new Date().toISOString();
      item.reportId = report.id;
      item.risicoScore = report.risicoScore ?? 0;
      item.leakHit = !!report.leakHit;
      if (report.leakHit) {
        leaks.push(`${item.bedrijf || item.url} → ${report.risicoScore}`);
      }
      done.push(`${item.bedrijf || item.url} (${report.risicoScore}${report.leakHit ? " LEK" : ""})`);
      console.log(`OK ${item.url}${report.skippedReport ? " (schoon)" : ""}`);
    } catch (e) {
      item.status = "fout";
      item.fout = String(e);
      console.error(`FOUT ${item.url}:`, e);
    }
    processed++;
    if (processed % 20 === 0) {
      queue.updatedAt = new Date().toISOString();
      saveQueue(queue);
    }
  });

  queue.updatedAt = new Date().toISOString();
  saveQueue(queue);

  const summary = `Verwerkt: ${done.length}. Database-lekken: ${leaks.length}.\n${leaks.slice(0, 15).join("\n")}`;
  if (done.length > 0) {
    await notify(`VakScan ${opts.mode}: ${leaks.length} lek(ken)`, summary);
  }
  console.log(summary);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}