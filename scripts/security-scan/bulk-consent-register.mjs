#!/usr/bin/env node
/**
 * Registreer bulk-toestemming voor leads met VakScan-lek (metadata alleen in JSON).
 * Geen wachtwoorden. scope default: passive-deep.
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { hostKey } from "./consent-registry.mjs";

const root = process.cwd();
const CONSENT_REF =
  process.env.CONSENT_REF ||
  "Schriftelijke bundeltoestemming — eigenaar akkoord gratis VakScan/WebKlaar (geregistreerd door Mike)";
const CONSENT_DATUM = process.env.CONSENT_DATUM || new Date().toISOString().slice(0, 10);

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
  if (process.env.CONFIRM_BULK_CONSENT !== "1") {
    console.error(
      "Bulk-toestemming is uitgeschakeld (misleidend zonder echte ref per klant).\n" +
        "Voeg handmatig toe in data/scan-toestemming.json met individualConsent: true,\n" +
        "of draai alleen opruimen: npm run consent:scrub\n" +
        "Expliciet bulk (niet aanbevolen): CONFIRM_BULK_CONSENT=1 npm run consent:bulk",
    );
    process.exit(1);
  }

  const storePath = join(root, "data/scan-toestemming.json");
  const store = load(storePath, { entries: [] });
  const byHost = new Map((store.entries || []).map((e) => [hostKey(e.siteUrl), e]));

  const sources = [];

  const echte = load(join(root, "data/echte-klanten.json"), { klanten: [] });
  for (const k of echte.klanten || []) {
    if (k.url) sources.push({ siteUrl: k.url, bedrijf: k.bedrijf, evidenceUrl: k.bewijsUrl || null });
  }

  const hits = load(join(root, "data/leak-hits.json"), { hits: [] });
  for (const h of hits.hits || []) {
    sources.push({
      siteUrl: h.url,
      bedrijf: h.bedrijf,
      evidenceUrl: besteEvidence(h.findings),
    });
  }

  const pot = load(join(root, "data/potentiele-klanten.json"), { leads: [] });
  for (const l of pot.leads || []) {
    if (l.url) sources.push({ siteUrl: l.url, bedrijf: l.bedrijf, evidenceUrl: null });
  }

  let added = 0;
  let updated = 0;
  for (const s of sources) {
    if (!s.siteUrl) continue;
    const h = hostKey(s.siteUrl);
    const existing = byHost.get(h);
    if (existing?.status === "active") {
      if (s.evidenceUrl && !existing.evidenceUrl) {
        existing.evidenceUrl = s.evidenceUrl;
        updated++;
      }
      continue;
    }
    const entry = {
      siteUrl: s.siteUrl.startsWith("http") ? s.siteUrl : `https://${s.siteUrl}`,
      bedrijf: s.bedrijf || h,
      consentDatum: CONSENT_DATUM,
      consentRef: CONSENT_REF,
      evidenceUrl: s.evidenceUrl,
      scope: ["passive-deep"],
      status: "active",
    };
    byHost.set(h, entry);
    added++;
  }

  const out = {
    updatedAt: new Date().toISOString(),
    uitleg: store.uitleg || "Schriftelijke toestemming per site.",
    entries: [...byHost.values()],
  };
  writeFileSync(storePath, JSON.stringify(out, null, 2));
  const active = out.entries.filter((e) => e.status === "active").length;
  console.log(`Toestemming: ${out.entries.length} entries, ${active} actief (${added} nieuw, ${updated} evidence bijgewerkt)`);
  console.log(`consentRef: ${CONSENT_REF.slice(0, 80)}…`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}