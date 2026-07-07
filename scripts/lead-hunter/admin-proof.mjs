/**
 * Publiek bewijs: wat zichtbaar is op admin-URL zonder inloggen.
 * GEEN login, GEEN POST, GEEN wachtwoord — alleen GET.
 */
import {
  detectPhpMyAdmin,
  detectAdminer,
  isSiteNoisePage,
  extractTitle,
} from "../security-scan/admin-panel-detect.mjs";

export async function haalAdminBewijs(evidenceUrl) {
  if (!evidenceUrl || !/^https?:\/\//i.test(evidenceUrl)) return null;

  let html = "";
  try {
    const res = await fetch(evidenceUrl, {
      method: "GET",
      redirect: "follow",
      headers: { "User-Agent": "VakScan-Proof/1.0 (passief)", Accept: "text/html" },
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) {
      const buf = await res.arrayBuffer().catch(() => new ArrayBuffer(0));
      const errHtml = new TextDecoder("utf8", { fatal: false }).decode(buf.slice(0, 50_000));
      const parsed = parseAdminHtml(errHtml, evidenceUrl, res.status);
      if (!parsed.ok) return { url: evidenceUrl, ok: false, status: res.status, ...parsed };
      return { url: evidenceUrl, ok: false, status: res.status };
    }
    const buf = await res.arrayBuffer();
    html = new TextDecoder("utf8", { fatal: false }).decode(buf.slice(0, 100_000));
  } catch (e) {
    return { url: evidenceUrl, ok: false, error: String(e) };
  }

  const parsed = parseAdminHtml(html, evidenceUrl, 200);
  return { ...parsed, httpStatus: 200, gecontroleerdOp: new Date().toISOString() };
}

export function parseAdminHtml(html, url, httpStatus = 200) {
  const l = html.toLowerCase();
  const title = extractTitle(html);

  if (isSiteNoisePage(html, httpStatus)) {
    return {
      url,
      ok: false,
      adminType: "geen-panel",
      titel: title || "Site-pagina",
      reden: "Geen phpMyAdmin — waarschijnlijk WordPress/404 of gewone sitepagina.",
    };
  }

  const pma = detectPhpMyAdmin(html);
  if (pma) {
    const openDash = pma.kind === "open_dashboard";
    return {
      url,
      ok: true,
      httpStatus,
      adminType: "phpMyAdmin",
      titel: title || "phpMyAdmin",
      verified: true,
      panelKind: pma.kind,
      zichtbaar: openDash
        ? "phpMyAdmin-hoofdscherm is zonder inlog zichtbaar (afwijkend t.o.v. gebruikelijke hosting-instellingen)."
        : "phpMyAdmin-inlogpagina: velden voor gebruikersnaam en wachtwoord, bereikbaar via deze publieke URL.",
      impact:
        "Database-beheer is via het internet bereikbaar; gebruikelijk is toegang alleen via hostingpanel, VPN of IP-beperking.",
      magClaimen: openDash
        ? "Database-beheer reageert publiek; het hoofdscherm is zonder inlog zichtbaar."
        : "Database-beheer (phpMyAdmin) is via een publieke URL bereikbaar — wij hebben niet ingelogd.",
    };
  }

  const adminer = detectAdminer(html);
  if (adminer) {
    return {
      url,
      ok: true,
      httpStatus,
      adminType: "Adminer",
      titel: title || "Adminer",
      zichtbaar: "Adminer-inlogpagina voor database-beheer, bereikbaar via deze URL.",
      impact: "Database-beheer is via het internet bereikbaar; gebruikelijk is extra afscherming (hosting/VPN).",
      magClaimen: "Database-beheer (Adminer) is via een publieke URL bereikbaar.",
    };
  }

  if (l.includes("mongo express") || l.includes("mongo-express")) {
    return {
      url,
      ok: true,
      adminType: "Mongo Express",
      titel: title || "Mongo Express",
      zichtbaar: "Mongo Express-beheerinterface reageert op deze URL.",
      impact: "Beheerinterface is publiek bereikbaar; gebruikelijk is beperkte toegang tot beheerdersnetwerk.",
      magClaimen: "Mongo-beheer is via een publieke URL bereikbaar.",
    };
  }

  if (l.includes("cluster_name") && l.includes("elasticsearch")) {
    return {
      url,
      ok: true,
      adminType: "Elasticsearch",
      titel: "Elasticsearch API",
      zichtbaar: "Elasticsearch-API reageert op deze URL (geen inlogscherm op deze check).",
      impact: "Datalaag is vanaf internet bereikbaar; gebruikelijk is authenticatie en netwerkafscherming.",
      magClaimen: "Elasticsearch is via een publieke URL bereikbaar.",
    };
  }

  if (/db_password|mysql|database_password/i.test(html) && html.length < 50_000) {
    return {
      url,
      ok: true,
      adminType: "Config-lek",
      titel: title || "Configuratiebestand",
      zichtbaar: "Configuratiebestand met database-velden is via deze URL opvraagbaar.",
      impact: "Gevoelige configuratie hoort niet in de publieke webroot; roteren van credentials is gebruikelijk na blootstelling.",
      magClaimen: "Configuratie met database-gegevens is publiek opvraagbaar.",
    };
  }

  return {
    url,
    ok: true,
    adminType: "Onbekend paneel",
    titel: title || "Beheer-URL",
    zichtbaar: "Technische of beheerpagina reageert op deze URL.",
    impact: "Dit type pagina hoort doorgaans niet publiek op internet; beperkte toegang is gebruikelijk.",
    magClaimen: "Beheer-URL reageert publiek (type nog te bevestigen in gesprek).",
  };
}