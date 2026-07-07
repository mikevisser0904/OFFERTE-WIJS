#!/usr/bin/env node
/**
 * Auto-verify — hercontroleert lekken, admin-bewijs, toestemming (passief + auth als local creds).
 * npm run agent:auto-verify
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";
import { patchAgent } from "../agents/patch-status.mjs";
import { hostKey, loadConsentStore } from "../security-scan/consent-registry.mjs";
import { hitIsActionable, confirmDatabaseEvidence } from "../security-scan/leak-actionable.mjs";
import { haalAdminBewijs } from "../lead-hunter/admin-proof.mjs";
import { deepCheckEntry } from "../security-scan/consent-deep-check.mjs";

const ROOT = join(import.meta.dirname, "../..");

function load(path, fb) {
  if (!existsSync(path)) return fb;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fb;
  }
}

function runNode(rel, args = [], env = {}) {
  const r = spawnSync("node", [join(ROOT, rel), ...args], {
    cwd: ROOT,
    encoding: "utf8",
    env: { ...process.env, ...env },
    timeout: 600_000,
  });
  return { ok: r.status === 0, out: ((r.stdout || "") + (r.stderr || "")).slice(-800) };
}

function besteEvidence(findings) {
  const f = (findings || []).find((x) => x.evidence && (x.check === "database" || x.check === "datalek"));
  return f?.evidence || null;
}

async function verifyLeakHits(hits) {
  const rows = [];
  for (const hit of hits) {
    if (!hitIsActionable(hit)) {
      rows.push({ url: hit.url, bedrijf: hit.bedrijf, status: "skip", reason: "niet actionable" });
      continue;
    }
    const evidence = besteEvidence(hit.findings);
    let dbOk = false;
    let proofOk = false;
    if (evidence) {
      dbOk = await confirmDatabaseEvidence(evidence);
      const proof = await haalAdminBewijs(evidence);
      proofOk = !!proof?.ok;
    }
    const status = dbOk || proofOk ? "verified" : evidence ? "failed" : "no-evidence";
    rows.push({ url: hit.url, bedrijf: hit.bedrijf, evidence, dbOk, proofOk, status });
  }
  return rows;
}

async function verifyConsentIndividual() {
  const { entries } = loadConsentStore();
  const targets = (entries || []).filter(
    (e) => e.status === "active" && e.individualConsent && e.evidenceUrl && !String(e.evidenceUrl).includes("/404"),
  );
  const results = [];
  for (const entry of targets) {
    results.push(await deepCheckEntry(entry));
  }
  return { count: targets.length, results };
}

async function main() {
  const configPath = join(ROOT, "data/auto-verify.json");
  const config = load(configPath, { enabled: true, autoActivateHits: false, refreshBerichten: true });

  const steps = [];
  steps.push({ id: "consent-scrub", ...runNode("scripts/security-scan/consent-scrub.mjs") });

  if (config.autoActivateHits && (process.env.MIKE_TOESTEMMING === "1" || config.mikeToestemming)) {
    steps.push({
      id: "consent-activate",
      ...runNode("scripts/security-scan/consent-activate-owner.mjs", [], {
        MIKE_TOESTEMMING: "1",
        CONSENT_REF: config.consentRef || process.env.CONSENT_REF || "auto-verify register",
      }),
    });
  }

  steps.push({ id: "verify-pma", ...runNode("scripts/security-scan/verify-phpmyadmin.mjs") });
  steps.push({ id: "risico-passief", ...runNode("scripts/security-scan/risico-passief.mjs") });

  const hits = load(join(ROOT, "data/leak-hits.json"), { hits: [] }).hits || [];
  const leakRows = await verifyLeakHits(hits);
  const verified = leakRows.filter((r) => r.status === "verified").length;
  const failed = leakRows.filter((r) => r.status === "failed").length;

  const consent = await verifyConsentIndividual();
  const consentOk = consent.results.filter((r) => r.passive?.proof?.ok || r.auth?.loginSuccess).length;

  if (config.refreshBerichten !== false) {
    steps.push({ id: "lead-berichten", ...runNode("scripts/lead-hunter/personalize-verkoop.mjs") });
    steps.push({
      id: "verkoop-bewijs",
      ...runNode("scripts/verkoop-bewijs-agent/run.mjs", ["--skip-berichten"]),
    });
  }

  runNode("scripts/agents/data-flow/run.mjs");

  const status = {
    updatedAt: new Date().toISOString(),
    agent: "auto-verify",
    summary: {
      leakHits: hits.length,
      leakVerified: verified,
      leakFailed: failed,
      consentChecked: consent.count,
      consentProofOk: consentOk,
    },
    leakRows,
    consentResults: consent.results.map((r) => ({
      siteUrl: r.siteUrl,
      bedrijf: r.bedrijf,
      passiveOk: r.passive?.proof?.ok ?? null,
      authOk: r.auth?.loginSuccess ?? null,
      error: r.error,
    })),
    steps: steps.map((s) => ({ id: s.id, ok: s.ok })),
    grokPrompt:
      verified > 0
        ? `auto-verify: ${verified} lek(ken) bevestigd — Mike belt met bewijs-URL op /dashboard/`
        : "auto-verify: weinig bewijs — npm run funnel of KLANTEN_LEK_LIMIT=80 npm run lead:database",
    agentPrompt: `${verified} verified · ${consentOk} consent OK · ${failed} failed recheck`,
  };

  const out = join(ROOT, "data/auto-verify-status.json");
  mkdirSync(join(ROOT, "data"), { recursive: true });
  writeFileSync(out, JSON.stringify(status, null, 2));
  copyFileSync(out, join(ROOT, "public/auto-verify-status.json"));

  patchAgent("auto-verify", {
    ok: verified > 0 || consentOk > 0,
    leakVerified: verified,
    consentProofOk: consentOk,
    agentPrompt: status.agentPrompt,
    grokPrompt: status.grokPrompt,
  });

  console.log(`Auto-verify: ${status.agentPrompt}`);
  console.log(status.grokPrompt);
  process.exit(failed > verified && verified === 0 ? 1 : 0);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}