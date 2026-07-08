#!/usr/bin/env node
/**
 * Score leads + snelle site-check → klanten-gescoord.json + klanten-vandaag.json
 */
import { readFileSync, writeFileSync, existsSync, copyFileSync, mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const root = process.cwd();
const CONCURRENCY = Number(process.env.LEAD_SCORE_CONCURRENCY || 12);
const TOP_N = Number(process.env.LEAD_TOP_N || 25);

const PRIORITY_CATS = new Set(["loodgieter", "installateur", "zonwering", "kozijnen", "elektricien"]);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function probeUrl(url) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "DoekoeWijs-LeadScore/1.0" },
    });
    const final = res.url || url;
    return {
      ok: res.status < 500,
      status: res.status,
      https: final.startsWith("https://"),
      httpOnly: url.startsWith("http://") && !final.startsWith("https://"),
      ms: 0,
    };
  } catch {
    return { ok: false, status: 0, https: false, httpOnly: false };
  } finally {
    clearTimeout(t);
  }
}

async function pool(items, fn) {
  const out = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return out;
}

function normalizePhone(nl) {
  if (!nl) return null;
  const d = String(nl).replace(/\D/g, "");
  if (d.length < 9) return null;
  if (d.startsWith("31")) return d;
  if (d.startsWith("0")) return `31${d.slice(1)}`;
  return `31${d}`;
}

function scoreOne(lead, probe, leakUrls) {
  const redenen = [];
  let score = 40;

  if (PRIORITY_CATS.has(lead.categorie)) {
    score += 12;
    redenen.push(`sterke niche: ${lead.categorie}`);
  }
  if (lead.telefoon) {
    score += 22;
    redenen.push("telefoon bekend");
  }
  if (lead.email) score += 8;

  const urlKey = lead.url.replace(/\/$/, "").toLowerCase();
  if (leakUrls.has(urlKey)) {
    score += 45;
    redenen.unshift("bevestigd database-lek (VakScan actionable)");
  }

  if (probe) {
    if (!probe.ok) {
      score -= 35;
      redenen.push("site reageert slecht");
    } else {
      if (probe.httpOnly || (!probe.https && lead.url.startsWith("http://"))) {
        score += 18;
        redenen.push("geen goede HTTPS");
      }
      if (!probe.https && lead.url.startsWith("https://")) {
        /* ok */
      } else if (!probe.https) {
        score += 12;
      }
    }
  }

  score = Math.min(100, Math.max(0, score));

  let aanbod = "Google Start €299";
  if (score >= 75 || leakUrls.has(urlKey)) aanbod = "Website Veilig €299 — urgent";
  else if (score >= 55) aanbod = "Website Veilig €299";
  else if (PRIORITY_CATS.has(lead.categorie)) aanbod = "Vakman Site €899";

  const whatsapp = normalizePhone(lead.telefoon);
  const msg = `Hoi, Mike van DoekoeWijs. Gratis veiligheidscheck op uw site — kort puntje om te verbeteren. 10 min bellen?`;
  const whatsappUrl = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}` : null;

  return {
    ...lead,
    score,
    redenen: redenen.slice(0, 4),
    aanbod,
    siteOk: probe?.ok ?? null,
    heeftHttps: probe?.https ?? null,
    whatsappUrl,
    actie: leakUrls.has(urlKey) ? "bel-nu" : score >= 60 ? "whatsapp" : "scan-eerst",
  };
}

async function main() {
  const leadsPath = join(root, "data/potentiele-klanten.json");
  if (!existsSync(leadsPath)) {
    console.error("Eerst: npm run lead:osm");
    process.exit(1);
  }
  const store = JSON.parse(readFileSync(leadsPath, "utf8"));
  const leads = store.leads || [];

  let leakUrls = new Set();
  const lhPath = join(root, "data/leak-hits.json");
  if (existsSync(lhPath)) {
    const lh = JSON.parse(readFileSync(lhPath, "utf8"));
    for (const h of lh.hits || []) {
      if (h.actionable === false) continue;
      const hasDb = (h.findings || []).some(
        (f) => f.check === "database" && f.verified && f.panelConfidence === "high",
      );
      const hasData = (h.findings || []).some((f) => f.check === "datalek");
      if (!hasDb && !hasData) continue;
      leakUrls.add(h.url.replace(/\/$/, "").toLowerCase());
    }
  }

  console.log(`Scoren ${leads.length} leads (parallel ${CONCURRENCY})...`);
  const probes = await pool(leads, async (l) => probeUrl(l.url));

  const scored = leads.map((l, i) => scoreOne(l, probes[i], leakUrls));
  scored.sort((a, b) => b.score - a.score);

  const withPhone = scored.filter((l) => l.telefoon).length;
  const top = scored.slice(0, TOP_N);

  const gescoord = {
    generatedAt: new Date().toISOString(),
    totaal: scored.length,
    metTelefoon: withPhone,
    leakMatches: scored.filter((l) => l.actie === "bel-nu").length,
    leads: scored,
  };

  const vandaag = {
    generatedAt: gescoord.generatedAt,
    instructie: "Werk deze lijst af vandaag: bel-nu eerst, dan whatsapp met telefoon, rest na VakScan.",
    top,
  };

  mkdirSync(join(root, "data"), { recursive: true });
  writeFileSync(join(root, "data/klanten-gescoord.json"), JSON.stringify(gescoord, null, 2));
  writeFileSync(join(root, "data/klanten-vandaag.json"), JSON.stringify(vandaag, null, 2));
  copyFileSync(join(root, "data/klanten-gescoord.json"), join(root, "public/klanten-gescoord.json"));
  copyFileSync(join(root, "data/klanten-vandaag.json"), join(root, "public/klanten-vandaag.json"));

  console.log(`Klaar: ${withPhone} met telefoon, top score ${top[0]?.score ?? 0}`);
  console.log(`Top 5: ${top.slice(0, 5).map((t) => `${t.bedrijf} (${t.score})`).join(" · ")}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}