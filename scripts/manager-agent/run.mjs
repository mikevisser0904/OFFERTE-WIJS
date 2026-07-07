#!/usr/bin/env node
/**
 * Manager Agent — houdt alle agents in de gaten, kiest volgende stap voor Grok + Mike.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "fs";
import { join } from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const ROOT = join(import.meta.dirname, "../..");
const NTFY = process.env.VAKSCAN_NTFY_TOPIC || "webklaar-mike";

function load(path, fallback) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

function hoursSince(iso) {
  if (!iso) return Infinity;
  return (Date.now() - new Date(iso).getTime()) / 3_600_000;
}

function runNpm(script) {
  const r = spawnSync("npm", ["run", script], { cwd: ROOT, encoding: "utf8", shell: true, timeout: 900_000 });
  return { ok: r.status === 0, out: ((r.stdout || "") + (r.stderr || "")).slice(-2000) };
}

async function notify(title, body, tags = "robot") {
  try {
    await fetch(`https://ntfy.sh/${NTFY}`, {
      method: "POST",
      headers: { Title: title, Tags: tags, Priority: title.includes("URGENT") ? "urgent" : "default" },
      body: body.slice(0, 3500),
    });
  } catch {
    /* ignore */
  }
}

function agentCard(id, naam, ok, detail, lastRun) {
  return { id, naam, status: ok ? "ok" : "actie", detail, lastRun: lastRun || null };
}

function collect() {
  const health = load(join(ROOT, "public/health.json"), { healthy: false });
  const autopilot = load(join(ROOT, "data/autopilot-status.json"), {});
  const agents = load(join(ROOT, "data/agents-status.json"), { agents: {} });
  const queue = load(join(ROOT, "data/scan-queue.json"), { items: [] });
  const leaks = load(join(ROOT, "data/leak-hits.json"), { hits: [] });
  const outreach = load(join(ROOT, "data/outreach-vandaag.json"), { vandaag: [] });
  const verkoopBewijs = load(join(ROOT, "data/verkoop-vandaag.json"), { vandaag: [] });
  const leads = load(join(ROOT, "data/potentiele-klanten.json"), { totaal: 0 });
  const wachtrij = load(join(ROOT, "data/maarten-wachtrij.json"), { ideeen: [] });
  const optimizer = load(join(ROOT, "data/optimizer-status.json"), {});
  const optWachtrij = load(join(ROOT, "data/optimizer-wachtrij.json"), { items: [] });
  const dataFlow = load(join(ROOT, "data/data-flow-status.json"), { healthy: true });

  const pendingMaarten = (wachtrij.ideeen || []).filter((i) => i.status === "pending").length;
  const queuePending = (queue.items || []).filter((i) => i.status === "pending").length;
  const leakCount = (leaks.hits || []).length;
  const outreachCount = (outreach.vandaag || []).length;
  const leadsTotaal = leads.totaal ?? leads.leads?.length ?? 0;

  const lh = agents.agents?.["lead-hunter"];
  const or = agents.agents?.outreach;
  const scanStale = hoursSince(
    (queue.items || []).find((i) => i.scannedAt)?.scannedAt || agents.updatedAt
  );

  return {
    health,
    autopilot,
    agents,
    queue,
    pendingMaarten,
    queuePending,
    leakCount,
    outreachCount,
    verkoopBewijsCount: (verkoopBewijs.vandaag || []).length,
    verkoopBewijsAge: hoursSince(verkoopBewijs.generatedAt),
    leadsTotaal,
    lh,
    or,
    vb: agents.agents?.["verkoop-bewijs"],
    scanStale,
    outreachAge: hoursSince(outreach.generatedAt),
    leadsAge: hoursSince(leads.generatedAt),
    optimizer,
    optPending: (optWachtrij.items || []).filter((i) => i.status === "pending").length,
    dataFlow,
    dataFlowDrift: dataFlow.summary?.drift ?? 0,
    dataFlowHealthy: dataFlow.healthy !== false,
  };
}

