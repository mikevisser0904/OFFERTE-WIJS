#!/usr/bin/env node
/**
 * Lead Hunter Agent — volledige run: OSM → import queue → status → ntfy
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { spawnSync } from "child_process";

const ROOT = join(import.meta.dirname, "../..");
const NTFY = process.env.VAKSCAN_NTFY_TOPIC || "webklaar-mike";

function run(script) {
  const r = spawnSync("node", [join(ROOT, script)], { cwd: ROOT, encoding: "utf8", timeout: 600_000 });
  return { ok: r.status === 0, out: (r.stdout || "") + (r.stderr || "") };
}

function loadJson(path, fallback) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

function mergeQueueFromLeads(leads) {
  const queuePath = join(ROOT, "data/scan-queue.json");
  const publicPath = join(ROOT, "public/scan-queue.json");
  const queue = loadJson(queuePath, { updatedAt: "", items: [] });
  const seen = new Set(queue.items.map((i) => i.url.replace(/\/$/, "").toLowerCase()));
  let added = 0;
  for (const l of leads) {
    const url = l.url?.replace(/\/$/, "");
    if (!url) continue;
    const key = url.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    queue.items.push({
      id: `lh-${Date.now().toString(36)}-${added}`,
      bedrijf: l.bedrijf,
      plaats: l.plaats || "",
      url,
      status: "pending",
      bron: "lead-hunter",
      categorie: l.categorie,
      toegevoegd: new Date().toISOString(),
    });
    added++;
  }
  queue.updatedAt = new Date().toISOString();
  writeFileSync(queuePath, JSON.stringify(queue, null, 2));
  copyFileSync(queuePath, publicPath);
  return { added, pending: queue.items.filter((i) => i.status === "pending").length };
}

async function notify(title, body) {
  try {
    await fetch(`https://ntfy.sh/${NTFY}`, {
      method: "POST",
      headers: { Title: title, Tags: "mag,moneybag" },
      body: body.slice(0, 3000),
    });
  } catch {
    /* ignore */
  }
}

function patchAgentsStatus(patch) {
  const path = join(ROOT, "data/agents-status.json");
  const pub = join(ROOT, "public/agents-status.json");
  const base = loadJson(path, { versie: 1, agents: {} });
  base.updatedAt = new Date().toISOString();
  base.agents = { ...base.agents, ...patch };
  writeFileSync(path, JSON.stringify(base, null, 2));
  mkdirSync(join(ROOT, "public"), { recursive: true });
  writeFileSync(pub, JSON.stringify(base, null, 2));
}

async function main() {
  const osm = run("scripts/lead-hunter/osm-fetch.mjs");
  const leadsFile = join(ROOT, "data/potentiele-klanten.json");
  const data = loadJson(leadsFile, { leads: [], totaal: 0 });
  const { added, pending } = mergeQueueFromLeads(data.leads || []);

  const status = {
    "lead-hunter": {
      lastRun: new Date().toISOString(),
      ok: osm.ok,
      leadsTotaal: data.totaal ?? data.leads?.length ?? 0,
      queueAdded: added,
      queuePending: pending,
      nextStep: pending > 0 ? "npm run scan:leaks" : "osm opnieuw of handmatig urls",
      agentPrompt: `Lead Hunter klaar: ${data.totaal} leads, ${added} nieuw in queue (${pending} pending). Draai scan:leaks en daarna agent:outreach.`,
    },
  };
  patchAgentsStatus(status);

  const msg = `Leads: ${data.totaal}\nQueue +${added} (pending ${pending})\n${status["lead-hunter"].agentPrompt}`;
  await notify(`Lead Hunter: +${added} in queue`, msg);
  console.log(msg);
  if (!osm.ok) {
    console.error(osm.out);
    process.exit(1);
  }
}

main();