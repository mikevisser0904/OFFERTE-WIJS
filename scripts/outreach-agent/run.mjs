#!/usr/bin/env node
/**
 * Outreach Agent — wie moet Mike vandaag contacteren?
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { patchAgent } from "../agents/patch-status.mjs";

const ROOT = join(import.meta.dirname, "../..");
const NTFY = process.env.VAKSCAN_NTFY_TOPIC || "webklaar-mike";
const MAX_VANDAAG = 15;

const DEMO = "https://mikevisser0904.github.io/OFFERTE-WIJS/demo/";

const SKIP_URL_PARTS = ["neverssl.com", "example.com", "example.org", "test.com"];
function isDemoOrTestUrl(url) {
  const u = (url || "").toLowerCase();
  return SKIP_URL_PARTS.some((p) => u.includes(p));
}

function load(path, fallback) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

function whatsappLek(bedrijf, titel) {
  const naam = bedrijf || "uw bedrijf";
  return `Hoi! Mike van WebKlaar. Ik bood u graag een gratis veiligheidscheck op uw website aan — daarbij viel op: ${titel}. Dat lossen wij vaak in 2 dagen op met Website Veilig (€299). Zin in een kort belletje? Geen verplichtingen.`;
}

function whatsappKoud(bedrijf) {
  const naam = bedrijf || "daar";
  return `Hoi ${naam}, Mike hier. Ik help vakbedrijven met een moderne, veilige site — snel en vaste prijs. Demo (2 min): ${DEMO} — past dit bij jullie?`;
}

function scoreItem(item) {
  if (item.leakHit || item.type === "lek") return 1000 + (item.risicoScore || 0);
  if (item.risicoScore >= 60) return 500 + item.risicoScore;
  if (item.risicoScore >= 35) return 200 + item.risicoScore;
  return 50;
}

async function notify(title, body) {
  try {
    await fetch(`https://ntfy.sh/${NTFY}`, {
      method: "POST",
      headers: { Title: title, Tags: "calling,moneybag" },
      body: body.slice(0, 3000),
    });
  } catch {
    /* ignore */
  }
}

