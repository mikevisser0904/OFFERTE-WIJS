/**
 * Publiek bewijs: wat zichtbaar is op admin-URL zonder inloggen.
 * GEEN login, GEEN POST, GEEN wachtwoord — alleen GET.
 */

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
    if (!res.ok) return { url: evidenceUrl, ok: false, status: res.status };
    const buf = await res.arrayBuffer();
    html = new TextDecoder("utf8", { fatal: false }).decode(buf.slice(0, 100_000));
  } catch (e) {
    return { url: evidenceUrl, ok: false, error: String(e) };
  }

  return parseAdminHtml(html, evidenceUrl);
}

export function parseAdminHtml(html, url) {
  const l = html.toLowerCase();
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : "";

  if (l.includes("pma_username") || l.includes("phpmyadmin") || /phpmyadmin/i.test(title)) {
    return {
      url,
      ok: true,
      adminType: "phpMyAdmin",
      titel: title || "phpMyAdmin",
      zichtbaar:
        "Het MySQL/phpMyAdmin-inlogscherm staat open op internet — velden voor gebruikersnaam en wachtwoord, zonder VPN of beveiligde tunnel.",
      impact:
        "Vanaf dit scherm proberen bots automatisch wachtwoorden. Bij een zwak of hergebruikt wachtwoord is uw volledige database (klanten, offertes, mail) te exportieren.",
      magClaimen:
        "De admin-voordeur van uw database is publiek bereikbaar — wij hebben niet ingelogd, maar iedereen kan dit scherm openen.",
    };
  }

  if (l.includes("adminer") || /adminer/i.test(title)) {
    return {
      url,
      ok: true,
      adminType: "Adminer",
      titel: title || "Adminer",
      zichtbaar: "Database-beheer (Adminer) is via de browser bereikbaar — inlogformulier voor de database.",
      impact: "Zelfde risico als phpMyAdmin: brute-force en data-export als inloggegevens lekken.",
      magClaimen: "Uw database-beheerpanel is vindbaar op internet zonder extra beveiliging.",
    };
  }

  if (l.includes("mongo express") || l.includes("mongo-express")) {
    return {
      url,
      ok: true,
      adminType: "Mongo Express",
      titel: title || "Mongo Express",
      zichtbaar: "MongoDB-beheerinterface is via HTTP bereikbaar.",
      impact: "Bedrijfsdata in MongoDB kan via dit panel benaderd worden na inlog of misconfiguratie.",
      magClaimen: "Mongo-beheer staat bloot op internet.",
    };
  }

  if (l.includes("cluster_name") && l.includes("elasticsearch")) {
    return {
      url,
      ok: true,
      adminType: "Elasticsearch",
      titel: "Elasticsearch API",
      zichtbaar: "Elasticsearch-cluster reageert publiek zonder authenticatie.",
      impact: "Indexen met bedrijfsdata kunnen uitgelezen of gewist worden.",
      magClaimen: "Uw zoek-/datalaag is open voor het internet.",
    };
  }

  if (/db_password|mysql|database_password/i.test(html) && html.length < 50_000) {
    return {
      url,
      ok: true,
      adminType: "Config-lek",
      titel: title || "Configuratiebestand",
      zichtbaar: "Bestand met database-gegevens of wachtwoorden is downloadbaar.",
      impact: "Met deze gegevens kan iemand direct op uw database inloggen — geen gokwerk meer.",
      magClaimen: "Database-wachtwoorden liggen op internet.",
    };
  }

  return {
    url,
    ok: true,
    adminType: "Onbekend paneel",
    titel: title || "Beheer-URL",
    zichtbaar: "Een beheer- of technische pagina reageert publiek op dit adres.",
    impact: "Hoort niet vindbaar te zijn voor zoekmachines en scanners.",
    magClaimen: "Technisch beheerpaneel is publiek bereikbaar.",
  };
}