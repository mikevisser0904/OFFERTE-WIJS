#!/usr/bin/env node
/**
 * Actieve toegang — alleen legaal:
 * 1) phpMyAdmin-dashboard ZONDER wachtwoord (echt "erin")
 * 2) Inlog met credentials uit scan-toestemming.local.json (klant gaf ze)
 * GEEN brute force.
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { detectPhpMyAdmin } from "./admin-panel-detect.mjs";
import { getLocalCredentials, loadConsentStore } from "./consent-registry.mjs";

const ROOT = process.cwd();

async function fetchHtml(url) {
  const res = await fetch(url, {
    method: "GET",
    redirect: "follow",
    headers: { "User-Agent": "VakScan-Actief/1.0", Accept: "text/html,text/plain" },
    signal: AbortSignal.timeout(15_000),
  });
  const body = new TextDecoder("utf8", { fatal: false }).decode((await res.arrayBuffer()).slice(0, 200_000));
  return { status: res.status, url: res.url, body };
}

function dashboardBewijs(body) {
  const l = body.toLowerCase();
  if (l.includes("navigation_panel") && l.includes("server_databases")) {
    const m = body.match(/server_databases[^<]{0,200}/i);
    return {
      erin: true,
      type: "open_dashboard",
      bewijs: m ? m[0].slice(0, 120) : "phpMyAdmin hoofdscherm zichtbaar zonder inlog",
    };
  }
  const det = detectPhpMyAdmin(body);
  if (det?.kind === "open_dashboard") {
    return { erin: true, type: "open_dashboard", bewijs: det.detail };
  }
  return { erin: false, type: "login_vereist", bewijs: "Alleen inlogscherm — erin kan alleen met wachtwoord (klant) of door aanvallers die raden (wij doen dat niet)." };
}

async function tryPhpMyAdminLogin(loginUrl, username, password) {
  const { body: html } = await fetchHtml(loginUrl);
  const tokenMatch = html.match(/name="token"\s+value="([^"]+)"/i);
  const body = new URLSearchParams({
    pma_username: username,
    pma_password: password,
    server: "1",
  });
  if (tokenMatch?.[1]) body.set("token", tokenMatch[1]);

  const res = await fetch(loginUrl, {
    method: "POST",
    redirect: "follow",
    headers: {
      "User-Agent": "VakScan-Actief/1.0",
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "text/html",
    },
    body: body.toString(),
    signal: AbortSignal.timeout(20_000),
  });
  const postHtml = new TextDecoder("utf8", { fatal: false }).decode((await res.arrayBuffer()).slice(0, 200_000));
  const dash = dashboardBewijs(postHtml);
  return {
    attempted: true,
    erin: dash.erin,
    loginSuccess: dash.erin,
    bewijs: dash.bewijs,
  };
}

async function main() {
  const risico = existsSync(join(ROOT, "data/risico-passief.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/risico-passief.json"), "utf8"))
    : { resultaten: [] };
  const urls = new Map();
  for (const r of risico.resultaten || []) {
    if (r.niveau !== "hoog" && r.niveau !== "kritiek") continue;
    const key = r.bedrijf || r.url;
    if (!urls.has(key) || r.url.includes(r.klantUrl?.replace(/^https?:\/\//, "").split("/")[0] || "___")) {
      urls.set(key, r);
    }
  }

  const demos = [];
  for (const r of urls.values()) {
    const { body } = await fetchHtml(r.url);
    const dash = dashboardBewijs(body);
    demos.push({
      bedrijf: r.bedrijf,
      url: r.url,
      ...dash,
    });
    if (dash.erin) console.log(`✓ ERIN (zonder wachtwoord): ${r.bedrijf}`);
    else console.log(`○ Login vereist: ${r.bedrijf}`);
  }

  const { entries } = loadConsentStore();
  const withCreds = [];
  for (const e of entries.filter((x) => x.status === "active" && x.individualConsent)) {
    const creds = getLocalCredentials(e.siteUrl);
    if (!creds?.username || !creds?.password) continue;
    const loginUrl = creds.loginUrl || e.evidenceUrl;
    const auth = await tryPhpMyAdminLogin(loginUrl, creds.username, creds.password);
    withCreds.push({ bedrijf: e.bedrijf, siteUrl: e.siteUrl, loginUrl, ...auth });
    console.log(auth.erin ? `✓ ERIN (klant-inlog): ${e.bedrijf}` : `✗ Inlog mislukt: ${e.bedrijf}`);
  }

  const out = {
    updatedAt: new Date().toISOString(),
    disclaimer:
      "Geen brute force. 'Erin zonder wachtwoord' = open dashboard. Anders: vul scan-toestemming.local.json met klant-inlog.",
    zonderWachtwoord: demos.filter((d) => d.erin),
    loginVereist: demos.filter((d) => !d.erin).length,
    metKlantInlog: withCreds,
  };

  const path = join(ROOT, "data/demo-actieve-toegang.json");
  writeFileSync(path, JSON.stringify(out, null, 2));
  mkdirSync(join(ROOT, "public"), { recursive: true });
  copyFileSync(path, join(ROOT, "public/demo-actieve-toegang.json"));

  console.log(
    `\nSamenvatting: ${out.zonderWachtwoord.length} erin zonder wachtwoord, ${out.loginVereist} alleen login-scherm, ${withCreds.filter((c) => c.erin).length} erin via klant-inlog`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});