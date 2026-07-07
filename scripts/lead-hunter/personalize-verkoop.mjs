#!/usr/bin/env node
/**
 * Persoonlijke verkoopberichten — echte scan + publiek admin-bewijs (zonder inloggen).
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, copyFileSync, mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { haalAdminBewijs } from "./admin-proof.mjs";
import { getActiveConsent, hostKey, consentIsVerifiable } from "../security-scan/consent-registry.mjs";

const root = process.cwd();
const SITE_ORIGIN = "https://mikevisser0904.github.io/OFFERTE-WIJS";

function rapportPubliekUrl(reportId) {
  if (!reportId) return null;
  return `${SITE_ORIGIN}/reports/${reportId}.json`;
}

function formatScanDatum(iso) {
  if (!iso) return new Date().toLocaleDateString("nl-NL");
  try {
    return new Date(iso).toLocaleString("nl-NL", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function bouwScanBewijs(rapport, proof, consentDeep) {
  const reportId = rapport?.id ?? null;
  const scanAt = rapport?.scannedAt ?? proof?.gecontroleerdOp ?? null;
  const liveAt = proof?.gecontroleerdOp ?? consentDeep?.checkedAt ?? null;
  const findings = uniekeFindings(rapport?.findings);
  const evidenceUrls = findings
    .filter((f) => f.evidence)
    .slice(0, 4)
    .map((f) => f.evidence);
  return {
    reportId,
    scanAt,
    liveCheckAt: liveAt,
    methode: "Passieve VakScan: HTTP GET op publieke URL's (geen inlog, geen poortscan)",
    rapportUrl: rapportPubliekUrl(reportId),
    controleUrl: proof?.url || evidenceUrls[0] || null,
    httpStatus: proof?.httpStatus ?? null,
    adminType: proof?.adminType ?? null,
    panelKind: proof?.panelKind ?? null,
    paginaTitel: proof?.titel ?? null,
    evidenceUrls,
    risicoScore: rapport?.risicoScore ?? null,
  };
}

function bewijsTekstBlok(bewijs) {
  if (!bewijs?.controleUrl && !bewijs?.rapportUrl && !bewijs?.evidenceUrls?.length) return null;
  const regels = [
    "BEWIJS (geen gevoel — zelf nakijken):",
    `• ${bewijs.methode}`,
  ];
  if (bewijs.scanAt) regels.push(`• Eerste scan: ${formatScanDatum(bewijs.scanAt)}`);
  if (bewijs.liveCheckAt) {
    regels.push(`• Live hercheck: ${formatScanDatum(bewijs.liveCheckAt)}`);
  }
  if (bewijs.httpStatus != null && bewijs.adminType) {
    const kind = bewijs.panelKind ? `, type: ${bewijs.panelKind}` : "";
    const titel = bewijs.paginaTitel ? `, titel pagina: „${bewijs.paginaTitel}"` : "";
    regels.push(`• Server antwoordde HTTP ${bewijs.httpStatus} — ${bewijs.adminType}${kind}${titel}`);
  }
  if (bewijs.reportId && bewijs.rapportUrl) {
    regels.push(`• Scanrapport (open JSON, zelfde feiten als onze tool): ${bewijs.rapportUrl}`);
    regels.push(`  Referentie: ${bewijs.reportId}`);
  }
  if (bewijs.controleUrl) {
    regels.push(`• Directe controle-URL uit de scan: ${bewijs.controleUrl}`);
  }
  for (const u of bewijs.evidenceUrls || []) {
    if (u && u !== bewijs.controleUrl) regels.push(`• Extra pad uit rapport: ${u}`);
  }
  regels.push("• Dit is geen vermoeden: plak de controle-URL in uw browser — u ziet wat wij zagen.");
  return regels.join("\n");
}

function loadUitgeslotenHosts() {
  const path = join(root, "data/scan-uitsluitingen.json");
  if (!existsSync(path)) return new Set();
  try {
    const data = JSON.parse(readFileSync(path, "utf8"));
    return new Set((data.hosts || []).map((h) => h.host.toLowerCase()));
  } catch {
    return new Set();
  }
}
const ETHICAL =
  "Nooit inloggen op klant-systemen. Nooit zeggen 'wij zitten in uw admin' — wel: 'uw admin-inlog staat op internet open'. Klant kan link zelf openen.";

function normUrl(u) {
  try {
    const x = new URL(u.startsWith("http") ? u : `https://${u}`);
    const host = x.hostname.replace(/^www\./i, "").toLowerCase();
    const path = x.pathname.replace(/\/$/, "") || "";
    return `${host}${path}`;
  } catch {
    return String(u).toLowerCase();
  }
}

function hostOnly(u) {
  try {
    return new URL(u.startsWith("http") ? u : `https://${u}`).hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return "";
  }
}

function uniekeFindings(findings) {
  const seen = new Set();
  const out = [];
  for (const f of findings || []) {
    const key = `${f.title}:${f.evidence || ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(f);
  }
  return out;
}

function laadRapporten() {
  const dir = join(root, "data/reports");
  const byHost = new Map();
  const byNorm = new Map();
  if (!existsSync(dir)) return { byHost, byNorm };
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".json")) continue;
    try {
      const r = JSON.parse(readFileSync(join(dir, f), "utf8"));
      if (!r.url) continue;
      byNorm.set(normUrl(r.url), r);
      byHost.set(hostOnly(r.url), r);
    } catch {
      /* skip */
    }
  }
  return { byHost, byNorm };
}

