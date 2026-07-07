#!/usr/bin/env node
/**
 * Klanten-lek Agent — scant potentiële klanten op echte datalekken + database-profiel (geen wachtwoorden in repo).
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { patchAgent } from "../patch-status.mjs";
import { runLeakChecks } from "../../security-scan/leak-probes.mjs";
import { hasActionableLeakFindings, hitIsActionable } from "../../security-scan/leak-actionable.mjs";
import { buildDatabaseProfile } from "../../security-scan/db-hints.mjs";
import { scanOne } from "../../security-scan/run.mjs";
import { originOf } from "../../security-scan/fetch-util.mjs";

const ROOT = join(import.meta.dirname, "../../..");
const LEAK_HITS = join(ROOT, "data/leak-hits.json");
const OUT_DATA = join(ROOT, "data/klanten-lek-rapport.json");
const OUT_PUBLIC = join(ROOT, "public/klanten-lek-rapport.json");
const OUT_DB_EXPORT = join(ROOT, "data/klanten-database-export.json");
const OUT_DB_PUBLIC = join(ROOT, "public/klanten-database-export.json");

function argNum(name, def) {
  const a = process.argv.find((x) => x.startsWith(`--${name}=`));
  return a ? Number(a.split("=")[1]) : def;
}

function loadLeads() {
  const scored = join(ROOT, "data/klanten-gescoord.json");
  const raw = join(ROOT, "data/potentiele-klanten.json");
  if (existsSync(scored)) {
    const s = JSON.parse(readFileSync(scored, "utf8"));
    return (s.leads || []).map((l) => ({
      bedrijf: l.bedrijf,
      plaats: l.plaats,
      url: l.url,
      categorie: l.categorie,
      telefoon: l.telefoon,
      score: l.score,
    }));
  }
  if (existsSync(raw)) {
    const p = JSON.parse(readFileSync(raw, "utf8"));
    return (p.leads || []).map((l) => ({
      bedrijf: l.bedrijf,
      plaats: l.plaats,
      url: l.url,
      categorie: l.categorie,
      telefoon: l.telefoon,
      score: 0,
    }));
  }
  return [];
}

async function pool(items, concurrency, fn) {
  const out = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return out;
}

function toExportRow(entry) {
  const db = entry.database || {};
  const cred = db.credentials;
  const panel = db.panels?.[0];
  const sql = db.sqlDump;
  return {
    bedrijf: entry.bedrijf,
    plaats: entry.plaats,
    url: entry.url,
    heeftLek: entry.heeftLek,
    dbType: cred?.type || panel?.panel || (sql ? "mysql-dump" : null),
    dbHost: cred?.host || panel?.host || null,
    dbName: cred?.database || null,
    dbUser: cred?.username || null,
    wachtwoordLek: cred?.wachtwoordAanwezig ?? false,
    panelUrl: panel?.url || null,
    sqlTabellen: sql?.tables?.slice(0, 15) || [],
    sqlTabelCount: sql?.tableCount ?? 0,
    risicoScore: entry.risicoScore,
    reportId: entry.reportId,
  };
}

async function main() {
  const limit = argNum("limit", Number(process.env.KLANTEN_LEK_LIMIT || 50));
  const concurrency = argNum("concurrency", Number(process.env.KLANTEN_LEK_CONCURRENCY || 4));
  const minScore = argNum("min-score", 0);
  const persistReports = !process.argv.includes("--no-reports");

  let leads = loadLeads().filter((l) => (l.score ?? 0) >= minScore);
  leads = leads.slice(0, limit);

  if (!leads.length) {
    console.error("Geen leads — eerst npm run lead:hunt of lead:score");
    process.exit(1);
  }

  console.log(`Klanten-lek: ${leads.length} sites (parallel ${concurrency})…`);

  const scanned = await pool(leads, concurrency, async (lead) => {
    const { findings, ctx } = await runLeakChecks(lead.url);
    const leak = hasActionableLeakFindings(findings);
    const database = await buildDatabaseProfile(findings, ctx);
    let reportId = null;
    let risicoScore = leak ? 85 : 0;

    if (leak && persistReports) {
      try {
        const report = await scanOne({
          url: lead.url,
          bedrijf: lead.bedrijf,
          plaats: lead.plaats,
          mode: "leaks",
          saveIfClean: false,
        });
        reportId = report.id;
        risicoScore = report.risicoScore ?? risicoScore;
      } catch (e) {
        console.warn(`Rapport mislukt ${lead.url}: ${e.message}`);
      }
    }

    const leakOnly = findings.filter((f) => f.check === "database" || f.check === "datalek");

    return {
      bedrijf: lead.bedrijf,
      plaats: lead.plaats,
      url: lead.url,
      categorie: lead.categorie,
      telefoon: lead.telefoon,
      score: lead.score,
      scannedAt: new Date().toISOString(),
      heeftLek: leak,
      unreachable: !!ctx?.unreachable,
      risicoScore,
      reportId,
      database,
      bevindingen: leakOnly.map((f) => ({
        titel: f.title,
        type: f.check,
        ernst: f.severity,
        url: f.evidence,
      })),
    };
  });

  const byUrl = new Map(scanned.map((s) => [s.url.replace(/\/$/, "").toLowerCase(), s]));

  if (existsSync(LEAK_HITS)) {
    const hits = JSON.parse(readFileSync(LEAK_HITS, "utf8")).hits || [];
    for (const h of hits) {
      if (!hitIsActionable(h)) continue;
      const key = h.url.replace(/\/$/, "").toLowerCase();
      if (byUrl.has(key) && byUrl.get(key).heeftLek) continue;
      const findings = h.findings || [];
      const database = await buildDatabaseProfile(findings, { origin: originOf(h.url), finalUrl: h.url });
      const entry = {
        bedrijf: h.bedrijf,
        plaats: h.plaats,
        url: h.url,
        categorie: null,
        telefoon: null,
        score: null,
        scannedAt: h.scannedAt,
        heeftLek: true,
        unreachable: false,
        risicoScore: h.risicoScore,
        reportId: h.reportId,
        database,
        bevindingen: findings.map((f) => ({
          titel: f.title,
          type: f.check,
          ernst: f.severity,
          url: f.evidence,
        })),
        bron: "leak-hits",
      };
      byUrl.set(key, entry);
    }
  }

  const allKlanten = [...byUrl.values()];
  const metLek = allKlanten.filter((s) => s.heeftLek);
  const exportRows = metLek.map(toExportRow);

  const payload = {
    generatedAt: new Date().toISOString(),
    agent: "klanten-lek",
    gescand: scanned.length,
    metLek: metLek.length,
    disclaimer:
      "Passieve HTTP-checks alleen. Geen wachtwoorden opgeslagen. Gebruik voor Website Veilig €299 outreach met toestemming.",
    klanten: allKlanten.sort(
      (a, b) => Number(b.heeftLek) - Number(a.heeftLek) || b.risicoScore - a.risicoScore
    ),
  };

  const dbExport = {
    generatedAt: payload.generatedAt,
    totaalMetLek: exportRows.length,
    rijen: exportRows,
  };

  mkdirSync(join(ROOT, "data"), { recursive: true });
  writeFileSync(OUT_DATA, JSON.stringify(payload, null, 2));
  writeFileSync(OUT_DB_EXPORT, JSON.stringify(dbExport, null, 2));
  copyFileSync(OUT_DATA, OUT_PUBLIC);
  copyFileSync(OUT_DB_EXPORT, OUT_DB_PUBLIC);

  patchAgent("klanten-lek", {
    ok: true,
    gescand: scanned.length,
    metLek: metLek.length,
    agentPrompt:
      metLek.length > 0
        ? `${metLek.length} echte lek(ken) — /leads/ database-export · outreach`
        : `${scanned.length} schoon (deze batch) — meer limit of VakScan queue`,
    grokPrompt:
      metLek.length > 0
        ? `agent outreach — ${metLek.length} klanten met database-lek in klanten-lek-rapport`
        : "klanten-lek batch klaar — verhoog limit of scan:leaks op queue",
  });

  console.log(`Klaar: ${metLek.length} met lek (${scanned.length} vers gescand, ${allKlanten.length} in rapport)`);
  if (metLek.length) {
    console.log("Top lekken:");
    for (const k of metLek.slice(0, 5)) {
      console.log(`  • ${k.bedrijf} — ${k.database.samenvatting}`);
    }
    console.log(`Database-export: data/klanten-database-export.json (${exportRows.length} rijen)`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}