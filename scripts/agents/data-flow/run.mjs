#!/usr/bin/env node
/**
 * Data-flow Agent — beheert alle datastromen: sync data/ ↔ public/, validatie, rapport-index.
 */
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  copyFileSync,
  readdirSync,
  statSync,
} from "fs";
import { join, basename } from "path";
import { createHash } from "crypto";
import { fileURLToPath } from "url";
import { patchAgent } from "../patch-status.mjs";

const ROOT = join(import.meta.dirname, "../../..");
const REGISTRY_PATH = join(ROOT, "data/data-flow-registry.json");
const STATUS_PATH = join(ROOT, "data/data-flow-status.json");
const NTFY = process.env.VAKSCAN_NTFY_TOPIC || "webklaar-mike";

function load(path, fb) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fb;
  }
}

function sha256File(path) {
  try {
    const buf = readFileSync(path);
    return createHash("sha256").update(buf).digest("hex").slice(0, 16);
  } catch {
    return null;
  }
}

function validateJson(stream, data) {
  const issues = [];
  const v = stream.validatie;
  if (!v) return issues;
  if (v.array && !Array.isArray(data[v.array])) {
    issues.push(`veld '${v.array}' moet array zijn`);
  }
  if (v.totaalField && v.array) {
    const arr = data[v.array];
    const tot = data[v.totaalField];
    if (typeof tot === "number" && Array.isArray(arr) && tot !== arr.length) {
      issues.push(`${v.totaalField}=${tot} maar ${v.array}.length=${arr.length}`);
    }
  }
  return issues;
}

function syncFilePair(stream, fix) {
  const srcRel = stream.bron;
  const dstRel = stream.publiek;
  const src = srcRel ? join(ROOT, srcRel) : null;
  const dst = join(ROOT, dstRel);
  const result = {
    id: stream.id,
    naam: stream.naam,
    status: "ok",
    drift: false,
    synced: false,
    issues: [],
    detail: "",
  };

  if (stream.canoniek === "public") {
    if (!existsSync(dst)) {
      result.status = "missing";
      result.issues.push("public bestand ontbreekt");
      result.detail = "run health-check of sync-maarten";
      return result;
    }
    if (stream.type === "json") {
      try {
        const data = JSON.parse(readFileSync(dst, "utf8"));
        result.issues.push(...validateJson(stream, data));
      } catch {
        result.status = "invalid";
        result.issues.push("JSON parse fout (public)");
      }
    }
    result.detail = existsSync(dst) ? "public-only OK" : "ontbreekt";
    if (result.issues.length) result.status = "warn";
    return result;
  }

  if (!src || !existsSync(src)) {
    result.status = existsSync(dst) ? "warn" : "missing";
    result.detail = srcRel ? `bron ${srcRel} ontbreekt` : "geen bron";
    if (!existsSync(dst)) result.issues.push("geen data én geen public kopie");
    return result;
  }

  const srcHash = sha256File(src);
  const dstHash = existsSync(dst) ? sha256File(dst) : null;
  const drift = srcHash !== dstHash;

  if (stream.type === "json") {
    let data;
    try {
      data = JSON.parse(readFileSync(src, "utf8"));
    } catch {
      result.status = "invalid";
      result.issues.push("JSON parse fout (data)");
      return result;
    }
    result.issues.push(...validateJson(stream, data));
  }

  if (drift) {
    result.drift = true;
    if (fix) {
      mkdirSync(join(ROOT, "public"), { recursive: true });
      copyFileSync(src, dst);
      result.synced = true;
      result.detail = "gesynchroniseerd data → public";
    } else {
      result.status = "drift";
      result.detail = "public achter op data";
    }
  } else {
    result.detail = "in sync";
  }

  if (result.issues.length && result.status === "ok") result.status = "warn";
  return result;
}

function rebuildReportsIndex(fix) {
  const dataDir = join(ROOT, "data/reports");
  const pubDir = join(ROOT, "public/reports");
  const copied = [];
  const missing = [];

  if (!existsSync(dataDir)) {
    return { status: "missing", copied: 0, indexCount: 0, issues: ["data/reports ontbreekt"] };
  }

  mkdirSync(pubDir, { recursive: true });
  const files = readdirSync(dataDir).filter((f) => f.endsWith(".json") && !f.startsWith("."));
  const list = [];

  for (const f of files) {
    const src = join(dataDir, f);
    const dst = join(pubDir, f);
    const id = basename(f, ".json");
    const mdSrc = join(dataDir, `${id}.md`);
    const mdDst = join(pubDir, `${id}.md`);

    let needCopy = !existsSync(dst) || sha256File(src) !== sha256File(dst);
    if (fix && needCopy) {
      copyFileSync(src, dst);
      copied.push(f);
    } else if (needCopy) missing.push(f);

    if (existsSync(mdSrc)) {
      const mdDrift = !existsSync(mdDst) || sha256File(mdSrc) !== sha256File(mdDst);
      if (fix && mdDrift) copyFileSync(mdSrc, mdDst);
    }

    try {
      const report = JSON.parse(readFileSync(src, "utf8"));
      list.push({
        id: report.id,
        url: report.url,
        bedrijf: report.bedrijf,
        plaats: report.plaats,
        scannedAt: report.scannedAt,
        risicoScore: report.risicoScore,
        niveau: report.niveau,
        niveauLabel: report.niveauLabel,
        scanMode: report.scanMode,
        leakHit: !!report.leakHit,
      });
    } catch {
      /* skip bad report */
    }
  }

  list.sort((a, b) => new Date(b.scannedAt) - new Date(a.scannedAt));
  const indexPath = join(pubDir, "index.json");
  const oldIndex = load(indexPath, []);
  const indexDrift = JSON.stringify(oldIndex) !== JSON.stringify(list);
  if (fix && (indexDrift || copied.length)) {
    writeFileSync(indexPath, JSON.stringify(list, null, 2));
  }

  const issues = [];
  if (missing.length && !fix) issues.push(`${missing.length} rapport(en) niet gesynced`);

  return {
    status: missing.length && !fix ? "drift" : "ok",
    copied: copied.length,
    indexCount: list.length,
    indexRebuilt: fix && indexDrift,
    issues,
    detail: `${list.length} rapporten · ${copied.length} gekopieerd`,
  };
}

