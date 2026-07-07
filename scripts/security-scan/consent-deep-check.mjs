#!/usr/bin/env node
/**
 * Diepere check ALLEEN voor URLs in scan-toestemming.json (status active).
 * - passive-deep: uitgebreide GET-analyse (geen brute force)
 * - auth-verify: één loginpoging met credentials uit scan-toestemming.local.json (nooit committen)
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { haalAdminBewijs, parseAdminHtml } from "../lead-hunter/admin-proof.mjs";
import {
  loadConsentStore,
  getActiveConsent,
  getLocalCredentials,
  consentAllows,
  hostKey,
} from "./consent-registry.mjs";

const root = process.cwd();

function unauthenticatedDashboard(html) {
  const l = html.toLowerCase();
  if (l.includes("navigation_panel") && l.includes("server_databases")) {
    return {
      critical: true,
      summary: "phpMyAdmin-hoofdscherm lijkt ZONDER inlog zichtbaar (misconfiguratie).",
    };
  }
  if (l.includes("adminer") && l.includes("database") && !l.includes("name=\"password\"")) {
    return { critical: true, summary: "Adminer toont mogelijk direct database-inhoud zonder inlog." };
  }
  return null;
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    method: "GET",
    redirect: "follow",
    headers: { "User-Agent": "VakScan-ConsentDeep/1.0", Accept: "text/html" },
    signal: AbortSignal.timeout(15_000),
  });
  const buf = await res.arrayBuffer();
  const html = new TextDecoder("utf8", { fatal: false }).decode(buf.slice(0, 200_000));
  return { status: res.status, html, finalUrl: res.url };
}

async function tryPhpMyAdminLogin(loginUrl, username, password) {
  const { html } = await fetchHtml(loginUrl);
  const tokenMatch = html.match(/name="token"\s+value="([^"]+)"/i);
  const token = tokenMatch?.[1] || "";

  const body = new URLSearchParams({
    pma_username: username,
    pma_password: password,
    server: "1",
  });
  if (token) body.set("token", token);

  const res = await fetch(loginUrl, {
    method: "POST",
    redirect: "follow",
    headers: {
      "User-Agent": "VakScan-ConsentDeep/1.0",
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "text/html",
    },
    body: body.toString(),
    signal: AbortSignal.timeout(20_000),
  });
  const buf = await res.arrayBuffer();
  const postHtml = new TextDecoder("utf8", { fatal: false }).decode(buf.slice(0, 200_000));
  const l = postHtml.toLowerCase();
  const loginFailed = l.includes("cannot log in") || l.includes("access denied") || l.includes("fout");
  const loginOk =
    !loginFailed &&
    (l.includes("navigation_panel") || l.includes("server_databases") || l.includes("logout.php"));

  return {
    attempted: true,
    loginSuccess: loginOk,
    summary: loginOk
      ? "Met door de klant verstrekte inloggegevens: toegang tot database-beheer bevestigd (geen data geëxporteerd)."
      : "Inlogpoging mislukt of sessie niet bevestigd — paneel blijft risico.",
  };
}

async function deepCheckEntry(entry) {
  const evidenceUrl = entry.evidenceUrl || entry.panelUrl;
  const result = {
    siteUrl: entry.siteUrl,
    bedrijf: entry.bedrijf,
    consentRef: entry.consentRef,
    consentDatum: entry.consentDatum,
    checkedAt: new Date().toISOString(),
    passive: null,
    auth: null,
  };

  if (!evidenceUrl) {
    result.error = "Geen evidenceUrl/panelUrl in toestemming-entry — vul in vanuit leak-hit of rapport.";
    return result;
  }

  if (consentAllows(entry.siteUrl, "passive-deep")) {
    const proof = await haalAdminBewijs(evidenceUrl);
    let dash = null;
    try {
      const { html } = await fetchHtml(evidenceUrl);
      dash = unauthenticatedDashboard(html);
      const parsed = parseAdminHtml(html, evidenceUrl);
      result.passive = {
        proof,
        unauthenticatedDashboard: dash,
        adminType: parsed?.adminType,
        zichtbaar: parsed?.zichtbaar,
        impact: parsed?.impact,
      };
    } catch (e) {
      result.passive = { proof, error: String(e) };
    }
  }

  if (consentAllows(entry.siteUrl, "auth-verify")) {
    const creds = getLocalCredentials(entry.siteUrl);
    if (!creds) {
      result.auth = {
        skipped: true,
        reason: "Geen credentials in data/scan-toestemming.local.json voor dit domein.",
      };
    } else {
      const loginUrl = creds.loginUrl || evidenceUrl;
      result.auth = await tryPhpMyAdminLogin(loginUrl, creds.username, creds.password);
    }
  }

  return result;
}

async function main() {
  const { entries } = loadConsentStore();
  const active = (entries || []).filter((e) => e.status === "active");
  if (!active.length) {
    console.log(
      "Geen actieve toestemming in data/scan-toestemming.json — voeg entries toe (zie scan-toestemming.example.json).",
    );
    process.exit(0);
  }

  const results = [];
  for (const entry of active) {
    console.log(`Consent deep: ${entry.bedrijf || entry.siteUrl}`);
    results.push(await deepCheckEntry(entry));
  }

  const out = {
    updatedAt: new Date().toISOString(),
    disclaimer:
      "Alleen uitgevoerd voor geregistreerde schriftelijke toestemming. Geen wachtwoorden in dit bestand.",
    results,
  };

  mkdirSync(join(root, "data"), { recursive: true });
  const outPath = join(root, "data/consent-deep-results.json");
  writeFileSync(outPath, JSON.stringify(out, null, 2));
  copyFileSync(outPath, join(root, "public/consent-deep-results.json"));

  const ok = results.filter((r) => r.passive?.proof?.ok || r.auth?.loginSuccess).length;
  console.log(`Klaar: ${results.length} sites, ${ok} met bevestigd bewijs. → data/consent-deep-results.json`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

export { deepCheckEntry, unauthenticatedDashboard };