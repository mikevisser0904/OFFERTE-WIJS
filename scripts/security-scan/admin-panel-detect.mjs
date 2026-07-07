/**
 * Strikte detectie admin-panelen — minder WordPress-404 false positives (echte klanten).
 */

export function extractTitle(html) {
  const m = (html || "").match(/<title[^>]*>([^<]+)<\/title>/i);
  return m ? m[1].trim() : "";
}

/** WordPress/elementor 404 die "phpmyadmin" in menu/footer kan bevatten. */
export function isSiteNoisePage(html, status) {
  const l = (html || "").toLowerCase();
  const title = extractTitle(html).toLowerCase();
  const looks404Title = /pagina niet gevonden|page not found|404|niet gevonden|error 404/.test(title);
  const looksWp = l.includes("wp-content") || l.includes("wordpress") || l.includes("elementor");
  if (status === 404) return true;
  if (looks404Title && looksWp) return true;
  if (looks404Title && l.length > 12_000 && !l.includes("pma_username")) return true;
  return false;
}

/**
 * @returns {{ kind: string, confidence: 'high'|'medium', detail: string } | null}
 */
export function detectPhpMyAdmin(html) {
  const raw = html || "";
  const l = raw.toLowerCase();
  const title = extractTitle(raw);

  if (l.includes("pma_username") || /name=['\"]pma_username/i.test(raw)) {
    return { kind: "login", confidence: "high", detail: "phpMyAdmin loginform (pma_username)" };
  }
  if (l.includes("welcome to phpmyadmin")) {
    return { kind: "login", confidence: "high", detail: "Welcome to phpMyAdmin" };
  }
  if (/id=['\"]loginform['\"]/i.test(raw) && /phpmyadmin/i.test(l) && /password|pma_password/i.test(l)) {
    return { kind: "login", confidence: "high", detail: "phpMyAdmin loginform" };
  }
  if ((l.includes("navigation_panel") || l.includes("server_databases")) && !l.includes("pma_username")) {
    return { kind: "open_dashboard", confidence: "high", detail: "phpMyAdmin dashboard zonder inlog" };
  }

  return null;
}

export function detectAdminer(html) {
  const l = (html || "").toLowerCase();
  if (!l.includes("adminer")) return null;
  if (l.includes("name=\"password\"") || (l.includes("password") && l.includes("database"))) {
    return { kind: "login", confidence: "high", detail: "Adminer login" };
  }
  return null;
}

/**
 * Bepaal of een HTTP-probe een verkoopbaar database-lek is.
 * @param {{ status: number, body?: string, url: string }} pr
 * @param {{ path: string, label: string }} panel
 */
export function panelProbeToFinding(panel, pr) {
  const body = pr.body || "";
  const status = pr.status;

  if (isSiteNoisePage(body, status)) return null;
  if (status !== 200 || body.length < 80) return null;

  let det = null;
  let label = panel.label;

  if (/phpmyadmin|mysql admin|database beheer|sql beheer|mysql beheer/i.test(panel.label)) {
    det = detectPhpMyAdmin(body);
    label = "phpMyAdmin";
  } else if (/adminer/i.test(panel.label)) {
    det = detectAdminer(body);
    label = "Adminer";
  }

  if (!det || det.confidence !== "high") return null;

  const title =
    det.kind === "open_dashboard"
      ? `${label} mogelijk zonder inlog bereikbaar`
      : `${label} inlog open op internet`;

  const klant =
    det.kind === "open_dashboard"
      ? "Database-beheer is direct zichtbaar — ernstige misconfiguratie."
      : "Database-beheer is vindbaar — data kan gestolen worden na misbruik van inlog.";

  return {
    id: `db-admin-${panel.path.replace(/\//g, "_")}`,
    check: "database",
    severity: "critical",
    title,
    klant,
    intern: `VakScan verified: ${det.detail} (${det.confidence})`,
    evidence: pr.url,
    verified: true,
    panelConfidence: det.confidence,
    panelKind: det.kind,
  };
}

/** Zelfde regels op willekeurige HTML (verify-script). */
export function looksLikePhpMyAdminBody(body, status = 200) {
  if (isSiteNoisePage(body, status)) return false;
  return !!detectPhpMyAdmin(body);
}