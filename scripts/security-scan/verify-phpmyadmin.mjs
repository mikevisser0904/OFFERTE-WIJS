#!/usr/bin/env node
/**
 * Handmatige verificatie phpMyAdmin-hits uit leak-hits.json
 */
import { readFileSync, writeFileSync, copyFileSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const hits = JSON.parse(readFileSync(join(ROOT, "data/leak-hits.json"), "utf8"));

function hostOf(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function isPmaBody(body) {
  const b = (body || "").toLowerCase();
  return (
    b.includes("phpmyadmin") ||
    b.includes("pma_username") ||
    b.includes("welcome to phpmyadmin")
  );
}

async function probe(url) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "VakScan-Verify/1.0" },
    });
    const reader = res.body?.getReader();
    let body = "";
    if (reader) {
      const chunks = [];
      let n = 0;
      while (n < 32000) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        n += value.length;
      }
      body = Buffer.concat(chunks).toString("utf8", 0, Math.min(n, 32000));
    }
    return {
      ok: true,
      status: res.status,
      finalUrl: res.url,
      finalHost: hostOf(res.url),
      looksLikePma: res.status === 200 && isPmaBody(body),
      snippet: body.slice(0, 200).replace(/\s+/g, " "),
    };
  } catch (e) {
    return { ok: false, error: String(e) };
  } finally {
    clearTimeout(t);
  }
}

const SHARED_HOSTS = ["webhostingserver.nl", "hostingcp.eu", "hosting.nl"];

function classify(customerUrl, evidence, probeResult) {
  const custHost = hostOf(customerUrl);
  const evHost = hostOf(evidence);
  const finalHost = probeResult.finalHost || evHost;

  if (!probeResult.ok) return { verdict: "onbekend", reden: probeResult.error || "fetch failed" };
  if (!probeResult.looksLikePma) {
    return { verdict: "false_positive", reden: `HTTP ${probeResult.status}, geen phpMyAdmin HTML` };
  }

  const onOwnDomain = finalHost === custHost || finalHost.endsWith("." + custHost);
  const onShared = SHARED_HOSTS.some((h) => finalHost.includes(h));

  if (onOwnDomain) {
    return { verdict: "bevestigd", reden: `phpMyAdmin op eigen domein (${finalHost})` };
  }
  if (onShared || SHARED_HOSTS.some((h) => evHost.includes(h))) {
    return {
      verdict: "hosting_redirect",
      reden: `Login op gedeelde host ${finalHost} — vaak hosting-default, niet uniek jullie DB`,
    };
  }
  if (evHost && evHost !== custHost) {
    return { verdict: "redirect_anders", reden: `Redirect naar ${finalHost}` };
  }
  return { verdict: "bevestigd", reden: `phpMyAdmin bereikbaar (${finalHost})` };
}

const seen = new Set();
const results = [];

for (const h of hits.hits || []) {
  const pmaFindings = (h.findings || []).filter((f) => /phpmyadmin|phpMyAdmin/i.test(f.title + f.evidence));
  if (pmaFindings.length === 0) continue;
  const key = h.url;
  if (seen.has(key)) continue;
  seen.add(key);

  const evidence = pmaFindings[0].evidence;
  const probeOnCustomer = await probe(new URL("/phpmyadmin/", h.url).href);
  const probeEvidence = evidence ? await probe(evidence) : probeOnCustomer;

  const verdict = classify(h.url, evidence, probeEvidence);

  results.push({
    bedrijf: h.bedrijf,
    klantUrl: h.url,
    evidence,
    ...verdict,
    http: probeEvidence.status,
    finalUrl: probeEvidence.finalUrl,
    looksLikePma: probeEvidence.looksLikePma,
    verkoop: verdict.verdict === "bevestigd" ? "sterk" : verdict.verdict === "hosting_redirect" ? "voorzichtig" : "niet bellen",
  });
  await new Promise((r) => setTimeout(r, 400));
}

const summary = {
  verifiedAt: new Date().toISOString(),
  totaal: results.length,
  bevestigd: results.filter((r) => r.verdict === "bevestigd").length,
  hosting_redirect: results.filter((r) => r.verdict === "hosting_redirect").length,
  false_positive: results.filter((r) => r.verdict === "false_positive").length,
  overig: results.filter((r) => !["bevestigd", "hosting_redirect", "false_positive"].includes(r.verdict)).length,
  results,
};

const out = join(ROOT, "data/verificatie-phpmyadmin.json");
writeFileSync(out, JSON.stringify(summary, null, 2));
copyFileSync(out, join(ROOT, "public/verificatie-phpmyadmin.json"));

console.log("=== phpMyAdmin verificatie ===");
console.log(`Totaal unieke sites: ${summary.totaal}`);
console.log(`Bevestigd: ${summary.bevestigd} | Hosting-redirect: ${summary.hosting_redirect} | FP: ${summary.false_positive}`);
console.log("");
for (const r of results) {
  console.log(`${r.verdict.toUpperCase().padEnd(18)} ${r.bedrijf}`);
  console.log(`  ${r.reden}`);
  console.log(`  Verkoop: ${r.verkoop}`);
}