#!/usr/bin/env node
/**
 * Optimizer Agent — meet continu, past veilig aan, zet code-taken in wachtrij voor Grok.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "fs";
import { join, dirname } from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { patchAgent } from "../agents/patch-status.mjs";

const ROOT = join(import.meta.dirname, "../..");
const NTFY = process.env.VAKSCAN_NTFY_TOPIC || "webklaar-mike";
const LOG_PATH = join(ROOT, "data/optimizer-log.json");
const STATUS_PATH = join(ROOT, "data/optimizer-status.json");
const WACHTRIJ_PATH = join(ROOT, "data/optimizer-wachtrij.json");

const DEMO_HOSTS = ["neverssl.com", "example.com", "example.org"];

function load(path, fb) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fb;
  }
}

function saveJson(path, data) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(data, null, 2));
}

function hoursSince(iso) {
  if (!iso) return Infinity;
  return (Date.now() - new Date(iso).getTime()) / 3_600_000;
}

function runNpm(script) {
  const r = spawnSync("npm", ["run", script], { cwd: ROOT, encoding: "utf8", shell: true, timeout: 900_000 });
  return { ok: r.status === 0, out: ((r.stdout || "") + (r.stderr || "")).slice(-1500) };
}

function runNode(rel) {
  const r = spawnSync("node", [join(ROOT, rel)], { cwd: ROOT, encoding: "utf8", timeout: 120_000 });
  return { ok: r.status === 0 };
}

function appendLog(entry) {
  const log = load(LOG_PATH, { entries: [] });
  log.entries.unshift({ at: new Date().toISOString(), ...entry });
  if (log.entries.length > 100) log.entries = log.entries.slice(0, 100);
  saveJson(LOG_PATH, log);
  copyFileSync(LOG_PATH, join(ROOT, "public/optimizer-log.json"));
}

function addWachtrij(taak) {
  const w = load(WACHTRIJ_PATH, { items: [] });
  const exists = w.items.some((i) => i.id === taak.id && i.status === "pending");
  if (!exists) {
    w.items.unshift({ ...taak, status: "pending", aangemaakt: new Date().toISOString() });
    saveJson(WACHTRIJ_PATH, w);
    copyFileSync(WACHTRIJ_PATH, join(ROOT, "public/optimizer-wachtrij.json"));
  }
}

function audit() {
  const health = load(join(ROOT, "public/health.json"), {});
  const stats = load(join(ROOT, "data/scan-stats.json"), {});
  const queue = load(join(ROOT, "data/scan-queue.json"), { items: [] });
  const leaks = load(join(ROOT, "data/leak-hits.json"), { hits: [] });
  const outreach = load(join(ROOT, "data/outreach-vandaag.json"), {});
  const leads = load(join(ROOT, "data/potentiele-klanten.json"), {});
  const kpi = load(join(ROOT, "data/kpi-snapshot.json"), {});
  const log = load(LOG_PATH, { entries: [] });
  const lastOpt = log.entries?.[0]?.at;

  const pending = (queue.items || []).filter((i) => i.status === "pending").length;
  const demoInQueue = (queue.items || []).filter((i) =>
    DEMO_HOSTS.some((h) => (i.url || "").toLowerCase().includes(h))
  ).length;
  const batches = stats.batches || [];
  const hitTrend = batches.slice(0, 3).map((b) => b.hitRate ?? 0);
  const avgHit = hitTrend.length ? hitTrend.reduce((a, b) => a + b, 0) / hitTrend.length : 0;

  return {
    health,
    stats,
    pending,
    demoInQueue,
    leakCount: (leaks.hits || []).length,
    outreachCount: (outreach.vandaag || []).length,
    outreachAge: hoursSince(outreach.generatedAt),
    leadsTotaal: leads.totaal ?? leads.leads?.length ?? 0,
    leadsAge: hoursSince(leads.generatedAt),
    kpi,
    lastOptAge: hoursSince(lastOpt),
    avgMs: health.avgResponseMs ?? 0,
    avgHit,
  };
}

function plan(a) {
  const aanbevelingen = [];
  const safe = [];

  if (!a.health.healthy) {
    aanbevelingen.push({
      id: "fix-health",
      prioriteit: 0,
      type: "grok",
      titel: "Site unhealthy",
      actie: "Build fixen, health-check, push",
      script: "npm run build:pages",
    });
  }

  if (a.demoInQueue > 0) {
    safe.push({
      id: "purge-demo-queue",
      titel: `Verwijder ${a.demoInQueue} demo-URL's uit queue`,
      fn: "purgeDemoQueue",
    });
  }

  if (a.leakCount > 0 && a.outreachAge > 8) {
    safe.push({ id: "refresh-outreach", titel: "Outreach verversen (lekken wachten)", fn: "refreshOutreach" });
  }

  if (a.pending > 10 && a.stats.lastBatchAt && hoursSince(a.stats.lastBatchAt) > 18) {
    safe.push({
      id: "run-leak-scan",
      titel: `VakScan leaks op ${a.pending} pending`,
      fn: "runLeakScan",
    });
  }

  safe.push({ id: "sync-report-index", titel: "Rapport-index syncen", fn: "syncIndex" });

  if (a.leadsTotaal < 25 && a.leadsAge > 72) {
    safe.push({ id: "run-lead-hunter", titel: "Lead Hunter (weinig leads)", fn: "runLeads", zwaar: true });
  }

  if (a.avgMs > 700) {
    aanbevelingen.push({
      id: "perf-pages",
      prioriteit: 5,
      type: "grok",
      titel: "Trage GitHub Pages",
      actie: `Gem. ${a.avgMs}ms — images, static chunks, health checks verminderen`,
    });
  }

  if (a.pending > 50 && a.avgHit < 0.5 && a.stats.totaalGescand > 30) {
    aanbevelingen.push({
      id: "better-leads",
      prioriteit: 4,
      type: "grok",
      titel: "Lage hit-rate op queue",
      actie: "Lead Hunter uitbreiden (steden/branches) of betere URL-bron (Places API)",
    });
  }

  if (a.kpi && (a.kpi.contactenDezeWeek ?? 0) === 0 && a.outreachCount > 0) {
    aanbevelingen.push({
      id: "mike-actie",
      prioriteit: 3,
      type: "mike",
      titel: "Outreach klaar, geen contacten KPI",
      actie: "5 WhatsApps via /actie/ vandaag",
    });
  }

  return { safe, aanbevelingen };
}

function purgeDemoQueue() {
  const path = join(ROOT, "data/scan-queue.json");
  const pub = join(ROOT, "public/scan-queue.json");
  const q = load(path, { items: [] });
  const before = q.items.length;
  q.items = q.items.filter((i) => !DEMO_HOSTS.some((h) => (i.url || "").toLowerCase().includes(h)));
  q.updatedAt = new Date().toISOString();
  saveJson(path, q);
  copyFileSync(path, pub);
  return before - q.items.length;
}

const SAFE_FNS = {
  purgeDemoQueue,
  syncIndex: () => runNode("scripts/security-scan/sync-index.mjs").ok,
  refreshOutreach: () => runNpm("agent:outreach").ok,
  runLeakScan: () => {
    process.env.VAKSCAN_LIMIT = "80";
    return runNpm("agent:vakscan-leaks").ok;
  },
  runLeads: () => runNpm("agent:leads").ok,
};

async function notify(title, body) {
  try {
    await fetch(`https://ntfy.sh/${NTFY}`, {
      method: "POST",
      headers: { Title: title, Tags: "chart_with_upwards_trend,robot" },
      body: body.slice(0, 3000),
    });
  } catch {
    /* ignore */
  }
}

