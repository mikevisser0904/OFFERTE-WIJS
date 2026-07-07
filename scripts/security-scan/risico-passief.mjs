#!/usr/bin/env node
/**
 * Risico ontdekken ZONDER inlog: alleen GET.
 * - open_dashboard = phpMyAdmin zonder wachtwoord zichtbaar (kritiek)
 * - login_public = inlogscherm op internet (hoog)
 * Geen brute force.
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { detectPhpMyAdmin, extractTitle, isSiteNoisePage } from "./admin-panel-detect.mjs";

const ROOT = process.cwd();

function unauthenticatedDashboard(html) {
  const l = html.toLowerCase();
  if (l.includes("navigation_panel") && l.includes("server_databases")) {
    return "phpMyAdmin-dashboard zonder inlog zichtbaar";
  }
  return null;
}

async function checkUrl(url, meta = {}) {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: { "User-Agent": "VakScan-RisicoPassief/1.0", Accept: "text/html" },
      signal: AbortSignal.timeout(14_000),
    });
    const html = new TextDecoder("utf8", { fatal: false }).decode(
      (await res.arrayBuffer()).slice(0, 120_000),
    );
    if (isSiteNoisePage(html, res.status)) {
      return { url, ...meta, http: res.status, niveau: "geen", reden: "Geen phpMyAdmin (site/404)" };
    }
    const openDash = unauthenticatedDashboard(html);
    if (openDash) {
      return {
        url,
        ...meta,
        http: res.status,
        niveau: "kritiek",
        reden: openDash,
        actie: "Direct sluiten — geen wachtwoord nodig om binnen te komen",
      };
    }
    const pma = detectPhpMyAdmin(html);
    if (pma?.kind === "open_dashboard") {
      return {
        url,
        ...meta,
        http: res.status,
        niveau: "kritiek",
        reden: "Open phpMyAdmin-dashboard (detect)",
        actie: "Direct sluiten",
      };
    }
    if (pma && (pma.kind === "login" || pma.confidence === "high")) {
      return {
        url,
        ...meta,
        http: res.status,
        niveau: "hoog",
        reden: "Database-inlog staat open op internet — bots kunnen wachtwoorden proberen",
        actie: "Website Veilig €299 — VPN/IP-beperking + sterke wachtwoorden",
        titel: extractTitle(html),
      };
    }
    return { url, ...meta, http: res.status, niveau: "onduidelijk", reden: "Geen bevestigd panel" };
  } catch (e) {
    return { url, ...meta, niveau: "fout", reden: String(e) };
  }
}

async function main() {
  const seen = new Set();
  const jobs = [];

  const hits = existsSync(join(ROOT, "data/leak-hits.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/leak-hits.json"), "utf8")).hits || []
    : [];
  for (const h of hits) {
    for (const f of h.findings || []) {
      if (!f.evidence || !/phpmyadmin|adminer/i.test(f.evidence)) continue;
      if (seen.has(f.evidence)) continue;
      seen.add(f.evidence);
      jobs.push({ bedrijf: h.bedrijf, plaats: h.plaats, klantUrl: h.url, evidence: f.evidence });
    }
  }

  const pma = existsSync(join(ROOT, "data/pma-login-urls.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/pma-login-urls.json"), "utf8"))
    : {};
  for (const row of [...(pma.sterk || []), ...(pma.voorzichtig || [])]) {
    if (!row.loginUrl || seen.has(row.loginUrl)) continue;
    seen.add(row.loginUrl);
    jobs.push({
      bedrijf: row.bedrijf,
      plaats: row.plaats,
      klantUrl: row.klantUrl,
      evidence: row.loginUrl,
      verkoop: row.verkoop,
    });
  }

  const resultaten = [];
  for (const j of jobs) {
    const r = await checkUrl(j.evidence, {
      bedrijf: j.bedrijf,
      plaats: j.plaats,
      klantUrl: j.klantUrl,
      verkoop: j.verkoop,
    });
    resultaten.push(r);
    if (r.niveau === "kritiek" || r.niveau === "hoog") {
      console.log(`${r.niveau.toUpperCase()} · ${r.bedrijf} · ${r.url}`);
    }
  }

  const kritiek = resultaten.filter((r) => r.niveau === "kritiek").length;
  const hoog = resultaten.filter((r) => r.niveau === "hoog").length;

  const out = {
    updatedAt: new Date().toISOString(),
    uitleg:
      "Passief alleen. Inlogscherm op internet = risico zichtbaar zonder jouw wachtwoord. Geen brute force.",
    samenvatting: { gecontroleerd: resultaten.length, kritiek, hoog },
    resultaten: resultaten.sort((a, b) => {
      const ord = { kritiek: 0, hoog: 1, onduidelijk: 2, geen: 3, fout: 4 };
      return (ord[a.niveau] ?? 9) - (ord[b.niveau] ?? 9);
    }),
  };

  const path = join(ROOT, "data/risico-passief.json");
  writeFileSync(path, JSON.stringify(out, null, 2));
  mkdirSync(join(ROOT, "public"), { recursive: true });
  copyFileSync(path, join(ROOT, "public/risico-passief.json"));
  console.log(`\nKlaar: ${kritiek} kritiek, ${hoog} hoog (zonder inlog) → public/risico-passief.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});