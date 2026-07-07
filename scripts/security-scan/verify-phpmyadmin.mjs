#!/usr/bin/env node
/**
 * Verifieert alle phpMyAdmin-hits uit leak-hits.json.
 * Export: data/verificatie-phpmyadmin.json + data/pma-login-urls.json
 */
import { readFileSync, writeFileSync, copyFileSync } from "fs";
import { join } from "path";
import { detectPhpMyAdmin, looksLikePhpMyAdminBody } from "./admin-panel-detect.mjs";

const ROOT = process.cwd();
const hits = JSON.parse(readFileSync(join(ROOT, "data/leak-hits.json"), "utf8"));

const SHARED_HOST_MARKERS = [
  "webhostingserver.nl",
  "hostingcp.eu",
  "hosting.nl",
  "resellerdns.nl",
  "hostingcp.",
];

function hostOf(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

/** www.foo.nl en foo.nl = zelfde site */
function apexHost(hostname) {
  const h = (hostname || "").toLowerCase();
  return h.startsWith("www.") ? h.slice(4) : h;
}

function sameSiteHost(a, b) {
  if (!a || !b) return false;
  const aa = apexHost(a);
  const bb = apexHost(b);
  return aa === bb || a.endsWith("." + bb) || b.endsWith("." + aa);
}

function isSharedHostingHost(hostname) {
  const h = hostname || "";
  return SHARED_HOST_MARKERS.some((m) => h.includes(m));
}

function pmaScore(body, status) {
  if (!looksLikePhpMyAdminBody(body, status)) return 0;
  const det = detectPhpMyAdmin(body);
  if (!det) return 1;
  if (det.kind === "open_dashboard") return 100;
  if (det.confidence === "high") return 50;
  return 25;
}

async function probeOnce(url) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "VakScan-Verify/2.0 (+security-audit)" },
    });
    const reader = res.body?.getReader();
    let body = "";
    if (reader) {
      const chunks = [];
      let n = 0;
      while (n < 48_000) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        n += value.length;
      }
      body = Buffer.concat(chunks).toString("utf8", 0, Math.min(n, 48_000));
    }
    const det = detectPhpMyAdmin(body);
    return {
      ok: true,
      status: res.status,
      finalUrl: res.url,
      finalHost: hostOf(res.url),
      looksLikePma: looksLikePhpMyAdminBody(body, res.status),
      score: pmaScore(body, res.status),
      panelKind: det?.kind ?? null,
      panelConfidence: det?.confidence ?? null,
      panelDetail: det?.detail ?? null,
    };
  } catch (e) {
    return { ok: false, error: String(e) };
  } finally {
    clearTimeout(t);
  }
}

async function probe(url, retries = 2) {
  let last = await probeOnce(url);
  for (let i = 0; i < retries && (!last.ok || (!last.looksLikePma && last.status >= 500)); i++) {
    await new Promise((r) => setTimeout(r, 800 * (i + 1)));
    last = await probeOnce(url);
  }
  return last;
}

function collectProbeUrls(customerUrl, findings) {
  const base = customerUrl.replace(/\/$/, "");
  const paths = ["/phpmyadmin/", "/phpMyAdmin/", "/phpmyadmin/index.php", "/phpMyAdmin/index.php"];
  const urls = new Set();
  for (const f of findings) {
    if (f.evidence && /phpmyadmin|phpMyAdmin/i.test(f.evidence)) urls.add(f.evidence);
  }
  for (const p of paths) {
    try {
      urls.add(new URL(p, base + "/").href);
    } catch {
      /* skip */
    }
  }
  return [...urls];
}

function classify(customerUrl, bestProbe) {
  const custHost = hostOf(customerUrl);
  const finalHost = bestProbe.finalHost || "";

  if (!bestProbe.ok) {
    return { verdict: "onbekend", reden: bestProbe.error || "fetch failed" };
  }
  if (!bestProbe.looksLikePma) {
    return { verdict: "false_positive", reden: `HTTP ${bestProbe.status}, geen phpMyAdmin login/dashboard` };
  }

  if (sameSiteHost(finalHost, custHost)) {
    const extra =
      bestProbe.panelKind === "open_dashboard"
        ? " — dashboard mogelijk zonder inlog"
        : "";
    return {
      verdict: "bevestigd",
      reden: `phpMyAdmin op eigen domein (${finalHost})${extra}`,
    };
  }

  if (isSharedHostingHost(finalHost)) {
    return {
      verdict: "hosting_redirect",
      reden: `Login op gedeelde host ${finalHost} — hosting-default, niet per se unieke klant-DB`,
    };
  }

  if (finalHost && !sameSiteHost(finalHost, custHost)) {
    if (isSharedHostingHost(finalHost)) {
      return {
        verdict: "hosting_redirect",
        reden: `Redirect naar gedeelde host ${finalHost}`,
      };
    }
    return { verdict: "redirect_anders", reden: `Redirect naar ${finalHost}` };
  }

  return { verdict: "bevestigd", reden: `phpMyAdmin bereikbaar (${finalHost})` };
}