async function main() {
  const apply = process.argv.includes("--apply");
  const a = audit();
  const { safe, aanbevelingen } = plan(a);

  const uitgevoerd = [];
  for (const s of safe) {
    if (!apply) {
      uitgevoerd.push({ ...s, status: "voorgesteld" });
      continue;
    }
    if (s.zwaar && a.lastOptAge < 20) {
      uitgevoerd.push({ ...s, status: "overgeslagen_recent" });
      continue;
    }
    const fn = SAFE_FNS[s.fn];
    if (!fn) continue;
    try {
      const result = await Promise.resolve(fn());
      uitgevoerd.push({ ...s, status: "ok", result });
      appendLog({ actie: s.id, titel: s.titel, result });
    } catch (e) {
      uitgevoerd.push({ ...s, status: "fout", error: String(e) });
    }
  }

  for (const rec of aanbevelingen) {
    addWachtrij({
      id: rec.id,
      prioriteit: rec.prioriteit,
      type: rec.type,
      titel: rec.titel,
      actie: rec.actie,
      script: rec.script || null,
    });
  }

  const topGrok =
    aanbevelingen.filter((r) => r.type === "grok").sort((x, y) => x.prioriteit - y.prioriteit)[0] || null;

  const status = {
    updatedAt: new Date().toISOString(),
    agent: "optimizer",
    applyMode: apply,
    metrics: {
      pending: a.pending,
      leakCount: a.leakCount,
      outreachCount: a.outreachCount,
      leadsTotaal: a.leadsTotaal,
      hitRate: a.avgHit,
      avgMs: a.avgMs,
    },
    uitgevoerd,
    aanbevelingen,
    grokPrompt: topGrok
      ? `optimizer: ${topGrok.actie}`
      : apply
        ? "optimizer: metrics bijgewerkt — manager check"
        : "optimizer: draai npm run agent:optimizer:apply voor auto-fix",
    pendingGrok: load(WACHTRIJ_PATH, { items: [] }).items.filter((i) => i.status === "pending").length,
  };

  saveJson(STATUS_PATH, status);
  copyFileSync(STATUS_PATH, join(ROOT, "public/optimizer-status.json"));

  patchAgent("optimizer", {
    lastRun: status.updatedAt,
    applyMode: apply,
    grokPrompt: status.grokPrompt,
    safeDone: uitgevoerd.filter((u) => u.status === "ok").length,
    wachtrijPending: status.pendingGrok,
  });

  const agentsPath = join(ROOT, "data/agents-status.json");
  const agents = load(agentsPath, { agents: {} });
  if (agents.manager) {
    agents.manager.optimizerHint = status.grokPrompt;
  }
  saveJson(agentsPath, agents);
  copyFileSync(agentsPath, join(ROOT, "public/agents-status.json"));

  const lines = [
    `Optimizer ${apply ? "(apply)" : "(audit)"}`,
    ...uitgevoerd.map((u) => `${u.titel}: ${u.status}`),
    status.grokPrompt,
  ];
  if (apply && uitgevoerd.some((u) => u.status === "ok")) {
    await notify("Optimizer: fixes toegepast", lines.join("\n"));
  }
  console.log(lines.join("\n"));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}