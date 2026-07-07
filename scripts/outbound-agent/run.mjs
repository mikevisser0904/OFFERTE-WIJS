#!/usr/bin/env node
/**
 * Outbound Agent — volledige automatisering van verkoop-contacten (email/webhook/WA template).
 * npm run agent:outbound-auto
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "fs";
import { join } from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { patchAgent } from "../agents/patch-status.mjs";
import { isLive, sendEmail, sendWebhook, sendWhatsAppCloud, ntfyDigest } from "./channels.mjs";

const ROOT = join(import.meta.dirname, "../..");

function load(path, fb) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fb;
  }
}

function saveJson(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2));
}

function hostOf(url) {
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return "";
  }
}

function normEmail(e) {
  const s = String(e || "").trim().toLowerCase();
  return s.includes("@") ? s : null;
}

function normPhoneWa(tel) {
  const d = String(tel || "").replace(/\D/g, "");
  if (d.length < 9) return null;
  if (d.startsWith("31")) return d;
  if (d.startsWith("0")) return `31${d.slice(1)}`;
  return `31${d}`;
}

function emailBody(contact) {
  const kort = contact.bericht || contact.verkoopKort || "";
  const url = contact.controleUrl || contact.url;
  const rapport = contact.rapportUrl || "";
  return `Beste ${contact.bedrijf},

${kort}

Zelf nakijken (geen inlog): ${url}
${rapport ? `Scanrapport: ${rapport}\n` : ""}
Aanbod: Website Veilig €299 (vast) — beheer-URL afschermen, doorgaans binnen 2 werkdagen.

Groet,
Mike van WebKlaar
${process.env.OUTBOUND_REPLY_PHONE ? `Tel: ${process.env.OUTBOUND_REPLY_PHONE}` : ""}`.trim();
}

function recentHosts(log, days) {
  const cut = Date.now() - days * 86400000;
  const set = new Set();
  for (const e of log.entries || []) {
    if (e.status === "sent" || e.status === "simulated") {
      const t = new Date(e.at).getTime();
      if (t >= cut && e.host) set.add(e.host);
    }
  }
  return set;
}

function bumpKpi(contactenDelta) {
  const paths = [join(ROOT, "data/kpi-snapshot.json"), join(ROOT, "public/kpi-snapshot.json")];
  for (const p of paths) {
    if (!existsSync(p)) continue;
    try {
      const snap = JSON.parse(readFileSync(p, "utf8"));
      const kpi = snap.kpi || {};
      kpi.contactenDezeWeek = (kpi.contactenDezeWeek || 0) + contactenDelta;
      if (!kpi.startDatum) kpi.startDatum = new Date().toISOString().slice(0, 10);
      snap.kpi = kpi;
      snap.updatedAt = new Date().toISOString();
      snap.updatedBy = "outbound-agent";
      saveJson(p, snap);
    } catch {
      /* */
    }
  }
}

function pickContacts(config) {
  const verkoop = load(join(ROOT, "data/verkoop-vandaag.json"), { vandaag: [] });
  const outreach = load(join(ROOT, "data/outreach-vandaag.json"), { vandaag: [] });
  const log = load(join(ROOT, "data/outbound-log.json"), { entries: [] });
  const blocked = recentHosts(log, config.cooldownDays ?? 14);

  const byUrl = new Map();
  for (const v of verkoop.vandaag || []) {
    if (config.alleenMetBewijs && !v.controleUrl) continue;
    byUrl.set(v.url, { ...v, bron: "verkoop-bewijs", prioriteit: 0 });
  }
  for (const o of outreach.vandaag || []) {
    if (o.bron === "verkoop-bewijs" && byUrl.has(o.url)) continue;
    if (config.alleenMetBewijs && !o.controleUrl && o.type !== "bewijs") continue;
    if (!byUrl.has(o.url)) byUrl.set(o.url, { ...o, prioriteit: o.prioriteit ?? 2 });
  }

  const list = [...byUrl.values()]
    .filter((c) => !blocked.has(hostOf(c.url)))
    .filter((c) => normEmail(c.email) || normPhoneWa(c.telefoon))
    .sort((a, b) => (a.prioriteit ?? 9) - (b.prioriteit ?? 9));

  return list.slice(0, config.maxPerRun ?? 5);
}