function verkoopLabel(verdict, bestProbe) {
  if (verdict === "bevestigd") return "sterk";
  if (verdict === "hosting_redirect") return "voorzichtig";
  if (verdict === "redirect_anders" && bestProbe?.looksLikePma) return "voorzichtig";
  return "niet bellen";
}

const seen = new Set();
const results = [];

for (const h of hits.hits || []) {
  const pmaFindings = (h.findings || []).filter(
    (f) => /phpmyadmin|phpMyAdmin/i.test((f.title || "") + (f.evidence || "")),
  );
  if (pmaFindings.length === 0) continue;
  const key = h.url;
  if (seen.has(key)) continue;
  seen.add(key);

  const probeUrls = collectProbeUrls(h.url, pmaFindings);
  let best = { ok: false, score: 0, looksLikePma: false };
  let bestUrl = probeUrls[0];

  for (const u of probeUrls) {
    const pr = await probe(u);
    const score = pr.looksLikePma ? pr.score || 1 : 0;
    if (score > (best.score || 0) || (score === best.score && pr.looksLikePma && !best.looksLikePma)) {
      best = { ...pr, score };
      bestUrl = u;
    }
    await new Promise((r) => setTimeout(r, 200));
  }

  const verdict = classify(h.url, best);

  results.push({
    bedrijf: h.bedrijf,
    plaats: h.plaats,
    klantUrl: h.url,
    geprobeerd: probeUrls.length,
    besteProbe: bestUrl,
    evidence: best.finalUrl || bestUrl,
    ...verdict,
    http: best.status,
    finalUrl: best.finalUrl,
    looksLikePma: best.looksLikePma,
    panelKind: best.panelKind,
    panelConfidence: best.panelConfidence,
    verkoop: verkoopLabel(verdict.verdict, best),
  });
  await new Promise((r) => setTimeout(r, 300));
}

const loginBereikbaar = results
  .filter((r) => r.looksLikePma && r.finalUrl)
  .map((r) => ({
    bedrijf: r.bedrijf,
    plaats: r.plaats,
    klantUrl: r.klantUrl,
    loginUrl: r.finalUrl,
    verdict: r.verdict,
    verkoop: r.verkoop,
    panelKind: r.panelKind,
    http: r.http,
  }));

const byFinal = new Map();
for (const row of loginBereikbaar) {
  const k = row.loginUrl;
  if (!byFinal.has(k)) byFinal.set(k, row);
}

const uniqueLogins = [...byFinal.values()].sort((a, b) => {
  const order = { sterk: 0, voorzichtig: 1, "niet bellen": 2 };
  return (order[a.verkoop] ?? 9) - (order[b.verkoop] ?? 9) || a.bedrijf.localeCompare(b.bedrijf);
});

const summary = {
  verifiedAt: new Date().toISOString(),
  totaal: results.length,
  loginBereikbaar: loginBereikbaar.length,
  uniekeLoginUrls: uniqueLogins.length,
  bevestigd: results.filter((r) => r.verdict === "bevestigd").length,
  hosting_redirect: results.filter((r) => r.verdict === "hosting_redirect").length,
  false_positive: results.filter((r) => r.verdict === "false_positive").length,
  onbekend: results.filter((r) => r.verdict === "onbekend").length,
  redirect_anders: results.filter((r) => r.verdict === "redirect_anders").length,
  results,
};

const pmaExport = {
  updatedAt: summary.verifiedAt,
  beschrijving: "Sites waar phpMyAdmin-login of dashboard bereikbaar is (VakScan verify)",
  sterk: uniqueLogins.filter((r) => r.verkoop === "sterk"),
  voorzichtig: uniqueLogins.filter((r) => r.verkoop === "voorzichtig"),
  alleLoginUrls: uniqueLogins,
};

const outVer = join(ROOT, "data/verificatie-phpmyadmin.json");
const outPma = join(ROOT, "data/pma-login-urls.json");
writeFileSync(outVer, JSON.stringify(summary, null, 2));
writeFileSync(outPma, JSON.stringify(pmaExport, null, 2));
copyFileSync(outVer, join(ROOT, "public/verificatie-phpmyadmin.json"));
copyFileSync(outPma, join(ROOT, "public/pma-login-urls.json"));

console.log("=== phpMyAdmin verificatie v2 ===");
console.log(`Sites met PMA-hit: ${summary.totaal}`);
console.log(`Login bereikbaar: ${summary.loginBereikbaar} (${summary.uniekeLoginUrls} unieke URL's)`);
console.log(
  `Bevestigd: ${summary.bevestigd} | Hosting: ${summary.hosting_redirect} | FP: ${summary.false_positive} | Onbekend: ${summary.onbekend}`,
);
console.log(`→ ${outPma}`);
console.log("");
for (const r of uniqueLogins) {
  console.log(`[${r.verkoop}] ${r.bedrijf}`);
  console.log(`  ${r.loginUrl}`);
}