function crossChecks(streamResults) {
  const issues = [];
  const queue = load(join(ROOT, "data/scan-queue.json"), { items: [] });
  const leaks = load(join(ROOT, "data/leak-hits.json"), { hits: [] });
  const pending = (queue.items || []).filter((i) => i.status === "pending").length;
  const scanned = (queue.items || []).filter((i) => i.status === "scanned").length;

  const leakStream = streamResults.find((s) => s.id === "leak-hits");
  const queueStream = streamResults.find((s) => s.id === "scan-queue");
  if (leakStream?.drift || queueStream?.drift) {
    issues.push("queue of leak-hits niet live — UI /scan/ kan verouderd zijn");
  }

  return {
    queuePending: pending,
    queueScanned: scanned,
    leakHits: (leaks.hits || []).length,
    issues,
  };
}

async function notify(title, body) {
  try {
    await fetch(`https://ntfy.sh/${NTFY}`, {
      method: "POST",
      headers: { Title: title, Tags: "package" },
      body: body.slice(0, 3500),
    });
  } catch {
    /* ignore */
  }
}

function main() {
  const fix = !process.argv.includes("--check");
  const registry = load(REGISTRY_PATH, { streams: [] });
  const streamResults = [];

  for (const stream of registry.streams || []) {
    if (stream.type === "reports-dir") {
      const rep = rebuildReportsIndex(fix);
      streamResults.push({
        id: stream.id,
        naam: stream.naam,
        status: rep.status,
        drift: rep.status === "drift",
        synced: rep.copied > 0 || rep.indexRebuilt,
        issues: rep.issues,
        detail: rep.detail,
      });
      continue;
    }
    if (stream.type === "json" || !stream.type) {
      streamResults.push(syncFilePair(stream, fix));
    }
  }

  const cross = crossChecks(streamResults);
  const driftCount = streamResults.filter((s) => s.drift).length;
  const syncedCount = streamResults.filter((s) => s.synced).length;
  const bad = streamResults.filter((s) => s.status === "missing" || s.status === "invalid");
  const warn = streamResults.filter((s) => s.status === "warn" || s.status === "drift");

  const healthy = bad.length === 0 && driftCount === 0;
  const grokPrompt = healthy
    ? "data-flow OK — alle streams gesynchroniseerd"
    : `agent dataflow --fix: ${bad.length} fout · ${driftCount} drift · ${syncedCount} net gesynced`;

  const status = {
    updatedAt: new Date().toISOString(),
    agent: "data-flow",
    healthy,
    fixApplied: fix,
    summary: {
      streams: streamResults.length,
      ok: streamResults.filter((s) => s.status === "ok").length,
      drift: driftCount,
      synced: syncedCount,
      missing: bad.length,
      warnings: warn.length,
    },
    cross,
    streams: streamResults,
    grokPrompt,
    agentPrompt: healthy
      ? `${streamResults.length} streams OK · queue ${cross.queuePending} pending · ${cross.leakHits} lekken`
      : `Data-flow: ${syncedCount} sync · ${bad.length + driftCount} actie — npm run agent:dataflow`,
  };

  mkdirSync(join(ROOT, "data"), { recursive: true });
  writeFileSync(STATUS_PATH, JSON.stringify(status, null, 2));
  mkdirSync(join(ROOT, "public"), { recursive: true });
  copyFileSync(STATUS_PATH, join(ROOT, "public/data-flow-status.json"));

  patchAgent("data-flow", {
    ok: healthy,
    healthy,
    streams: streamResults.length,
    drift: driftCount,
    synced: syncedCount,
    agentPrompt: status.agentPrompt,
    grokPrompt,
  });

  const lines = [
    `Data-flow · ${healthy ? "OK" : "ACTIE"}`,
    status.agentPrompt,
    ...streamResults
      .filter((s) => s.status !== "ok")
      .slice(0, 8)
      .map((s) => `  ${s.id}: ${s.status} — ${s.detail}`),
  ];
  console.log(lines.join("\n"));

  if (!healthy && fix && syncedCount > 0) {
    void notify("Data-flow sync", `${syncedCount} streams bijgewerkt · ${cross.leakHits} lekken`);
  }

  const critical = bad.filter((s) => s.id !== "maarten-ideeen");
  if (critical.length > 0) process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}