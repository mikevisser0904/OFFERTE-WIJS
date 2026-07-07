#!/usr/bin/env node
/**
 * Mike bevestigt schriftelijke/mail/WhatsApp-toestemming voor actieve leak-sites.
 * Zet individualConsent op entries met evidence (geen massa-OSM zonder lek).
 *
 *   MIKE_TOESTEMMING=1 CONSENT_REF="WhatsApp 7 mrt — eigenaar akkoord VakScan" npm run consent:activate
 * Optioneel auth-verify (alleen met scan-toestemming.local.json per site):
 *   MIKE_TOESTEMMING=1 CONSENT_SCOPE=passive-deep,auth-verify npm run consent:activate
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { hostKey } from "./consent-registry.mjs";
import { hitIsActionable } from "./leak-actionable.mjs";

const root = process.cwd();
const storePath = join(root, "data/scan-toestemming.json");

function load(path, fb) {
  if (!existsSync(path)) return fb;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fb;
  }
}

function besteEvidence(findings) {
  const f = (findings || []).find((x) => x.evidence && (x.check === "database" || x.check === "datalek"));
  return f?.evidence || null;
}

function main() {
  if (process.env.MIKE_TOESTEMMING !== "1") {
    console.error("Zet MIKE_TOESTEMMING=1 als je schriftelijke/mail/WhatsApp-toestemming hebt vastgelegd.");
    console.error("Optioneel: CONSENT_REF=\"jouw referentie\"");
    process.exit(1);
  }

  const consentRef =
    process.env.CONSENT_REF ||
    `Mike bevestigt toestemming eigenaar — ${new Date().toISOString().slice(0, 10)}`;
  const scope = (process.env.CONSENT_SCOPE || "passive-deep").split(",").map((s) => s.trim());

  const store = load(storePath, { entries: [] });
  const byHost = new Map((store.entries || []).map((e) => [hostKey(e.siteUrl), e]));

  const sources = [];
  const hits = load(join(root, "data/leak-hits.json"), { hits: [] });
  for (const h of hits.hits || []) {
    if (!hitIsActionable(h)) continue;
    sources.push({
      siteUrl: h.url,
      bedrijf: h.bedrijf,
      evidenceUrl: besteEvidence(h.findings),
    });
  }

  let activated = 0;
  for (const s of sources) {
    if (!s.siteUrl || !s.evidenceUrl) continue;
    const h = hostKey(s.siteUrl);
    const existing = byHost.get(h);
    const entry = {
      siteUrl: s.siteUrl.startsWith("http") ? s.siteUrl : `https://${s.siteUrl}`,
      bedrijf: s.bedrijf || h,
      consentDatum: new Date().toISOString().slice(0, 10),
      consentRef,
      evidenceUrl: s.evidenceUrl,
      scope,
      status: "active",
      individualConsent: true,
      bulkGenerated: false,
      mikeBevestigdOp: new Date().toISOString(),
    };
    if (existing?.status === "revoked") {
      entry.revokedReden = undefined;
    }
    byHost.set(h, { ...existing, ...entry });
    activated++;
  }

  const out = {
    updatedAt: new Date().toISOString(),
    uitleg:
      "individualConsent=true alleen na echte toestemming. auth-verify vereist scan-toestemming.local.json — geen klantdata-export.",
    entries: [...byHost.values()],
  };
  writeFileSync(storePath, JSON.stringify(out, null, 2));
  const active = out.entries.filter((e) => e.status === "active" && e.individualConsent).length;
  console.log(`Toestemming geactiveerd: ${activated} sites uit leak-hits, ${active} actief met individualConsent`);
  console.log(`consentRef: ${consentRef.slice(0, 100)}`);
  console.log("Volgende: npm run scan:consent  (auth alleen als local credentials bestaan)");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}