async function main() {
  const hits = load(join(ROOT, "data/leak-hits.json"), { hits: [] });
  const reports = load(join(ROOT, "public/reports/index.json"), []);
  const queue = load(join(ROOT, "data/scan-queue.json"), { items: [] });
  const leads = load(join(ROOT, "data/potentiele-klanten.json"), { leads: [] });
  const klantenVandaag = load(join(ROOT, "data/klanten-vandaag.json"), { top: [] });
  const gescoord = load(join(ROOT, "data/klanten-gescoord.json"), { leads: [] });
  const klantenLek = load(join(ROOT, "data/klanten-lek-rapport.json"), { klanten: [] });
  const echte = load(join(ROOT, "data/echte-klanten.json"), { klanten: [] });
  const uitsluit = load(join(ROOT, "data/scan-uitsluitingen.json"), { hosts: [] });
  const blockedHosts = new Set((uitsluit.hosts || []).map((h) => h.host.toLowerCase()));
  function hostOf(url) {
    try {
      return new URL(url).hostname.replace(/^www\./i, "").toLowerCase();
    } catch {
      return "";
    }
  }

  const candidates = [];
  const seenUrls = new Set();

  function pushCandidate(c) {
    const key = c.url?.toLowerCase();
    if (!key || isDemoOrTestUrl(c.url) || seenUrls.has(key)) return;
    if (blockedHosts.has(hostOf(c.url))) return;
    if (!c.whatsapp && c.whatsappUrl) {
      try {
        const u = new URL(c.whatsappUrl);
        c.whatsapp = decodeURIComponent(u.searchParams.get("text") || "");
      } catch {
        c.whatsapp = whatsappKoud(c.bedrijf);
      }
    }
    if (!c.whatsapp) c.whatsapp = whatsappKoud(c.bedrijf);
    seenUrls.add(key);
    candidates.push(c);
  }

  for (const k of echte.klanten || []) {
    if (k.uitgesloten || blockedHosts.has(hostOf(k.url))) continue;
    if (!k.heeftScan || !k.verkoopBericht) continue;
    const regel = (k.schrikRegels || [])[0] || "concrete beveiligingsfouten op uw site";
    pushCandidate({
      type: "lek",
      prioriteit: 0,
      bedrijf: k.bedrijf,
      plaats: k.plaats,
      url: k.url,
      risicoScore: k.risicoScore ?? k.score,
      reden: regel,
      actie: k.aanbod || "Website Veilig €299",
      whatsapp: k.verkoopKort || k.verkoopBericht.slice(0, 500),
      whatsappUrl: k.whatsappSchrik || k.whatsappUrl || undefined,
      telefoon: k.telefoon || undefined,
      reportId: k.reportId,
      verkoopBericht: k.verkoopBericht,
    });
  }

  for (const k of klantenLek.klanten || []) {
    if (!k.heeftLek) continue;
    const top = k.database?.panels?.[0]?.panel || k.database?.samenvatting?.slice(0, 60) || "database/datalek";
    pushCandidate({
      type: "lek",
      prioriteit: 1,
      bedrijf: k.bedrijf,
      plaats: k.plaats,
      url: k.url,
      risicoScore: k.risicoScore ?? 100,
      reden: `Klanten-lek: ${top}`,
      actie: "Website Veilig €299 — vandaag bellen",
      whatsapp: whatsappLek(k.bedrijf, top),
      reportId: k.reportId,
    });
  }

  for (const h of hits.hits || []) {
    const top = h.titles?.[0] || "mogelijk database- of datalek";
    pushCandidate({
      type: "lek",
      prioriteit: 1,
      bedrijf: h.bedrijf,
      plaats: h.plaats,
      url: h.url,
      risicoScore: h.risicoScore,
      reden: `Database/datalek: ${top}`,
      actie: "Website Veilig €299 — vandaag bellen",
      whatsapp: whatsappLek(h.bedrijf, top),
      reportId: h.reportId,
    });
  }

  for (const t of klantenVandaag.top || []) {
    if (t.actie !== "bel-nu" && (t.score || 0) < 70) continue;
    const reden =
      t.actie === "bel-nu"
        ? `Top vandaag + lek/score ${t.score}`
        : `Top vandaag score ${t.score} — ${(t.redenen || [])[0] || "sterke prospect"}`;
    pushCandidate({
      type: t.actie === "bel-nu" ? "lek" : "score",
      prioriteit: t.actie === "bel-nu" ? 1 : 2,
      bedrijf: t.bedrijf,
      plaats: t.plaats,
      url: t.url,
      risicoScore: t.score,
      reden,
      actie: t.aanbod || "Website Veilig €299",
      whatsapp: t.whatsappUrl
        ? null
        : whatsappLek(t.bedrijf, reden),
      whatsappUrl: t.whatsappUrl || undefined,
      telefoon: t.telefoon || undefined,
    });
  }

  for (const g of (gescoord.leads || []).slice(0, 40)) {
    if ((g.score || 0) < 75 || g.actie !== "bel-nu") continue;
    pushCandidate({
      type: "score",
      prioriteit: 2,
      bedrijf: g.bedrijf,
      plaats: g.plaats,
      url: g.url,
      risicoScore: g.score,
      reden: `Gescoord ${g.score} — ${(g.redenen || [])[0] || "hoge prioriteit"}`,
      actie: g.aanbod || "Website Veilig €299",
      whatsapp: g.whatsappUrl ? null : whatsappLek(g.bedrijf, `score ${g.score}`),
      whatsappUrl: g.whatsappUrl || undefined,
      telefoon: g.telefoon || undefined,
    });
  }

  for (const r of reports) {
    if (isDemoOrTestUrl(r.url)) continue;
    if (r.leakHit !== true && (r.risicoScore || 0) < 60) continue;
    if (seenUrls.has(r.url?.toLowerCase())) continue;
    pushCandidate({
      type: "rapport",
      prioriteit: r.risicoScore >= 60 ? 2 : 3,
      bedrijf: r.bedrijf,
      plaats: r.plaats,
      url: r.url,
      risicoScore: r.risicoScore,
      reden: `VakScan score ${r.risicoScore} (${r.niveauLabel})`,
      actie: r.risicoScore >= 60 ? "Website Veilig" : "Demo + Vakman Site",
      whatsapp: whatsappLek(r.bedrijf, `score ${r.risicoScore} op de veiligheidscheck`),
      reportId: r.id,
    });
  }

  const inQueue = new Set(queue.items.map((i) => i.url?.toLowerCase()));
  for (const l of leads.leads || []) {
    if (candidates.length >= MAX_VANDAAG * 2) break;
    const key = l.url?.toLowerCase();
    if (!key || seenUrls.has(key)) continue;
    if (!inQueue.has(key)) continue;
    const q = queue.items.find((i) => i.url?.toLowerCase() === key);
    if (q?.status === "pending") continue;
    if (q?.leakHit) continue;
    pushCandidate({
      type: "lead",
      prioriteit: 4,
      bedrijf: l.bedrijf,
      plaats: l.plaats,
      url: l.url,
      risicoScore: q?.risicoScore ?? 0,
      reden: `Lead (${l.categorie || "vakman"}) — nog geen lek, wel in funnel`,
      actie: "Koud: demo sturen",
      whatsapp: whatsappKoud(l.bedrijf),
    });
  }

  candidates.sort((a, b) => scoreItem(b) - scoreItem(a));
  const vandaag = candidates.slice(0, MAX_VANDAAG);

  const payload = {
    generatedAt: new Date().toISOString(),
    agent: "outreach",
    totaalKandidaten: candidates.length,
    vandaag,
    samenvatting: {
      lekken: vandaag.filter((v) => v.type === "lek").length,
      hogeScore: vandaag.filter((v) => v.type === "rapport" || v.type === "score").length,
      koud: vandaag.filter((v) => v.type === "lead").length,
    },
    agentPrompt:
      vandaag.length > 0
        ? `Outreach: ${vandaag.length} contacten klaar op /agents/ — begin met ${vandaag[0].bedrijf} (${vandaag[0].reden})`
        : "Outreach: geen hits — draai npm run funnel (of funnel:light)",
  };

  const out = join(ROOT, "data/outreach-vandaag.json");
  const pub = join(ROOT, "public/outreach-vandaag.json");
  writeFileSync(out, JSON.stringify(payload, null, 2));
  mkdirSync(join(ROOT, "public"), { recursive: true });
  writeFileSync(pub, JSON.stringify(payload, null, 2));

  patchAgent("outreach", {
    ok: true,
    contactenVandaag: vandaag.length,
    lekkenEerst: payload.samenvatting.lekken,
    agentPrompt: payload.agentPrompt,
    top3: vandaag.slice(0, 3).map((v) => `${v.bedrijf}: ${v.reden}`),
  });

  const lines = vandaag.slice(0, 8).map((v, i) => `${i + 1}. ${v.bedrijf} — ${v.reden}`);
  await notify(`Outreach: ${vandaag.length} voor Mike`, lines.join("\n") || "Geen contacten — leads + scan draaien");
  console.log(payload.agentPrompt);
  console.log(lines.join("\n"));
}

main();