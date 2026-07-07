#!/usr/bin/env node
/**
 * Persoonlijke verkoopberichten met echte scan-feiten (naam + concrete lekken).
 * Alleen wat in VakScan-rapport staat — geen verzonnen data.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, copyFileSync, mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const root = process.cwd();

function normUrl(u) {
  try {
    const x = new URL(u.startsWith("http") ? u : `https://${u}`);
    const host = x.hostname.replace(/^www\./i, "").toLowerCase();
    const path = x.pathname.replace(/\/$/, "") || "";
    return `${host}${path}`;
  } catch {
    return String(u).toLowerCase();
  }
}

function hostOnly(u) {
  try {
    return new URL(u.startsWith("http") ? u : `https://${u}`).hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return "";
  }
}

function kortBewijs(evidence) {
  if (!evidence) return "";
  try {
    const x = new URL(evidence);
    const path = x.pathname + x.search;
    if (path && path !== "/") return path;
    return x.hostname;
  } catch {
    return evidence.length > 60 ? `${evidence.slice(0, 57)}…` : evidence;
  }
}

function uniekeFindings(findings) {
  const seen = new Set();
  const out = [];
  for (const f of findings || []) {
    const key = `${f.title}:${f.evidence || ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(f);
  }
  return out;
}

function laadRapporten() {
  const dir = join(root, "data/reports");
  const byHost = new Map();
  const byNorm = new Map();
  if (!existsSync(dir)) return { byHost, byNorm };
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".json")) continue;
    try {
      const r = JSON.parse(readFileSync(join(dir, f), "utf8"));
      if (!r.url) continue;
      byNorm.set(normUrl(r.url), r);
      byHost.set(hostOnly(r.url), r);
    } catch {
      /* skip */
    }
  }
  return { byHost, byNorm };
}

function vindRapport(klant, maps) {
  const n = normUrl(klant.url);
  if (maps.byNorm.has(n)) return maps.byNorm.get(n);
  const h = hostOnly(klant.url);
  if (maps.byHost.has(h)) return maps.byHost.get(h);
  for (const [key, r] of maps.byNorm) {
    if (key.startsWith(h)) return r;
  }
  const lh = join(root, "data/leak-hits.json");
  if (existsSync(lh)) {
    const hits = JSON.parse(readFileSync(lh, "utf8")).hits || [];
    for (const hit of hits) {
      if (hostOnly(hit.url) === h || normUrl(hit.url) === n) {
        return {
          url: klant.url,
          bedrijf: klant.bedrijf,
          risicoScore: hit.risicoScore,
          findings: hit.findings || [],
          klantBullets: (hit.findings || []).map((x) => x.klant).slice(0, 3),
        };
      }
    }
  }
  return null;
}

function schrikRegels(rapport, klant) {
  const regels = [];
  const findings = uniekeFindings(rapport?.findings).slice(0, 4);

  for (const f of findings) {
    const bewijs = kortBewijs(f.evidence);
    if (f.check === "database" || f.check === "datalek") {
      regels.push(
        bewijs
          ? `${f.title.replace(" mogelijk open op internet", "")} — publiek bereikbaar via ${bewijs}`
          : f.klant
      );
    } else if (f.id === "no-https" || f.id === "no-http-redirect") {
      regels.push("Uw site werkt nog zonder beveiligde verbinding (HTTPS) — browsers tonen 'niet veilig'.");
    } else {
      regels.push(f.klant || f.title);
    }
  }

  if (regels.length === 0 && klant.probleem) {
    regels.push(klant.probleem);
  }
  if (regels.length === 0) {
    regels.push("Uw website voldoet niet aan basisveiligheid die klanten en Google verwachten.");
  }
  return regels.slice(0, 3);
}

