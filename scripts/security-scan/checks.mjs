import { fetchSafe, normalizeTargetUrl, originOf, probePath } from "./fetch-util.mjs";
import { runLeakProbesForOrigin } from "./leak-probes.mjs";

export async function runAllChecks(targetInput, meta = {}) {
  const startUrl = normalizeTargetUrl(targetInput);
  const findings = [];

  const t0 = Date.now();
  let home;
  try {
    home = await fetchSafe(startUrl.href);
  } catch (e) {
    findings.push({
      id: "site-down",
      check: "bereikbaarheid",
      severity: "critical",
      title: "Website niet bereikbaar",
      klant: "Bezoekers zien een foutmelding of een lege pagina.",
      intern: "Site reageert niet — eerst hosting/DNS checken vóór verkoop fix.",
      evidence: String(e),
    });
    return { findings, ctx: { ms: Date.now() - t0, finalUrl: startUrl.href }, meta };
  }
  const ms = Date.now() - t0;
  if (!home.ok && home.status >= 400) {
    findings.push({
      id: "http-error",
      check: "bereikbaarheid",
      severity: "high",
      title: `Site geeft foutcode ${home.status}`,
      klant: "De website werkt niet goed voor bezoekers.",
      intern: `HTTP ${home.status} op ${home.url}`,
      evidence: `status=${home.status}`,
    });
  }
  if (ms > 4000) {
    findings.push({
      id: "slow",
      check: "bereikbaarheid",
      severity: "medium",
      title: "Website laadt traag",
      klant: "Bezoekers haken af als de site langzaam is — ook op mobiel.",
      intern: `${ms}ms eerste reactie — verkoop snellere site/hosting.`,
      evidence: `${ms}ms`,
    });
  }

  const finalOrigin = originOf(home.url);
  const isHttps = finalOrigin.startsWith("https://");

  if (!isHttps) {
    findings.push({
      id: "no-https",
      check: "https",
      severity: "critical",
      title: "Geen beveiligde verbinding (HTTPS)",
      klant: "Browsers tonen 'niet veilig' — klanten vertrouwen dat minder.",
      intern: "SSL + redirect — Website Veilig of nieuwe hosting.",
      evidence: home.url,
    });
  }

  const httpOrigin = finalOrigin.replace(/^https:/, "http:");
  if (httpOrigin !== finalOrigin) {
    try {
      const httpProbe = await fetchSafe(httpOrigin + "/");
      const landedHttps = httpProbe.url.startsWith("https://");
      if (!landedHttps) {
        findings.push({
          id: "no-http-redirect",
          check: "https",
          severity: "high",
          title: "Geen automatische doorverwijzing naar HTTPS",
          klant: "Bezoekers kunnen per ongeluk op een onveilige verbinding blijven.",
          intern: "301 redirect http→https — €299 hardening.",
          evidence: `http blijft op ${httpProbe.url}`,
        });
      }
    } catch {
      /* ok */
    }
  }

  const h = home.headers;
  const headerChecks = [
    { key: "strict-transport-security", id: "hsts", severity: "medium", title: "HSTS ontbreekt", klant: "Extra bescherming tegen verkeerde http-verbindingen ontbreekt." },
    { key: "x-frame-options", alt: "content-security-policy", id: "clickjack", severity: "medium", title: "Bescherming tegen clickjacking ontbreekt", klant: "Uw site kan makkelijker misbruikt worden in nep-vensters." },
    { key: "x-content-type-options", id: "mime", severity: "low", title: "MIME-sniffing niet uitgeschakeld", klant: "Kleine technische opening voor misbruik." },
    { key: "content-security-policy", id: "csp", severity: "low", title: "Geen Content-Security-Policy", klant: "Minder bescherming bij kwaadaardige scripts op de site." },
  ];
  for (const hc of headerChecks) {
    const present = h[hc.key] || (hc.alt && h[hc.alt]);
    if (!present) {
      findings.push({ id: hc.id, check: "headers", severity: hc.severity, title: hc.title, klant: hc.klant, intern: `Header ${hc.key} ontbreekt.`, evidence: "ontbreekt" });
    }
  }

  const bodyLower = (home.body || "").toLowerCase();
  const powered = (h["x-powered-by"] || "").toLowerCase();
  const isWp =
    bodyLower.includes("/wp-content/") ||
    bodyLower.includes("wp-includes") ||
    powered.includes("wordpress") ||
    bodyLower.includes('name="generator" content="wordpress');

  if (isWp) {
    findings.push({
      id: "wordpress",
      check: "cms",
      severity: "medium",
      title: "WordPress herkend",
      klant: "WordPress moet regelmatig bijgewerkt worden — anders is hacken makkelijk.",
      intern: "Upsell onderhoud of nieuwe statische site.",
      evidence: "wp-content/wp-includes",
    });
    const login = await probePath(finalOrigin, "/wp-login.php");
    if (login.status === 200 && (login.body || "").toLowerCase().includes("wp-login")) {
      findings.push({
        id: "wp-login-open",
        check: "cms",
        severity: "high",
        title: "WordPress-inlogpagina openbaar",
        klant: "Iedereen kan uw inlogpagina vinden en inlogpogingen doen.",
        intern: "Login verbergen/limiteren + updates.",
        evidence: login.url,
      });
    }
  }

  const server = h.server || "";
  const xPowered = h["x-powered-by"] || "";
  if (server && /\d+\.\d+/.test(server)) {
    findings.push({ id: "server-version", check: "headers", severity: "low", title: "Serverversie zichtbaar", klant: "Hackers zien welke software u draait.", intern: `Server: ${server}`, evidence: server });
  }
  if (xPowered && !isWp) {
    findings.push({ id: "x-powered-by", check: "headers", severity: "low", title: "Technologie-lek in headers", klant: "Welke software u gebruikt is zichtbaar.", intern: xPowered, evidence: xPowered });
  }

  const setCookie = h["set-cookie"] || "";
  if (setCookie) {
    const parts = setCookie.toLowerCase();
    if (!parts.includes("secure") && isHttps) {
      findings.push({ id: "cookie-no-secure", check: "cookies", severity: "medium", title: "Cookies zonder Secure", klant: "Sessies kunnen makkelijker onderschept worden.", intern: "Cookie-flags fixen.", evidence: "Secure ontbreekt" });
    }
    if (!parts.includes("httponly")) {
      findings.push({ id: "cookie-no-httponly", check: "cookies", severity: "medium", title: "Cookies zonder HttpOnly", klant: "Inloggegevens kunnen sneller gestolen worden bij een hack.", intern: "HttpOnly toevoegen.", evidence: "HttpOnly ontbreekt" });
    }
  }

  findings.push(...(await runLeakProbesForOrigin(finalOrigin)));

  const dedup = new Map();
  for (const f of findings) {
    const key = `${f.id}:${f.evidence || ""}`;
    if (!dedup.has(key)) dedup.set(key, f);
  }

  return { findings: [...dedup.values()], ctx: { ms, finalUrl: home.url, isHttps }, meta };
}
