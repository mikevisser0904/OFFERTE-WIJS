#!/usr/bin/env node
/**
 * Lead hunter — OpenStreetMap (gratis, legaal).
 * Vakbedrijven met website-tag in ~20km straal rond NL-steden.
 */
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { execFileSync } from "child_process";

const OVERPASS_ENDPOINTS = [
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass-api.de/api/interpreter",
  "https://overpass.openstreetmap.fr/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];

const STEDEN = [
  { plaats: "Utrecht", lat: 52.0907, lon: 5.1214, radius: 20000 },
  { plaats: "Amersfoort", lat: 52.1561, lon: 5.3878, radius: 20000 },
  { plaats: "Amsterdam", lat: 52.3676, lon: 4.9041, radius: 20000 },
  { plaats: "Rotterdam", lat: 51.9225, lon: 4.4777, radius: 20000 },
  { plaats: "Den Haag", lat: 52.0705, lon: 4.3007, radius: 20000 },
  { plaats: "Haarlem", lat: 52.3874, lon: 4.6462, radius: 20000 },
];

const OSM_FILTERS = [
  { categorie: "loodgieter", selector: '["craft"="plumber"]' },
  { categorie: "installateur", selector: '["craft"="hvac"]' },
  { categorie: "installateur", selector: '["craft"="heating_engineer"]' },
  { categorie: "installateur", selector: '["craft"="sanitary_engineer"]' },
  { categorie: "elektricien", selector: '["craft"="electrician"]' },
  { categorie: "schilder", selector: '["craft"="painter"]' },
  { categorie: "dakdekker", selector: '["craft"="roofer"]' },
  { categorie: "kozijnen", selector: '["craft"="window_construction"]' },
  { categorie: "kozijnen", selector: '["craft"="carpenter"]' },
  { categorie: "kozijnen", selector: '["craft"="glazier"]' },
  { categorie: "zonwering", selector: '["shop"="window_blind"]' },
  { categorie: "zonwering", selector: '["shop"="curtain"]' },
  { categorie: "installateur", selector: '["amenity"="plumber"]' },
];

const CATEGORIE_RANK = {
  loodgieter: 1,
  installateur: 2,
  elektricien: 3,
  schilder: 4,
  dakdekker: 5,
  kozijnen: 6,
  zonwering: 7,
};

function buildCityQuery(lat, lon, radius) {
  const around = `around:${radius},${lat},${lon}`;
  const lines = OSM_FILTERS.flatMap(({ selector }) => [
    `  node(${around})["website"]${selector};`,
    `  way(${around})["website"]${selector};`,
  ]);
  return `[out:json][timeout:90];\n(\n${lines.join("\n")}\n);\nout center tags;`;
}

function normalizeUrl(raw) {
  let u = String(raw || "").trim();
  if (!u) return null;
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
  try {
    const url = new URL(u);
    if (!/^https?:$/i.test(url.protocol)) return null;
    if (!url.hostname.includes(".")) return null;
    return url.href.replace(/\/$/, "");
  } catch {
    return null;
  }
}

function naamFromTags(tags) {
  return tags.name || tags["name:nl"] || tags.operator || tags.brand || "";
}

function plaatsFromTags(tags, fallback) {
  return tags["addr:city"] || tags["addr:place"] || fallback;
}

function categorieFromTags(tags) {
  const craft = tags.craft;
  const shop = tags.shop;
  const amenity = tags.amenity;
  if (craft === "plumber") return "loodgieter";
  if (craft === "electrician") return "elektricien";
  if (craft === "painter") return "schilder";
  if (craft === "roofer") return "dakdekker";
  if (craft === "window_construction" || craft === "carpenter" || craft === "glazier") return "kozijnen";
  if (shop === "window_blind" || shop === "curtain") return "zonwering";
  if (craft === "hvac" || craft === "heating_engineer" || craft === "sanitary_engineer" || amenity === "plumber")
    return "installateur";
  return craft || shop || amenity || "vakman";
}

function overpassFetch(query) {
  let lastErr = null;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const out = execFileSync(
        "curl",
        [
          "-sS",
          "-m",
          "120",
          "-A",
          "WebKlaar-LeadHunter/1.0",
          "-X",
          "POST",
          endpoint,
          "-H",
          "Content-Type: application/x-www-form-urlencoded; charset=UTF-8",
          "--data-urlencode",
          `data=${query}`,
        ],
        { encoding: "utf8", maxBuffer: 30 * 1024 * 1024 }
      );
      if (out.includes("<title>406 Not Acceptable</title>")) {
        throw new Error("HTTP 406");
      }
      if (out.includes("<strong") && out.includes("Error</strong>")) {
        throw new Error(out.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 240));
      }
      return JSON.parse(out);
    } catch (e) {
      lastErr = new Error(`${endpoint}: ${e.message}`);
    }
  }
  throw lastErr ?? new Error("Geen Overpass endpoint bereikbaar");
}

