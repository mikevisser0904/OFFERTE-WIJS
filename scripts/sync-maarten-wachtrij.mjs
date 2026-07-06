#!/usr/bin/env node
/**
 * Sync Maarten-ideeën van ntfy → data/maarten-wachtrij.json (+ public kopie)
 * Draait lokaal of in GitHub Actions zodat de agent wijzigingen kan doorvoeren.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const TOPIC = "webklaar-maarten-ideeen";
const ROOT = join(import.meta.dirname, "..");
const DATA_PATH = join(ROOT, "data/maarten-wachtrij.json");
const PUBLIC_PATH = join(ROOT, "public/maarten-wachtrij.json");

function parseIdee(raw, meta = {}) {
  const tekst = String(raw).trim();
  if (tekst.length < 3) return null;

  let euro;
  let body = tekst;
  const m = tekst.match(/^€\s*([\d.,]+(?:k)?)\s*[-:–]\s*(.+)$/i);
  if (m) {
    euro = `€${m[1]}`;
    body = m[2].trim();
  }

  const tijd = meta.time ? Math.floor(meta.time / 1_000_000_000) : Date.now();

  return {
    id: meta.id ?? `l-${tijd}-${Math.random().toString(36).slice(2, 8)}`,
    tekst: body,
    euro,
    tijd,
    van: meta.title?.toLowerCase().includes("mike") ? "Mike" : "Maarten",
  };
}

function genereerAgentOpdracht(idee) {
  const euro = idee.euro ? `Potentieel: ${idee.euro}\n` : "";
  return `## Maarten-idee — uitvoeren in OFFERTE-WIJS

**ID:** ${idee.id}
**Van:** ${idee.van}
**Datum:** ${new Date(idee.tijd).toISOString()}
${euro}**Idee:** ${idee.tekst}

### Jouw opdracht (Grok/Cursor agent)
1. Lees data/maarten-wachtrij.json — dit item heeft status pending
2. Implementeer in OFFERTE-WIJS (Next.js static export)
3. GITHUB_PAGES=true npm run build
4. Commit + push
5. Zet status op klaar + notitie in data/maarten-wachtrij.json en public/maarten-wachtrij.json`;
}

function laadWachtrij() {
  const fallback = {
    versie: 1,
    repo: "OFFERTE-WIJS",
    lastSync: null,
    lastNtfyId: null,
    ideeen: [],
  };
  if (!existsSync(DATA_PATH)) return fallback;
  try {
    return JSON.parse(readFileSync(DATA_PATH, "utf8"));
  } catch {
    return fallback;
  }
}

async function haalNtfyBerichten(since) {
  const berichten = [];
  let cursor = since ?? "";
  const maxRounds = 15;

  for (let i = 0; i < maxRounds; i++) {
    const url = cursor
      ? `https://ntfy.sh/${TOPIC}/json?poll=1&since=${encodeURIComponent(cursor)}`
      : `https://ntfy.sh/${TOPIC}/json?poll=1`;

    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) break;

    const raw = await res.text();
    if (!raw.trim()) break;

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      break;
    }
    const batch = (Array.isArray(data) ? data : data ? [data] : []).filter(Boolean);
    if (batch.length === 0) break;

    berichten.push(...batch);
    cursor = batch[batch.length - 1].id;
    if (batch.length === 1 && berichten.length > 0) break;
  }

  return berichten;
}

function mergeWachtrij(wachtrij, ntfyBerichten) {
  const map = new Map(wachtrij.ideeen.map((i) => [i.id, i]));

  for (const m of ntfyBerichten) {
    const idee = parseIdee(m.message, { id: m.id, time: m.time, title: m.title });
    if (!idee) continue;
    if (map.has(idee.id)) continue;

    map.set(idee.id, {
      ...idee,
      status: "pending",
      agentOpdracht: genereerAgentOpdracht(idee),
      aangemaakt: new Date(idee.tijd).toISOString(),
    });
  }

  const ideeen = [...map.values()].sort((a, b) => b.tijd - a.tijd).slice(0, 50);
  const lastNtfyId =
    ntfyBerichten.length > 0 ? ntfyBerichten[ntfyBerichten.length - 1].id : wachtrij.lastNtfyId;

  return {
    versie: 1,
    repo: "OFFERTE-WIJS",
    lastSync: new Date().toISOString(),
    lastNtfyId,
    ideeen,
  };
}

async function main() {
  const wachtrij = laadWachtrij();
  const ntfy = await haalNtfyBerichten(wachtrij.lastNtfyId);
  const merged = mergeWachtrij(wachtrij, ntfy);

  const json = `${JSON.stringify(merged, null, 2)}\n`;
  writeFileSync(DATA_PATH, json);
  writeFileSync(PUBLIC_PATH, json);

  const pending = merged.ideeen.filter((i) => i.status === "pending").length;
  console.log(`Maarten-wachtrij: ${merged.ideeen.length} ideeën (${pending} pending), +${ntfy.length} ntfy`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});