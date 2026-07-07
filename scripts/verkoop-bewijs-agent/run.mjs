#!/usr/bin/env node
/**
 * Verkoop-bewijs Agent — verkoop met aantoonbaar bewijs (geen “lucht”).
 * 1) Ververs berichten (live HTTP-check + scanrapport)
 * 2) Publiceert verkoop-vandaag.json voor Mike + Grok
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { patchAgent } from "../agents/patch-status.mjs";

const ROOT = join(import.meta.dirname, "../..");
const NTFY = process.env.VAKSCAN_NTFY_TOPIC || "webklaar-mike";
const MAX = Number(process.env.VERKOOP_BEWIJS_MAX || 12);

function load(path, fb) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fb;
  }
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return "";
  }
}

function runBerichten() {
  const r = spawnSync("node", ["scripts/lead-hunter/personalize-verkoop.mjs"], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: "inherit",
    timeout: 900_000,
  });
  return r.status === 0;
}

function belScript(k) {
  const b = k.scanBewijs;
  const regels = [
    `1. Niet ingelogd — passieve check op ${b?.controleUrl || k.bewijsUrl || k.url}`,
    b?.httpStatus != null
      ? `2. Live: HTTP ${b.httpStatus}, ${b.adminType || "paneel"}${b.panelKind ? ` (${b.panelKind})` : ""}`
      : `2. Risicoscore ${k.risicoScore ?? k.score}/100`,
    b?.rapportUrl
      ? `3. Scanrapport tonen: ${b.rapportUrl}`
      : `3. BEWIJS-blok in WhatsApp — klant plakt URL zelf`,
  ];
  return regels.join("\n");
}

function grokTaakVoorContact(k, i) {
  const naam = k.bedrijf;
  const url = k.scanBewijs?.controleUrl || k.bewijsUrl;
  const rapport = k.scanBewijs?.rapportUrl || k.rapportUrl;
  return [
    `Verkoop-bewijs #${i + 1}: ${naam}`,
    `Doel: klant overtuigen met FEITEN — geen vermoeden.`,
    url ? `Laat klant deze URL openen: ${url}` : null,
    rapport ? `Optioneel scanrapport JSON: ${rapport}` : null,
    `Gebruik verkoopKort voor WhatsApp; volledig bericht heeft BEWIJS-blok.`,
    `Aanbod: Website Veilig €299 — 2 werkdagen, scherm delen in belletje.`,
    `Docs: docs/BEWIJS-AAN-KLANT.md`,
  ]
    .filter(Boolean)
    .join("\n");
}

async function notify(title, body) {
  try {
    await fetch(`https://ntfy.sh/${NTFY}`, {
      method: "POST",
      headers: { Title: title, Tags: "moneybag,clipboard" },
      body: body.slice(0, 3000),
    });
  } catch {
    /* ignore */
  }
}