function fetchCity(stad) {
  const q = buildCityQuery(stad.lat, stad.lon, stad.radius);
  const data = overpassFetch(q);
  const leads = [];
  for (const el of data.elements || []) {
    const tags = el.tags || {};
    const url = normalizeUrl(tags.website || tags["contact:website"]);
    if (!url) continue;
    const bedrijf = naamFromTags(tags);
    if (!bedrijf) continue;
    leads.push({
      bedrijf,
      plaats: plaatsFromTags(tags, stad.plaats),
      zoekstad: stad.plaats,
      url,
      categorie: categorieFromTags(tags),
      prioriteit: "scan-eerst",
    });
  }
  return leads;
}

function dedupe(leads) {
  const byUrl = new Map();
  for (const l of leads) {
    const key = l.url.toLowerCase();
    const existing = byUrl.get(key);
    if (!existing) {
      byUrl.set(key, l);
      continue;
    }
    const rank = (x) => CATEGORIE_RANK[x.categorie] ?? 99;
    if (rank(l) < rank(existing)) byUrl.set(key, { ...l, zoekstad: existing.zoekstad });
  }
  return [...byUrl.values()].sort(
    (a, b) => a.plaats.localeCompare(b.plaats) || a.bedrijf.localeCompare(b.bedrijf)
  );
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const all = [];
  for (const stad of STEDEN) {
    console.log(`OSM: ${stad.plaats}...`);
    try {
      const part = fetchCity(stad);
      console.log(`  → ${part.length} met website`);
      all.push(...part);
      await sleep(2500);
    } catch (e) {
      console.warn(`  fout: ${e.message}`);
    }
  }

  const leads = dedupe(all);
  const root = process.cwd();
  const outJson = join(root, "data/potentiele-klanten.json");
  const outTxt = join(root, "data/klanten-leads-import.txt");
  const outPublic = join(root, "public/potentiele-klanten.json");

  const perPlaats = STEDEN.map((s) => ({
    plaats: s.plaats,
    count: leads.filter((l) => l.zoekstad === s.plaats).length,
  }));

  const exportLeads = leads.map(({ zoekstad: _z, ...rest }) => rest);

  const payload = {
    generatedAt: new Date().toISOString(),
    bron: "osm",
    totaal: exportLeads.length,
    perPlaats,
    leads: exportLeads,
  };

  mkdirSync(join(root, "data"), { recursive: true });
  writeFileSync(outJson, JSON.stringify(payload, null, 2));
  writeFileSync(outPublic, JSON.stringify(payload, null, 2));
  const lines = [
    "# Bedrijf|Plaats|URL — npm run scan:import -- data/klanten-leads-import.txt",
    ...exportLeads.map((l) => `${l.bedrijf}|${l.plaats}|${l.url}`),
  ];
  writeFileSync(outTxt, lines.join("\n") + "\n");

  console.log(`\nKlaar: ${leads.length} unieke leads → ${outJson}`);
  console.log("Per stad:", perPlaats.map((p) => `${p.plaats}=${p.count}`).join(", "));
  console.log(`Import: npm run scan:import -- data/klanten-leads-import.txt`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});