function vindRapport(klant, maps) {
  const n = normUrl(klant.url);
  if (maps.byNorm.has(n)) return maps.byNorm.get(n);
  const h = hostOnly(klant.url);
  if (maps.byHost.has(h)) return maps.byHost.get(h);
  for (const [key, r] of maps.byNorm) {
    if (key.startsWith(h)) return r;
  }
  const lh = join(root, "data/leak-hits.json");
  if (existsSync(lh)) {
    const hits = JSON.parse(readFileSync(lh, "utf8")).hits || [];
    for (const hit of hits) {
      if (hostOnly(hit.url) === h || normUrl(hit.url) === n) {
        return {
          url: klant.url,
          bedrijf: klant.bedrijf,
          risicoScore: hit.risicoScore,
          findings: hit.findings || [],
        };
      }
    }
  }
  return null;
}

function besteEvidenceUrl(rapport) {
  const findings = uniekeFindings(rapport?.findings);
  const db = findings.find((f) => (f.check === "database" || f.check === "datalek") && f.evidence);
  return db?.evidence || findings.find((f) => f.evidence)?.evidence || null;
}

function laadDbExportMap() {
  const path = join(root, "data/klanten-database-export.json");
  const map = new Map();
  if (!existsSync(path)) return map;
  try {
    const data = JSON.parse(readFileSync(path, "utf8"));
    for (const row of data.rijen || []) {
      if (row.url) map.set(hostKey(row.url), row);
    }
  } catch {
    /* */
  }
  return map;
}

function laadConsentDeep(klantUrl) {
  const path = join(root, "data/consent-deep-results.json");
  if (!existsSync(path)) return null;
  try {
    const store = JSON.parse(readFileSync(path, "utf8"));
    const h = hostKey(klantUrl);
    return (store.results || []).find((r) => hostKey(r.siteUrl) === h) || null;
  } catch {
    return null;
  }
}

function dbFeitenRegel(dbRow) {
  if (!dbRow) return null;
  const parts = [];
  if (dbRow.dbHost || dbRow.dbName) {
    parts.push(`database ${dbRow.dbType || "?"} op ${dbRow.dbHost || "?"} (${dbRow.dbName || "naam onbekend"})`);
  }
  if (dbRow.dbUser) parts.push(`gebruiker "${dbRow.dbUser}" in config gevonden`);
  if (dbRow.wachtwoordLek) parts.push("wachtwoord stond in een downloadbaar config-bestand");
  if (dbRow.sqlTabelCount > 0 && dbRow.sqlTabellen?.length) {
    const tabellen = dbRow.sqlTabellen.slice(0, 6).join(", ");
    parts.push(`${dbRow.sqlTabelCount} tabellen in een publieke SQL-dump (o.a. ${tabellen})`);
  }
  if (dbRow.panelUrl) parts.push(`beheerpaneel: ${dbRow.panelUrl}`);
  return parts.length ? parts.join("; ") : null;
}