function decide(s) {
  const acties = [];
  let fase = "rust";
  let faseLabel = "Alles rustig";
  let grokPrompt = "manager check — geen urgente actie";
  let mikeActie = "Check /agents/ en /dashboard/";
  let prioriteit = 1;

  if (!s.dataFlowHealthy && s.dataFlowDrift > 0) {
    acties.push({ wie: "grok", actie: "Data-flow sync", script: "npm run agent:dataflow" });
    if (fase === "rust") {
      fase = "data";
      faseLabel = "Data streams drift";
      prioriteit = 4;
      grokPrompt = `agent dataflow — ${s.dataFlowDrift} stream(s) niet live op GitHub Pages`;
      mikeActie = "Even wachten tot CI sync pusht, of lokaal: npm run agent:dataflow";
    }
  }

  if (!s.health.healthy) {
    fase = "site";
    faseLabel = "Site probleem";
    prioriteit = 0;
    grokPrompt = "URGENT: public/health.json unhealthy — fix OFFERTE-WIJS, build, push, health-check opnieuw";
    mikeActie = "Wacht tot site weer groen is vóór verkopen.";
    acties.push({ wie: "grok", actie: "Fix site + push", script: "npm run build:pages" });
    return { fase, faseLabel, prioriteit, grokPrompt, mikeActie, acties };
  }

  if (s.pendingMaarten > 0) {
    fase = "bouw";
    faseLabel = "Maarten-wachtrij";
    prioriteit = 2;
    grokPrompt = `voer maarten wachtrij uit — ${s.pendingMaarten} pending (vóór verkopen)`;
    mikeActie = "Maarten-idee laten bouwen; jij kunt ondertussen /actie/ doen.";
    acties.push({ wie: "grok", actie: "Maarten wachtrij", script: "AGENTS.md maarten-wachtrij" });
  }

  const klantenLek = load(join(ROOT, "data/klanten-lek-rapport.json"), { metLek: 0 });
  if (klantenLek.metLek > 0 && s.outreachCount === 0) {
    acties.push({ wie: "grok", actie: "Outreach na klanten-lek", script: "npm run agent:outreach" });
  }

  if (s.verkoopBewijsCount > 0 && s.verkoopBewijsAge > 24) {
    acties.push({ wie: "grok", actie: "Verkoop-bewijs verversen", script: "npm run agent:verkoop-bewijs" });
  }

  if (s.leakCount > 0 && s.outreachAge > 12) {
    fase = "verkopen";
    faseLabel = "Lekken — verkopen!";
    prioriteit = Math.min(prioriteit, 3);
    grokPrompt = `agent verkoop-bewijs + outreach — ${s.leakCount} lek(ken), bewijs-first`;
    mikeActie = `${s.leakCount} lek(ken): /dashboard/ bewijs → /agents/ WhatsApp → €299`;
    acties.push({ wie: "grok", actie: "Verkoop-bewijs + outreach", script: "npm run agent:outreach" });
    acties.push({ wie: "mike", actie: "Bel top 3 met BEWIJS-blok", script: "/agents/" });
  } else if (s.verkoopBewijsCount > 0 && fase !== "bouw" && process.env.VAKSCAN_SALES !== "0") {
    fase = "verkopen";
    faseLabel = "Verkoop-bewijs klaar";
    prioriteit = Math.min(prioriteit, 3);
    grokPrompt = s.vb?.grokPrompt || s.vb?.agentPrompt || `Verkoop-bewijs: ${s.verkoopBewijsCount} met live HTTP + scanrapport`;
    mikeActie = `${s.verkoopBewijsCount} bewijs-klanten: /dashboard/ → controle-URL + rapport tonen`;
    acties.push({ wie: "mike", actie: "5 contacten met bewijs", script: "/dashboard/" });
  } else if (s.outreachCount > 0 && fase !== "bouw" && process.env.VAKSCAN_SALES === "1") {
    fase = "verkopen";
    faseLabel = "Outreach klaar";
    prioriteit = Math.min(prioriteit, 4);
    grokPrompt = s.or?.agentPrompt || `Mike: ${s.outreachCount} contacten op /agents/ — begin met lekken/score`;
    mikeActie = `${s.outreachCount} contacten wachten op /agents/`;
    acties.push({ wie: "mike", actie: "5 WhatsApps vandaag", script: "/actie/" });
  } else if (fase === "rust" && process.env.VAKSCAN_SALES !== "1") {
    fase = "verkopen";
    faseLabel = "€0 start — Fiverr & Marktplaats";
    prioriteit = Math.min(prioriteit, 4);
    grokPrompt = "Kleine verkoop-verbetering of docs/ZERO-START — Mike: Fiverr gig + Marktplaats op /fiverr/";
    mikeActie = "Plak gig op fiverr.com + Marktplaats-advertentie van /fiverr/ (bovenaan op de pagina)";
    acties.push({ wie: "mike", actie: "Fiverr + Marktplaats live", script: "/fiverr/" });
    acties.push({ wie: "mike", actie: "Warm netwerk (1 bericht)", script: "docs/ZERO-START.md" });
  }

  if (s.queuePending > 15 && s.scanStale > 20) {
    if (fase === "rust" || fase === "verkopen") fase = "scan";
    faseLabel = fase === "scan" ? "VakScan achterstand" : faseLabel;
    acties.push({ wie: "grok", actie: "Leak-scan queue", script: "npm run agent:vakscan-leaks" });
    if (prioriteit > 5) {
      prioriteit = 5;
      grokPrompt = `VakScan Leaks agent: ${s.queuePending} pending — npm run agent:vakscan-leaks`;
    }
  }

  if (s.leadsTotaal < 30 || s.leadsAge > 168) {
    acties.push({ wie: "grok", actie: "Funnel (leads+scan+outreach)", script: "npm run funnel:light" });
    if (fase === "rust" && s.leadsTotaal < 30) {
      fase = "prospectie";
      faseLabel = "Meer leads nodig";
      prioriteit = 6;
      grokPrompt = "npm run funnel:light — weinig leads, OSM + queue vullen";
    }
  }

  if (fase === "rust" && s.optPending > 0) {
    const top = load(join(ROOT, "data/optimizer-wachtrij.json"), { items: [] }).items?.find(
      (i) => i.status === "pending"
    );
    if (top) {
      fase = "optimaliseer";
      faseLabel = "Optimizer wachtrij";
      prioriteit = 5;
      grokPrompt = `optimizer wachtrij uitvoeren: ${top.actie} (${top.id})`;
      mikeActie = "Grok bouwt optimalisatie — jij kunt /actie/ blijven doen.";
      acties.push({ wie: "grok", actie: top.titel, script: top.script || "docs/VAKSCAN.md" });
    }
  }

  if (fase === "rust") {
    grokPrompt =
      s.optimizer?.grokPrompt && !s.optimizer.grokPrompt.startsWith("optimizer: draai")
        ? s.optimizer.grokPrompt
        : grokPrompt;
    mikeActie = mikeActie === "Check /agents/ en /dashboard/" ? "5 WhatsApps via /agents/" : mikeActie;
  }

  return { fase, faseLabel, prioriteit, grokPrompt, mikeActie, acties };
}

