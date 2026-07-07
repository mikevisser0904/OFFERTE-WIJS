/**
 * Alleen lekken die echt een aanvalsoppervlak zijn (geen false positives voor leads).
 */
import { detectPhpMyAdmin, isSiteNoisePage } from "./admin-panel-detect.mjs";

/** phpMyAdmin / Adminer: alleen high-confidence login of open dashboard. */
export function isActionableDatabaseFinding(f) {
  if (!f || f.check !== "database") return false;
  if (f.verified !== true) return false;
  if (f.panelConfidence !== "high") return false;
  if (f.panelKind !== "login" && f.panelKind !== "open_dashboard") return false;
  return true;
}

/** .env / SQL / git — eigen matchers in leak-probes (geen panel-substring). */
export function isActionableDatalekFinding(f) {
  if (!f || f.check !== "datalek") return false;
  if (f.severity !== "critical") return false;
  return !!f.evidence;
}

export function isActionableLeakFinding(f) {
  return isActionableDatabaseFinding(f) || isActionableDatalekFinding(f);
}

export function filterActionableFindings(findings) {
  return (findings || []).filter(isActionableLeakFinding);
}

export function hasActionableLeakFindings(findings) {
  return filterActionableFindings(findings).length > 0;
}

/** Hernormaliseer opgeslagen hit (oude data zonder panelKind). */
export function hitIsActionable(hit) {
  const findings = filterActionableFindings(hit.findings || []);
  return findings.length > 0;
}

export function sanitizeHitEntry(hit) {
  const findings = filterActionableFindings(hit.findings || []);
  return {
    ...hit,
    findings,
    titles: findings.map((f) => f.title),
    actionable: findings.length > 0,
    risicoScore: findings.length ? hit.risicoScore : 0,
  };
}

/** Live check evidence URL vóór opslaan (extra gate). */
export async function confirmDatabaseEvidence(evidenceUrl) {
  if (!evidenceUrl) return false;
  try {
    const res = await fetch(evidenceUrl, {
      method: "GET",
      redirect: "follow",
      headers: { "User-Agent": "VakScan-Confirm/1.0", Accept: "text/html" },
      signal: AbortSignal.timeout(12_000),
    });
    const buf = await res.arrayBuffer();
    const body = new TextDecoder("utf8", { fatal: false }).decode(buf.slice(0, 80_000));
    if (isSiteNoisePage(body, res.status)) return false;
    const det = detectPhpMyAdmin(body);
    return !!det && det.confidence === "high";
  } catch {
    return false;
  }
}