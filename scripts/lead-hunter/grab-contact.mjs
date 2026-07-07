#!/usr/bin/env node
/**
 * Haal echte telefoonnummers van vakman-websites (contactpagina + homepage).
 * Output: data/echte-klanten.json + vandaag-bellen.csv
 */
import { readFileSync, writeFileSync, existsSync, copyFileSync, mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const root = process.cwd();
const CONCURRENCY = Number(process.env.CONTACT_CONCURRENCY || 10);
const MAX = Number(process.env.CONTACT_MAX || 200);

const CONTACT_PATHS = ["/", "/contact/", "/contact", "/contact.php", "/over-ons/", "/over-ons", "/nl/contact/"];

const PHONE_RE =
  /(?:\+31|0031|31)[\s.-]?6[\s.-]?\d{1}[\s.-]?\d{3}[\s.-]?\d{4}|(?:\+31|0031)[\s.-]?\d{2}[\s.-]?\d{3}[\s.-]?\d{4}|(?<!\d)06[\s.-]?\d{1}[\s.-]?\d{3}[\s.-]?\d{4}|(?<!\d)0[1-9]\d[\s.-]?\d{3}[\s.-]?\d{4}/g;

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

function normalizePhone(raw) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("0031")) d = d.slice(2);
  if (d.startsWith("31") && d.length >= 11) return d;
  if (d.startsWith("0")) d = `31${d.slice(1)}`;
  if (d.startsWith("6") && d.length === 9) d = `31${d}`;
  if (d.length < 10 || d.length > 12) return null;
  return d;
}

function pickBestPhone(text) {
  const found = text.match(PHONE_RE) || [];
  const normalized = found.map(normalizePhone).filter(Boolean);
  const mobile = normalized.find((n) => n.startsWith("316"));
  if (mobile) return mobile;
  return normalized[0] || null;
}

function pickEmail(text) {
  const emails = (text.match(EMAIL_RE) || []).filter(
    (e) => !e.includes("example.com") && !e.includes("wixpress") && !e.includes("sentry")
  );
  return emails[0] || null;
}

async function fetchText(url) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "WebKlaar-Contact/1.0", Accept: "text/html" },
    });
    if (!res.ok) return "";
    const buf = await res.arrayBuffer();
    return new TextDecoder("utf8", { fatal: false }).decode(buf.slice(0, 120_000));
  } catch {
    return "";
  } finally {
    clearTimeout(t);
  }
}

async function contactForLead(lead) {
  if (lead.url.includes("facebook.com") && !lead.url.includes("wa.me")) {
    return { ...lead, telefoon: lead.telefoon || null, email: lead.email || null, contactBron: "skip-facebook" };
  }

  let blob = "";
  const base = lead.url.replace(/\/$/, "");
  for (const p of CONTACT_PATHS) {
    const html = await fetchText(new URL(p, base + "/").href);
    if (html.length > 200) blob += "\n" + html;
    if (blob.length > 80_000) break;
  }

  const telefoon = lead.telefoon || pickBestPhone(blob);
  const email = lead.email || pickEmail(blob);
  const displayPhone = telefoon
    ? telefoon.startsWith("31")
      ? `0${telefoon.slice(2)}`
      : telefoon
    : null;

  return {
    ...lead,
    telefoon: displayPhone,
    telefoonWa: telefoon,
    email,
    contactBron: telefoon || email ? "website" : "geen-contact",
    echt: !!(telefoon || email),
  };
}

async function pool(items, fn) {
  const out = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
      if (idx % 20 === 0) console.log(`  ${idx + 1}/${items.length}...`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return out;
}

function whatsappVoor(klant) {
  const msg = `Hoi, Mike van WebKlaar. Ik keek even naar uw website — er zijn 1–2 punten qua veiligheid/online vindbaarheid die we snel kunnen fixen (vaste prijs). Heeft u 10 min deze week?`;
  if (!klant.telefoonWa) return null;
  return `https://wa.me/${klant.telefoonWa}?text=${encodeURIComponent(msg)}`;
}

function probleemTekst(klant) {
  if (klant.redenen?.some((r) => r.includes("database"))) return "Mogelijk open beveiligingslek (VakScan)";
  if (klant.redenen?.some((r) => r.includes("HTTPS"))) return "Geen goede beveiligde verbinding (HTTPS)";
  if (klant.score >= 70) return "Website technisch zwak — fix €299";
  return "Oude site — moderniseren of Google";
}

async function main() {
  const scoredPath = join(root, "data/klanten-gescoord.json");
  const leadsPath = join(root, "data/potentiele-klanten.json");
  let leads = [];
  if (existsSync(scoredPath)) {
    const s = JSON.parse(readFileSync(scoredPath, "utf8"));
    leads = [...(s.leads || [])].sort((a, b) => (b.score || 0) - (a.score || 0));
  } else if (existsSync(leadsPath)) {
    leads = JSON.parse(readFileSync(leadsPath, "utf8")).leads || [];
  }

  leads = leads.slice(0, MAX);
  console.log(`Contact ophalen voor ${leads.length} bedrijven...`);

  const enriched = await pool(leads, contactForLead);
  const echt = enriched.filter((l) => l.echt);
  echt.sort((a, b) => (b.score || 0) - (a.score || 0));

  const exportRows = echt.map((k) => ({
    bedrijf: k.bedrijf,
    plaats: k.plaats,
    categorie: k.categorie,
    telefoon: k.telefoon,
    email: k.email || "",
    url: k.url,
    score: k.score ?? "",
    probleem: probleemTekst(k),
    aanbod: k.aanbod || "Website Veilig €299",
    whatsappUrl: whatsappVoor(k),
  }));

  const payload = {
    generatedAt: new Date().toISOString(),
    totaal: exportRows.length,
    zonderContact: enriched.length - echt.length,
    klanten: exportRows,
  };

  mkdirSync(join(root, "data"), { recursive: true });
  writeFileSync(join(root, "data/echte-klanten.json"), JSON.stringify(payload, null, 2));
  copyFileSync(join(root, "data/echte-klanten.json"), join(root, "public/echte-klanten.json"));

  const csv = [
    "bedrijf,plaats,telefoon,email,probleem,aanbod,url",
    ...exportRows.map((r) =>
      [r.bedrijf, r.plaats, r.telefoon, r.email, r.probleem, r.aanbod, r.url]
        .map((c) => `"${String(c).replace(/"/g, '""')}"`)
        .join(",")
    ),
  ].join("\n");
  writeFileSync(join(root, "data/vandaag-bellen.csv"), csv);
  copyFileSync(join(root, "data/vandaag-bellen.csv"), join(root, "public/vandaag-bellen.csv"));

  console.log(`\nEchte klanten: ${echt.length} (met telefoon of e-mail)`);
  console.log(`Bestand: data/echte-klanten.json · data/vandaag-bellen.csv`);
  if (exportRows[0]) {
    console.log(`Top: ${exportRows[0].bedrijf} · ${exportRows[0].telefoon || exportRows[0].email}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}