function writeStatus(manager, snapshot) {
  const agentsPath = join(ROOT, "data/agents-status.json");
  const agentsPub = join(ROOT, "public/agents-status.json");
  const base = load(agentsPath, { versie: 1, agents: {} });
  base.updatedAt = new Date().toISOString();
  base.manager = manager;
  base.agents = {
    ...base.agents,
    manager: {
      lastRun: manager.updatedAt,
      fase: manager.fase,
      grokPrompt: manager.grokPrompt,
      mikeActie: manager.mikeActie,
    },
  };
  writeFileSync(agentsPath, JSON.stringify(base, null, 2));
  mkdirSync(join(ROOT, "public"), { recursive: true });
  writeFileSync(agentsPub, JSON.stringify(base, null, 2));

  const mgrPath = join(ROOT, "data/manager-status.json");
  const mgrPub = join(ROOT, "public/manager-status.json");
  const payload = { ...manager, snapshot };
  writeFileSync(mgrPath, JSON.stringify(payload, null, 2));
  writeFileSync(mgrPub, JSON.stringify(payload, null, 2));

  const apPath = join(ROOT, "data/autopilot-status.json");
  const apPub = join(ROOT, "public/autopilot-status.json");
  if (existsSync(apPath)) {
    const ap = load(apPath, {});
    ap.managerFase = manager.fase;
    ap.nextAgentPrompt = manager.grokPrompt;
    ap.updatedAt = new Date().toISOString();
    writeFileSync(apPath, JSON.stringify(ap, null, 2));
    copyFileSync(apPath, apPub);
  }
}

