#!/usr/bin/env node
/**
 * Scan gericht op "echt erin" — legaal:
 * 1) phpMyAdmin open dashboard (geen wachtwoord)
 * 2) phpMyAdmin login met wachtwoord uit publieke .env (alleen bij toestemming)
 * 3) phpMyAdmin login met scan-toestemming.local.json (klant gaf ze)
 * Geen brute force / geen wachtwoordlijsten.
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { detectPhpMyAdmin } from "./admin-panel-detect.mjs";
import { hostKey, getActiveConsent, getLocalCredentials, consentIsVerifiable } from "./consent-registry.mjs";
import { hitIsActionable } from "./leak-actionable.mjs";

const ROOT = process.cwd();

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
    const row = {
      bedrijf: t.bedrijf,
      siteUrl: t.siteUrl,
      toestemming: !!consent,
      pmaUrl: t.pmaUrl || null,
      erin: false,
      methode: null,
      detail: null,
    };

    if (t.pmaUrl) {
      try {
        const { body } = await fetchHtml(t.pmaUrl);
        if (dashboardOpen(body)) {
          row.erin = true;
          row.methode = "open_dashboard";
          row.detail = "phpMyAdmin zonder wachtwoord bereikbaar";
        }
      } catch (e) {
        row.detail = String(e);
      }
    }

    if (!row.erin && consent && t.pmaUrl) {
      const local = getLocalCredentials(t.siteUrl);
      if (local?.username && local?.password) {
        const auth = await tryPmaLogin(local.loginUrl || t.pmaUrl, local.username, local.password);
        if (auth.erin) Object.assign(row, auth);
        else if (!row.methode) Object.assign(row, auth);
      }
    }

    if (!row.erin && consent && t.envUrl) {
      try {
        const { body, status } = await fetchHtml(t.envUrl, 32_000);
        if (status === 200) {
          const secrets = parseEnvSecrets(body);
          if (secrets && t.pmaUrl) {
            const auth = await tryPmaLogin(t.pmaUrl, secrets.user, secrets.pass);
            row.envGebruikt = true;
            if (auth.erin) {
              Object.assign(row, auth);
              row.methode = "login_via_publieke_env";
              row.detail = `${auth.detail} (credentials stonden in publieke ${t.envUrl})`;
            } else if (!row.methode) {
              row.methode = "env_gevonden_login_mislukt";
              row.detail = "DB-gegevens in .env maar phpMyAdmin-login geweigerd";
            }
          }
        }
      } catch {
        /* */
      }
    }

    if (!row.erin && !row.methode && t.pmaUrl) {
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
    focus: "echt_erin_zonder_brute_force",
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