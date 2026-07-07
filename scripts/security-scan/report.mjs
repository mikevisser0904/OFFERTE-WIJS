import { SEVERITY_WEIGHT, NIVEAU_FROM_SCORE } from "./types.mjs";

export function computeScore(findings) {
  let score = 0;
  for (const f of findings) {
    score += SEVERITY_WEIGHT[f.severity] ?? 5;
  }
  return Math.min(100, score);
}

export function niveauForScore(score) {
  for (const row of NIVEAU_FROM_SCORE) {
    if (score < row.max) return row;
  }
  return NIVEAU_FROM_SCORE[NIVEAU_FROM_SCORE.length - 1];
}

export function klantBulletsFromFindings(findings) {
  const order = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
  const sorted = [...findings].sort((a, b) => order[a.severity] - order[b.severity]);
  const bullets = [];
  for (const f of sorted) {
    if (bullets.length >= 5) break;
    bullets.push(f.klant);
  }
  if (bullets.length === 0) {
    bullets.push(
      "Geen grote problemen gevonden in deze passieve check — periodiek opnieuw scannen blijft verstandig."
    );
  }
  return bullets;
}

export function aanbevolenDienst(findings, score) {
  const hasDb = findings.some((f) => f.check === "database" || f.check === "datalek");
  const hasHttps = findings.some((f) => f.id === "no-https" || f.id === "no-http-redirect");
  const hasWp = findings.some((f) => f.id === "wordpress" || f.id === "wp-login-open");

  if (hasDb || score >= 60) {
    return { slug: "website-veilig", naam: "Website Veilig", prijs: "€299", prijsNum: 299 };
  }
  if (hasHttps && score >= 35) {
    return { slug: "website-veilig", naam: "Website Veilig", prijs: "€299", prijsNum: 299 };
  }
  if (hasWp) {
    return { slug: "onderhoud", naam: "Website Onderhoud", prijs: "€49/mnd", prijsNum: 49 };
  }
  if (score >= 35) {
    return { slug: "website-veilig", naam: "Website Veilig", prijs: "€299", prijsNum: 299 };
  }
  return { slug: "google-start", naam: "Google Start", prijs: "€299", prijsNum: 299 };
}

export function whatsappZin(report) {
  const naam = report.bedrijf || "uw bedrijf";
  const top = (report.klantBullets[0] || "een paar beveiligingspunten").replace(/\.\s*$/, "");
  return `Hoi! Mike van WebKlaar — ik heb even een gratis veiligheidscheck op de site van ${naam} gedaan. Belangrijkste punt: ${top}. Ik kan dit voor u oplossen met ons ${report.verkoop.dienst} (${report.verkoop.prijs}). Zin in een kort belletje?`;
}

const DISCLAIMER =
  "Deze scan is passief (publiek zichtbare pagina's en bekende misconfiguratie-paden). Geen inlog, geen poortscan. Alleen gebruiken met toestemming van de eigenaar of als onderdeel van een door u aangeboden gratis veiligheidscheck.";

export function buildReport({ id, url, bedrijf, plaats, findings, scannedAt }) {
  const risicoScore = computeScore(findings);
  const { niveau, label } = niveauForScore(risicoScore);
  const dienst = aanbevolenDienst(findings, risicoScore);
  const klantBullets = klantBulletsFromFindings(findings);

  const report = {
    id,
    url,
    bedrijf: bedrijf || "",
    plaats: plaats || "",
    scannedAt,
    risicoScore,
    niveau,
    niveauLabel: label,
    klantBullets,
    findings,
    verkoop: {
      dienst: dienst.naam,
      slug: dienst.slug,
      prijs: dienst.prijs,
      prijsNum: dienst.prijsNum,
      whatsapp: "",
    },
    disclaimer: DISCLAIMER,
  };
  report.verkoop.whatsapp = whatsappZin(report);
  return report;
}

export function reportToMarkdown(report) {
  const lines = [
    `# VakScan rapport — ${report.bedrijf || report.url}`,
    "",
    `**URL:** ${report.url}  `,
    report.plaats ? `**Plaats:** ${report.plaats}  ` : "",
    `**Datum:** ${report.scannedAt}  `,
    `**Risicoscore:** ${report.risicoScore}/100 — **${report.niveauLabel}**`,
    "",
    "## Voor de vakman (max. 5 punten)",
    "",
    ...report.klantBullets.map((b) => `- ${b}`),
    "",
    "## Intern — verkoop",
    "",
    `- Aanbevolen: **${report.verkoop.dienst}** (${report.verkoop.prijs})`,
    `- WhatsApp: ${report.verkoop.whatsapp}`,
    "",
    "## Technische bevindingen",
    "",
  ];
  for (const f of report.findings) {
    lines.push(`### ${f.title} (${f.severity})`);
    lines.push(`- ${f.intern}`);
    if (f.evidence) lines.push(`- Bewijs: \`${f.evidence}\``);
    lines.push("");
  }
  lines.push("---", "", `*${report.disclaimer}*`, "");
  return lines.join("\n");
}