function bouwBericht(klant, regels, rapport) {
  const naam = klant.bedrijf || "uw bedrijf";
  const score = rapport?.risicoScore ?? klant.score ?? "?";
  const bullets = regels.map((r) => `• ${r}`).join("\n");

  const intro = `Hoi, Mike van WebKlaar — ik richt me op vakbedrijven zoals ${naam}.`;

  const schrik = `Ik heb uw website (${klant.url.replace(/^https?:\/\//, "")}) zojuist gecontroleerd. Dit staat nu letterlijk online:

${bullets}

Risicoscore: ${score}/100. Dit is precies wat cybercriminelen automatisch zoeken — niet "theorie", maar vindbaar via internet.`;

  const close = `Wij dichten dit in 2 werkdagen met Website Veilig (€299, vaste prijs). Geen verkooppraat: ik laat u in 10 minuten zien wat er openstaat. Zin om vandaag of morgen te bellen?`;

  return `${intro}\n\n${schrik}\n\n${close}`;
}

function bouwSmsKort(klant, regels) {
  const top = regels[0] || "beveiligingsprobleem op uw site";
  return `Hoi, Mike (WebKlaar). Check op ${klant.bedrijf}: ${top} — kunnen we dit in 2 dagen fixen (€299)? Bellen?`;
}

function main() {
  const inPath = join(root, "data/echte-klanten.json");
  if (!existsSync(inPath)) {
    console.error("Eerst: npm run lead:contact");
    process.exit(1);
  }
  const store = JSON.parse(readFileSync(inPath, "utf8"));
  const maps = laadRapporten();

  const klanten = (store.klanten || []).map((k) => {
    const rapport = vindRapport(k, maps);
    const regels = schrikRegels(rapport, k);
    const verkoopBericht = bouwBericht(k, regels, rapport);
    const verkoopKort = bouwSmsKort(k, regels);
    const wa = k.telefoonWa || (k.telefoon ? normalizeWa(k.telefoon) : null);
    const whatsappSchrik = wa ? `https://wa.me/${wa}?text=${encodeURIComponent(verkoopKort)}` : null;

    return {
      ...k,
      heeftScan: !!rapport,
      risicoScore: rapport?.risicoScore ?? k.score,
      schrikRegels: regels,
      verkoopBericht,
      verkoopKort,
      whatsappSchrik,
      reportId: rapport?.id ?? null,
    };
  });

  klanten.sort((a, b) => {
    const sa = Number(a.risicoScore) || 0;
    const sb = Number(b.risicoScore) || 0;
    if (sb !== sa) return sb - sa;
    return (b.heeftScan ? 1 : 0) - (a.heeftScan ? 1 : 0);
  });

  const metScan = klanten.filter((k) => k.heeftScan && k.schrikRegels.length > 0).length;

  const out = {
    ...store,
    generatedAt: new Date().toISOString(),
    metPersoonlijkBericht: klanten.length,
    metScanFeiten: metScan,
    disclaimer:
      "Alleen feiten uit VakScan. Gebruik met gratis-check-aanbod. Geen dreigementen — wel concrete waarheid.",
    klanten,
  };

  mkdirSync(join(root, "data"), { recursive: true });
  writeFileSync(inPath, JSON.stringify(out, null, 2));
  copyFileSync(inPath, join(root, "public/echte-klanten.json"));

  const exportTxt = klanten
    .filter((k) => k.heeftScan)
    .slice(0, 50)
    .map(
      (k) =>
        `=== ${k.bedrijf} | ${k.telefoon || k.email} ===\n${k.verkoopBericht}\n`
    )
    .join("\n---\n\n");
  writeFileSync(join(root, "data/verkoop-berichten.txt"), exportTxt);
  copyFileSync(join(root, "data/verkoop-berichten.txt"), join(root, "public/verkoop-berichten.txt"));

  console.log(`Persoonlijke berichten: ${klanten.length} klanten, ${metScan} met scan-feiten`);
  console.log(`Tekstbestand: data/verkoop-berichten.txt`);
}

function normalizeWa(display) {
  const d = String(display).replace(/\D/g, "");
  if (d.startsWith("0")) return `31${d.slice(1)}`;
  if (d.startsWith("31")) return d;
  return `31${d}`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}