#!/usr/bin/env node
/**
 * Test verkoop-effectiviteit: tekstkwaliteit (feit vs angst), pipeline, bewijsdekking.
 * npm run test:effectiviteit
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { patchAgent } from "../agents/patch-status.mjs";

const ROOT = join(import.meta.dirname, "../..");

const ANGST = [
  /crimineel/i,
  /bots proberen/i,
  /klantgegevens.*weg/i,
  /ernstig lek/i,
  /gehackt/i,
  /\binbraak\b/i,
  /data kan gestolen/i,
  /staat open op internet/i,
];

const FEIT = [
  /FEIT \(passieve/i,
  /BEWIJS \(meetbaar/i,
  /ZELF NAKIJKEN/i,
  /passieve check/i,
  /niet ingelogd/i,
  /VakScan-weging/i,
];

function load(path, fb) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fb;
  }
}

function pct(n, d) {
  if (!d) return 0;
  return Math.round((n / d) * 100);
}

function scoreTekst(bericht) {
  if (!bericht) return { score: 0, angst: 0, feit: 0 };
  const angst = ANGST.filter((r) => r.test(bericht)).length;
  const feit = FEIT.filter((r) => r.test(bericht)).length;
  let score = 50;
  score += Math.min(30, feit * 8);
  score -= angst * 15;
  return { score: Math.max(0, Math.min(100, score)), angst, feit };
}

function main() {
  const echte = load(join(ROOT, "data/echte-klanten.json"), { klanten: [] });
  const verkoop = load(join(ROOT, "data/verkoop-vandaag.json"), { vandaag: [] });
  const outreach = load(join(ROOT, "data/outreach-vandaag.json"), { vandaag: [] });
  const funnel = load(join(ROOT, "data/funnel-status.json"), null);
  const kpi = load(join(ROOT, "data/kpi-snapshot.json"), { kpi: null });

  const metBewijs = (echte.klanten || []).filter((k) => k.adminProof?.ok && k.verkoopBericht && !k.uitgesloten);
  const metTelefoon = metBewijs.filter((k) => k.telefoon && String(k.telefoon).trim());
  const metRapport = metBewijs.filter((k) => k.rapportUrl || k.scanBewijs?.rapportUrl);
  const metControle = metBewijs.filter((k) => k.bewijsUrl || k.scanBewijs?.controleUrl);

  const tekstScores = metBewijs.map((k) => ({
    bedrijf: k.bedrijf,
    url: k.url,
    ...scoreTekst(k.verkoopBericht),
    kort: scoreTekst(k.verkoopKort),
  }));

  const avgTekst =
    tekstScores.length > 0
      ? Math.round(tekstScores.reduce((s, t) => s + t.score, 0) / tekstScores.length)
      : 0;
  const angstHits = tekstScores.filter((t) => t.angst > 0);
  const zwakKort = tekstScores.filter((t) => t.kort.score < 50);

  const pipelineScore = Math.round(
    Math.min(100, (verkoop.vandaag?.length || 0) * 6) * 0.4 +
      Math.min(100, (outreach.vandaag?.length || 0) * 5) * 0.3 +
      pct(metTelefoon.length, metBewijs.length) * 0.3,
  );

  const bewijsScore = Math.round(
    pct(metControle.length, metBewijs.length) * 0.4 +
      pct(metRapport.length, metBewijs.length) * 0.35 +
      pct(metBewijs.length, (echte.klanten || []).filter((k) => !k.uitgesloten).length) * 0.25,
  );

  const outboundKpi = kpi.kpi || {};
  const contacten = outboundKpi.contactenDezeWeek ?? 0;
  const reacties = outboundKpi.reacties ?? 0;
  const conversieScore =
    contacten > 0 ? Math.min(100, Math.round((reacties / contacten) * 100)) : null;

  const totaal = Math.round(
    avgTekst * 0.35 + pipelineScore * 0.3 + bewijsScore * 0.25 + (conversieScore ?? avgTekst * 0.5) * 0.1,
  );

  const aanbevelingen = [];
  if (metBewijs.length === 0) aanbevelingen.push("Geen bewijs-berichten — npm run agent:verkoop-bewijs");
  if (angstHits.length) aanbevelingen.push(`${angstHits.length} bericht(en) met angst-taal — lead:berichten opnieuw`);
  if (metTelefoon.length < 5) aanbevelingen.push("Weinig telefoons bij top-bewijs — meer contact uit queue");
  if (contacten === 0) aanbevelingen.push("Geen contacten in KPI — stuur 5 WhatsApps via /actie/ en log in /monitor/");
  if (conversieScore !== null && conversieScore < 20) aanbevelingen.push("Lage reactie-ratio — follow-up na 3 dagen, feit-first in 2e bericht");
  if (!funnel?.ok) aanbevelingen.push("Funnel niet OK — npm run funnel:light");
  if (aanbevelingen.length === 0) aanbevelingen.push("Pipeline klaar — meet deze week: contacten + reacties in monitor");

  const payload = {
    generatedAt: new Date().toISOString(),
    agent: "verkoop-effectiviteit",
    totaalScore: totaal,
    label: totaal >= 70 ? "Klaar om te verkopen" : totaal >= 45 ? "Verbeter punten" : "Pipeline of tekst fixen",
    dimensies: {
      tekstKwaliteit: { score: avgTekst, berichten: tekstScores.length, angstHits: angstHits.length },
      pipeline: {
        score: pipelineScore,
        verkoopVandaag: verkoop.vandaag?.length ?? 0,
        outreachVandaag: outreach.vandaag?.length ?? 0,
        metTelefoon: metTelefoon.length,
      },
      bewijsDekking: {
        score: bewijsScore,
        metAdminBewijs: metBewijs.length,
        metControleUrl: metControle.length,
        metRapportUrl: metRapport.length,
      },
      outbound: {
        contactenDezeWeek: contacten,
        reacties,
        conversiePct: conversieScore,
        gemeten: contacten > 0,
      },
    },
    steekproef: {
      beste: tekstScores.sort((a, b) => b.score - a.score).slice(0, 3),
      zwak: tekstScores.sort((a, b) => a.score - b.score).slice(0, 3),
      angstHits: angstHits.map((t) => t.bedrijf),
      zwakKort: zwakKort.map((t) => t.bedrijf),
    },
    funnelOk: funnel?.ok ?? null,
    aanbevelingen,
    grokPrompt: `test effectiviteit: score ${totaal}/100 — ${aanbevelingen[0]}`,
    agentPrompt: `Verkoop-effectiviteit ${totaal}% · ${metBewijs.length} bewijs · ${contacten} contacten deze week`,
  };

  const out = join(ROOT, "data/verkoop-effectiviteit.json");
  mkdirSync(join(ROOT, "data"), { recursive: true });
  writeFileSync(out, JSON.stringify(payload, null, 2));
  copyFileSync(out, join(ROOT, "public/verkoop-effectiviteit.json"));

  patchAgent("verkoop-effectiviteit", {
    ok: totaal >= 45,
    totaalScore: totaal,
    agentPrompt: payload.agentPrompt,
    grokPrompt: payload.grokPrompt,
  });

  console.log(JSON.stringify({ totaal, label: payload.label, aanbevelingen }, null, 2));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}