async function main() {
  const execute = process.argv.includes("--execute");
  const s = collect();

  const registry = load(join(ROOT, "data/agents-registry.json"), { agents: [] });
  const agentState = s.agents.agents || {};
  const cards = (registry.agents || [])
    .filter((a) => a.id !== "manager" && a.id !== "deploy-pages")
    .map((a) => {
      const st = agentState[a.id] || {};
      let ok = st.ok !== false;
      let detail = st.agentPrompt || a.rol.slice(0, 60);
      if (a.id === "health-monitor") {
        ok = s.health.healthy;
        detail = ok ? `OK ${s.health.avgResponseMs}ms` : "site unhealthy";
      }
      if (a.id === "lead-hunter") {
        ok = s.leadsTotaal >= 15;
        detail = `${s.leadsTotaal} leads · ${s.queuePending} queue`;
      }
      if (a.id === "vakscan-leaks") {
        ok = s.leakCount > 0 || s.queuePending < 30;
        detail = `${s.leakCount} lekken · ${s.queuePending} pending`;
      }
      if (a.id === "verkoop-bewijs") {
        ok = s.verkoopBewijsCount > 0;
        detail = `${s.verkoopBewijsCount} met live bewijs`;
      }
      if (a.id === "outreach") {
        ok = s.outreachCount > 0;
        detail = `${s.outreachCount} contacten`;
      }
      if (a.id === "maarten-bouw") {
        ok = s.pendingMaarten === 0;
        detail = `${s.pendingMaarten} pending`;
      }
      if (a.id === "optimizer") {
        ok = s.optPending < 5;
        detail = `Grok-wachtrij ${s.optPending} · laatste fixes ${st.safeDone ?? 0}`;
      }
      if (a.id === "data-flow") {
        ok = s.dataFlowHealthy;
        detail = s.dataFlow?.agentPrompt || `${s.dataFlowDrift} drift`;
      }
      return agentCard(a.id, a.naam, ok, detail, st.lastRun);
    });

  const plan = decide(s);
  const executed = [];

  if (execute) {
    for (const a of plan.acties.filter((x) => x.wie === "grok" && x.script?.startsWith("npm"))) {
      const cmd = a.script.replace("npm run ", "");
      if (cmd === "agent:vakscan-leaks" && s.queuePending === 0) continue;
      console.log(`Execute: ${a.script}`);
      const r = runNpm(cmd);
      executed.push({ script: a.script, ok: r.ok });
    }
    const ranOutreach = executed.some((e) => e.script === "npm run agent:outreach" && e.ok);
    const ranLeaks = executed.some((e) => e.script === "npm run agent:vakscan-leaks" && e.ok);
    if (ranLeaks && !ranOutreach) {
      runNpm("agent:outreach");
    }
  }

  const manager = {
    updatedAt: new Date().toISOString(),
    agent: "manager",
    fase: plan.fase,
    faseLabel: plan.faseLabel,
    prioriteit: plan.prioriteit,
    grokPrompt: plan.grokPrompt,
    mikeActie: plan.mikeActie,
    acties: plan.acties,
    cards,
    executed: execute ? executed : undefined,
  };

  writeStatus(manager, {
    leakCount: s.leakCount,
    queuePending: s.queuePending,
    outreachCount: s.outreachCount,
    leadsTotaal: s.leadsTotaal,
    pendingMaarten: s.pendingMaarten,
  });

  const digest = [
    `Manager · ${plan.faseLabel}`,
    `Grok: ${plan.grokPrompt}`,
    `Mike: ${plan.mikeActie}`,
    ...cards.map((c) => `${c.naam}: ${c.status} — ${c.detail}`),
  ].join("\n");

  await notify(plan.fase === "site" ? "URGENT Manager" : `Manager: ${plan.faseLabel}`, digest);
  console.log(digest);

  if (plan.fase === "site") process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}