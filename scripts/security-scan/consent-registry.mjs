/**
 * Toestemmingsregister — merge publiek JSON + lokaal (gitignored).
 */
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const root = process.cwd();

export function hostKey(url) {
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return String(url).toLowerCase();
  }
}

function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

/** @returns {{ entries: object[], localCredentials: object[] }} */
export function loadConsentStore() {
  const base = readJson(join(root, "data/scan-toestemming.json"), { entries: [] });
  const local = readJson(join(root, "data/scan-toestemming.local.json"), { credentials: [] });
  return {
    entries: base.entries || [],
    localCredentials: local.credentials || [],
  };
}

export function getActiveConsent(siteUrl) {
  const h = hostKey(siteUrl);
  const { entries } = loadConsentStore();
  return (entries || []).find(
    (e) => e.status === "active" && (hostKey(e.siteUrl) === h || hostKey(e.siteUrl) === hostKey(siteUrl)),
  );
}

export function getLocalCredentials(siteUrl) {
  const h = hostKey(siteUrl);
  const { localCredentials } = loadConsentStore();
  return (localCredentials || []).find((c) => hostKey(c.siteUrl) === h && c.username && c.password);
}

export function consentAllows(siteUrl, scope) {
  const entry = getActiveConsent(siteUrl);
  if (!entry) return false;
  const scopes = entry.scope || ["passive-deep"];
  return scopes.includes(scope);
}

const BULK_CONSENT_SNIPPET = "bundeltoestemming";

/** Alleen echte schriftelijke ref — geen bulk-register zonder individualConsent. */
export function consentIsVerifiable(consent) {
  if (!consent || consent.status !== "active") return false;
  if (!consent.evidenceUrl || String(consent.evidenceUrl).includes("/404")) return false;
  if (consent.individualConsent) return true;
  const ref = (consent.consentRef || "").toLowerCase();
  if (ref.includes(BULK_CONSENT_SNIPPET) || consent.bulkGenerated) return false;
  return true;
}