async function main() {
  const skipBerichten = process.argv.includes("--skip-berichten");
  const fromOutreach = process.argv.includes("--from-outreach");

  if (!skipBerichten) {
    const ok = runBerichten();
    if (!ok) {
      patchAgent("verkoop-bewijs", { ok: false, agentPrompt: "lead:berichten mislukt — check netwerk/logs" });
      process.exit(1);
    }
  } else if (!existsSync(join(ROOT, "data/echte-klanten.json"))) {
    console.error("Geen echte-klanten.json — draai zonder --skip-berichten");
    process.exit(1);
  }

  const echte = load(join(ROOT, "data/echte-klanten.json"), { klanten: [] });
  const uitsluit = load(join(ROOT, "data/scan-uitsluitingen.json"), { hosts: [] });
  const blocked = new Set((uitsluit.hosts || []).map((h) => h.host.toLowerCase()));

  const kandidaten = (echte.klanten || [])
    .filter((k) => !k.uitgesloten && !blocked.has(hostOf(k.url)))
    .filter((k) => k.adminProof?.ok && k.verkoopBericht)
    .map((k) => ({
      prioriteit: 0,
      bedrijf: k.bedrijf,
      plaats: k.plaats,
      url: k.url,
      telefoon: k.telefoon || null,
      email: k.email || null,
      risicoScore: k.risicoScore ?? k.score,
      reportId: k.reportId ?? k.scanBewijs?.reportId ?? null,
      rapportUrl: k.rapportUrl ?? k.scanBewijs?.rapportUrl ?? null,
      controleUrl: k.scanBewijs?.controleUrl ?? k.bewijsUrl ?? k.adminProof?.url ?? null,
      scanBewijs: k.scanBewijs ?? null,
      adminProof: {
        ok: k.adminProof?.ok,
        adminType: k.adminProof?.adminType,
        httpStatus: k.adminProof?.httpStatus ?? k.scanBewijs?.httpStatus,
        panelKind: k.adminProof?.panelKind ?? k.scanBewijs?.panelKind,
      },
      verkoopKort: k.verkoopKort,
      whatsappSchrik: k.whatsappSchrik,
      whatsappUrl: k.whatsappSchrik || k.whatsappUrl || null,
      verkoopBericht: k.verkoopBericht,
      belScript: belScript(k),
      heeftTelefoon: !!(k.telefoon && String(k.telefoon).trim()),
      heeftConsent: !!k.scanToestemming,
    }));

  kandidaten.sort((a, b) => {
    const score = (x) =>
      (Number(x.risicoScore) || 0) * 10 +
      (x.heeftTelefoon ? 50 : 0) +
      (x.heeftConsent ? 20 : 0) +
      (x.scanBewijs?.httpStatus === 200 ? 5 : 0);
    return score(b) - score(a);
  });

  const vandaag = kandidaten.slice(0, MAX).map((k, i) => ({
    ...k,
    grokTaak: grokTaakVoorContact(k, i),
  }));

  const top = vandaag[0];
  const agentPrompt =
    vandaag.length > 0
      ? `Verkoop-bewijs: ${vandaag.length} klanten met live bewijs — start ${top.bedrijf} (HTTP ${top.scanBewijs?.httpStatus ?? "?"}) · /dashboard/ + /agents/`
      : "Verkoop-bewijs: geen adminProof — draai funnel of auto-verify";

  const grokPrompt =
    vandaag.length > 0
      ? `agent verkoop-bewijs — ${top.bedrijf}: controle ${top.controleUrl} · rapport ${top.reportId}. Mike belt met BEWIJS-blok, geen inbraak-claims.`
      : "agent verkoop-bewijs — eerst npm run agent:auto-verify && npm run agent:verkoop-bewijs";

  const payload = {
    generatedAt: new Date().toISOString(),
    agent: "verkoop-bewijs",
    bron: echte.generatedAt,
    metAdminBewijs: echte.metAdminBewijs ?? kandidaten.length,
    totaalMetBewijs: kandidaten.length,
    vandaag,
    agentPrompt,
    grokPrompt,
    ethisch: echte.ethisch || "Klant verifieert zelf via URL + scanrapport.",
    docs: "docs/BEWIJS-AAN-KLANT.md",
  };

  const out = join(ROOT, "data/verkoop-vandaag.json");
  const pub = join(ROOT, "public/verkoop-vandaag.json");
  writeFileSync(out, JSON.stringify(payload, null, 2));
  mkdirSync(join(ROOT, "public"), { recursive: true });
  writeFileSync(pub, JSON.stringify(payload, null, 2));

  patchAgent("verkoop-bewijs", {
    ok: vandaag.length > 0,
    contactenVandaag: vandaag.length,
    metBewijs: kandidaten.length,
    agentPrompt,
    grokPrompt,
    top3: vandaag.slice(0, 3).map((v) => `${v.bedrijf} · ${v.controleUrl}`),
  });

  if (!fromOutreach) {
    const lines = vandaag.slice(0, 6).map((v, i) => `${i + 1}. ${v.bedrijf} — ${v.controleUrl}`);
    await notify(`Verkoop-bewijs: ${vandaag.length}`, lines.join("\n") || "Geen bewijs-klanten");
  }

  console.log(agentPrompt);
  console.log(grokPrompt);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}