function bouwBericht(klant, rapport, proof, consent, consentDeep, dbRow, scanBewijs) {
  const naam = klant.bedrijf || "uw bedrijf";
  const score = rapport?.risicoScore ?? klant.score ?? "?";
  const site = klant.url.replace(/^https?:\/\//, "");

  const intro = `Hoi, Mike van WebKlaar — ik werk met vakbedrijven zoals ${naam}.`;

  const toestemmingRegel = consent
    ? `Met uw schriftelijke toestemming (${consent.consentDatum || "geregistreerd"}, ref: ${consent.consentRef || "akkoord eigenaar"}) hebben we extra gecontroleerd.`
    : null;

  let kern;
  if (proof?.ok && proof.url) {
    const extraDash = consentDeep?.passive?.unauthenticatedDashboard?.summary;
    const extraAuth =
      consentDeep?.auth?.loginSuccess === true
        ? "Met door u verstrekte inloggegevens hebben we bevestigd dat het database-beheer echt bereikbaar is (zonder klantdata te exporteren)."
        : consentDeep?.auth?.loginSuccess === false
          ? "Ook met de door u verstrekte gegevens was extra verificatie nodig — het paneel blijft een risico."
          : null;

    const bewijsBlok = bewijsTekstBlok(scanBewijs);
    kern = `${toestemmingRegel ? `${toestemmingRegel}\n\n` : ""}${consent ? "" : "Ik heb NIET ingelogd op uw systemen zonder uw toestemming. "}Uw database-admin staat WEL open op internet — gecontroleerd op ${formatScanDatum(scanBewijs?.liveCheckAt || rapport?.scannedAt)}.
${bewijsBlok ? `\n\n${bewijsBlok}\n` : ""}
${extraDash ? `\nExtra bevinding: ${extraDash}` : ""}
${extraAuth ? `\n${extraAuth}` : ""}
${dbFeitenRegel(dbRow) ? `\nWat we passief uit uw publieke site/config zagen (geen inlog op uw database): ${dbFeitenRegel(dbRow)}.` : ""}

ZELF NAKIJKEN (30 sec) — plak in uw browser:
${proof.url}

Wat u daar ziet ZONDER wachtwoord:
${proof.zichtbaar}

Waarom dit u raakt:
${proof.impact}

Dit is hetzelfde scherm dat criminelen en bots automatisch zoeken. Vanaf hier is het raden van wachtwoorden of misbruik van een zwak/lekt wachtwoord — daarna kunnen klantgegevens en offertes weg.

Risicoscore op uw site: ${score}/100.`;
  } else {
    const regels = (klant.schrikRegels || []).map((r) => `• ${r}`).join("\n");
    const findingBullets = uniekeFindings(rapport?.findings)
      .slice(0, 3)
      .map((f) => `• ${f.klant || f.title}${f.evidence ? ` (${f.evidence})` : ""}`)
      .join("\n");
    const bewijsBlok = bewijsTekstBlok(scanBewijs);
    kern = `Check op ${site}:

${regels || findingBullets || "• Ernstige beveiligingsproblemen gevonden."}
${bewijsBlok ? `\n\n${bewijsBlok}` : ""}

Score: ${score}/100.`;
  }

  const close = `Wij halen dit binnen 2 werkdagen van het internet (Website Veilig, €299 vast). In een belletje van 10 min deel ik mijn scherm en laat ik u LIVE zien wat er openstaat — zodat u het zelf ziet. Vandaag of morgen bellen?`;

  return `${intro}\n\n${kern}\n\n${close}`;
}

function bouwSmsKort(klant, proof, scanBewijs) {
  const naam = klant.bedrijf;
  const ref = scanBewijs?.reportId ? ` Scanref ${scanBewijs.reportId}.` : "";
  if (proof?.ok && proof.url) {
    const http =
      proof.httpStatus != null ? ` (HTTP ${proof.httpStatus}, live gecontroleerd)` : " (live gecontroleerd)";
    return `Hoi, Mike (WebKlaar). ${naam}: uw database-beheer (${proof.adminType}) staat OPEN op internet${http} — wij loggen niet in: ${proof.url}.${ref} Zelf plakken in browser = zelfde beeld. €299 dichten? Bellen?`;
  }
  if (scanBewijs?.rapportUrl) {
    return `Hoi, Mike (WebKlaar). ${naam}: VakScan vond concrete risico's op uw site.${ref} Rapport: ${scanBewijs.rapportUrl} — 10 min bellen? Website Veilig €299.`;
  }
  return `Hoi, Mike (WebKlaar). ${naam}: ernstig lek op uw website gevonden — 10 min bellen? Website Veilig €299.`;
}

async function main() {
  const inPath = join(root, "data/echte-klanten.json");
  if (!existsSync(inPath)) {
    console.error("Eerst: npm run lead:contact");
    process.exit(1);
  }
  const store = JSON.parse(readFileSync(inPath, "utf8"));
  const maps = laadRapporten();
  const dbExportMap = laadDbExportMap();
  const blocked = loadUitgeslotenHosts();

  const klanten = [];
  for (const k of store.klanten || []) {
    if (blocked.has(hostKey(k.url)) || k.uitgesloten) {
      klanten.push({
        ...k,
        uitgesloten: true,
        probleem: "Geen actief lek (scan gecorrigeerd)",
        heeftScan: false,
        bewijsUrl: null,
        adminProof: null,
        databaseProfiel: null,
        verkoopBericht: null,
        verkoopKort: null,
        whatsappSchrik: null,
        herstelBericht:
          k.herstelBericht ||
          `Beste ${k.bedrijf},\n\nMike van WebKlaar. Excuses: onze eerdere melding over een open database op uw site was onjuist (fout in de automatische scan). Wij hebben niet ingelogd en geen data uit uw database gehaald.\n\nVriendelijke groet,\nMike`,
      });
      continue;
    }
    const rapport = vindRapport(k, maps);
    const evidenceUrl = besteEvidenceUrl(rapport);
    let proof = null;
    if (evidenceUrl) {
      proof = await haalAdminBewijs(evidenceUrl);
      if (proof && proof.ok === false) proof = null;
    }

    const actionableOnly = (rapport?.findings || []).filter(
      (f) =>
        f.check === "datalek" ||
        (f.check === "database" && f.verified && f.panelConfidence === "high"),
    );
    const schrikRegels = proof?.magClaimen
      ? [proof.magClaimen, proof.zichtbaar]
      : actionableOnly.slice(0, 2).map((f) => f.klant || f.title);

    const rawConsent = getActiveConsent(k.url);
    const consent = consentIsVerifiable(rawConsent) ? rawConsent : null;
    const consentDeep = consent ? laadConsentDeep(k.url) : null;
    const dbRow =
      proof?.ok && dbExportMap.get(hostKey(k.url))?.panelUrl ? dbExportMap.get(hostKey(k.url)) : null;
    const scanBewijs = bouwScanBewijs(rapport, proof, consentDeep);
    const verkoopBericht = bouwBericht({ ...k, schrikRegels }, rapport, proof, consent, consentDeep, dbRow, scanBewijs);
    const verkoopKort = bouwSmsKort(k, proof, scanBewijs);
    const wa = k.telefoonWa || (k.telefoon ? normalizeWa(k.telefoon) : null);
    const whatsappSchrik = wa ? `https://wa.me/${wa}?text=${encodeURIComponent(verkoopKort)}` : null;

    klanten.push({
      ...k,
      heeftScan: !!rapport && (!!proof?.ok || actionableOnly.length > 0),
      risicoScore: rapport?.risicoScore ?? k.score,
      schrikRegels,
      adminProof: proof,
      scanToestemming: consent
        ? { consentDatum: consent.consentDatum, consentRef: consent.consentRef, scope: consent.scope }
        : null,
      consentDeep: consentDeep
        ? {
            checkedAt: consentDeep.checkedAt,
            unauthenticatedDashboard: consentDeep.passive?.unauthenticatedDashboard?.summary || null,
            authVerified: consentDeep.auth?.loginSuccess ?? null,
          }
        : null,
      databaseProfiel: dbRow
        ? {
            dbType: dbRow.dbType,
            dbHost: dbRow.dbHost,
            dbName: dbRow.dbName,
            sqlTabellen: dbRow.sqlTabellen,
            panelUrl: dbRow.panelUrl,
          }
        : null,
      bewijsUrl: proof?.url || evidenceUrl || null,
      verkoopBericht,
      verkoopKort,
      whatsappSchrik,
      reportId: rapport?.id ?? null,
      scanBewijs,
      rapportUrl: scanBewijs.rapportUrl,
    });
  }

  klanten.sort((a, b) => (Number(b.risicoScore) || 0) - (Number(a.risicoScore) || 0));

  const metProof = klanten.filter((k) => k.adminProof?.ok).length;
  const metScanFeiten = klanten.filter((k) => !k.uitgesloten && k.adminProof?.ok && k.verkoopBericht).length;

  const out = {
    ...store,
    generatedAt: new Date().toISOString(),
    metPersoonlijkBericht: klanten.length,
    metAdminBewijs: metProof,
    metScanFeiten,
    ethisch: ETHICAL,
    klanten,
  };

  mkdirSync(join(root, "data"), { recursive: true });
  writeFileSync(inPath, JSON.stringify(out, null, 2));
  copyFileSync(inPath, join(root, "public/echte-klanten.json"));

  const exportTxt = klanten
    .filter((k) => k.adminProof?.ok && k.verkoopBericht)
    .slice(0, 40)
    .map((k) => `=== ${k.bedrijf} | ${k.telefoon || k.email} ===\n${k.verkoopBericht}\n`)
    .join("\n---\n\n");
  writeFileSync(join(root, "data/verkoop-berichten.txt"), exportTxt);
  copyFileSync(join(root, "data/verkoop-berichten.txt"), join(root, "public/verkoop-berichten.txt"));

  console.log(`Berichten: ${klanten.length} klanten, ${metProof} met live admin-bewijs (GET only)`);
  console.log(ETHICAL);
}

function normalizeWa(display) {
  const d = String(display).replace(/\D/g, "");
  if (d.startsWith("0")) return `31${d.slice(1)}`;
  if (d.startsWith("31")) return d;
  return `31${d}`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}