async function deliver(contact, config) {
  const host = hostOf(contact.url);
  const email = normEmail(contact.email);
  const phone = normPhoneWa(contact.telefoon);
  const bericht = contact.verkoopKort || contact.whatsapp || "";
  contact.bericht = bericht;

  const results = [];
  const kanalen = config.kanalen || ["email"];

  if (kanalen.includes("email") && email) {
    const subject = (config.email?.onderwerp || "Website check — {bedrijf}").replace("{bedrijf}", contact.bedrijf);
    results.push(
      await sendEmail({
        to: email,
        subject,
        text: emailBody(contact),
        config,
      }),
    );
  }

  if (kanalen.includes("whatsapp") && phone && config.whatsappCloud?.enabled) {
    results.push(
      await sendWhatsAppCloud({
        toE164: phone,
        templateName: config.whatsappCloud.templateName,
        language: config.whatsappCloud.language,
        variables: [contact.bedrijf, contact.controleUrl || contact.url],
        config,
      }),
    );
  }

  const webhookUrl = process.env.OUTBOUND_WEBHOOK_URL;
  if (kanalen.includes("webhook") && config.webhook?.enabled !== false) {
    results.push(
      await sendWebhook(webhookUrl, {
        event: "outbound_attempt",
        live: isLive(),
        contact: {
          bedrijf: contact.bedrijf,
          url: contact.url,
          email,
          phone,
          controleUrl: contact.controleUrl,
          rapportUrl: contact.rapportUrl,
          bericht,
          whatsappUrl: phone ? `https://wa.me/${phone}?text=${encodeURIComponent(bericht)}` : null,
        },
        results,
      }),
    );
  }

  const sent = results.some((r) => r.ok && !r.skipped && !r.simulated);
  const simulated = results.some((r) => r.simulated);
  const ok = results.some((r) => r.ok);
  const status = sent ? "sent" : simulated ? "simulated" : ok ? "partial" : "failed";

  return { host, status, results, email, phone };
}

async function main() {
  const configPath = join(ROOT, "data/outbound-config.json");
  const config = load(configPath, { enabled: false });
  if (!config.enabled) {
    console.log("Outbound uit — zet enabled:true in data/outbound-config.json");
    process.exit(0);
  }

  if (process.env.SKIP_VERKOOP_PIPELINE !== "1") {
    spawnSync("node", ["scripts/verkoop-bewijs-agent/run.mjs", "--from-outreach"], {
      cwd: ROOT,
      stdio: "inherit",
      timeout: 900_000,
    });
    spawnSync("node", ["scripts/outreach-agent/run.mjs"], {
      cwd: ROOT,
      stdio: "inherit",
      env: { ...process.env, SKIP_VERKOOP_BEWIJS: "1" },
      timeout: 300_000,
    });
  }

  const contacts = pickContacts(config);
  const log = load(join(ROOT, "data/outbound-log.json"), { entries: [] });
  const runAt = new Date().toISOString();
  const processed = [];
  let sentCount = 0;

  for (const c of contacts) {
    const out = await deliver(c, config);
    log.entries.push({
      at: runAt,
      bedrijf: c.bedrijf,
      url: c.url,
      host: out.host,
      email: out.email,
      phone: out.phone,
      status: out.status,
      live: isLive(),
      results: out.results,
    });
    processed.push({ bedrijf: c.bedrijf, ...out });
    if (out.status === "sent") sentCount += 1;
  }

  saveJson(join(ROOT, "data/outbound-log.json"), log);
  copyFileSync(join(ROOT, "data/outbound-log.json"), join(ROOT, "public/outbound-log.json"));

  if (sentCount > 0) bumpKpi(sentCount);
  else if (processed.some((p) => p.status === "simulated")) {
    /* dry-run telt niet als KPI-contact */
  }

  const status = {
    updatedAt: runAt,
    agent: "outbound-auto",
    live: isLive(),
    gepland: contacts.length,
    verwerkt: processed.length,
    verzonden: sentCount,
    gesimuleerd: processed.filter((p) => p.status === "simulated").length,
    mislukt: processed.filter((p) => p.status === "failed").length,
    items: processed.map((p) => ({
      bedrijf: p.bedrijf,
      status: p.status,
      email: p.email,
      phone: p.phone,
    })),
    agentPrompt: isLive()
      ? `Outbound LIVE: ${sentCount} verzonden · ${processed.length} verwerkt`
      : `Outbound dry-run: ${processed.length} klaar — zet OUTBOUND_LIVE=1 + RESEND_API_KEY`,
    grokPrompt: isLive()
      ? `outbound-auto: ${sentCount} mails/contacten — check reacties in monitor`
      : "outbound-auto dry-run — GitHub Secrets: RESEND_API_KEY, OUTBOUND_LIVE=1",
  };

  saveJson(join(ROOT, "data/outbound-status.json"), status);
  copyFileSync(join(ROOT, "data/outbound-status.json"), join(ROOT, "public/outbound-status.json"));

  patchAgent("outbound-auto", {
    ok: processed.length > 0 || contacts.length === 0,
    live: isLive(),
    verzonden: sentCount,
    agentPrompt: status.agentPrompt,
    grokPrompt: status.grokPrompt,
  });

  const topic = config.ntfy?.topic || process.env.VAKSCAN_NTFY_TOPIC || "webklaar-mike";
  if (config.ntfy?.digest !== false && processed.length) {
    const actions = processed
      .filter((p) => p.phone)
      .slice(0, 3)
      .map((p, i) => ({
        action: "view",
        label: `WA ${i + 1}`,
        url: `https://wa.me/${p.phone}?text=${encodeURIComponent(p.bericht || "")}`,
      }));
    await ntfyDigest(
      topic,
      isLive() ? `Outbound: ${sentCount} live` : `Outbound dry-run: ${processed.length}`,
      processed.map((p, i) => `${i + 1}. ${p.bedrijf} — ${p.status} (${p.email || p.phone || "geen contact"})`),
      actions,
    );
  }

  spawnSync("node", [join(ROOT, "scripts/verkoop-effectiviteit/run.mjs")], { cwd: ROOT, stdio: "inherit" });

  console.log(JSON.stringify(status, null, 2));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}