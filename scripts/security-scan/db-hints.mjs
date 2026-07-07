import { probePath, originOf } from "./fetch-util.mjs";
import { isLeakFinding } from "./leak-hits.mjs";

const ENV_PATHS = ["/.env", "/.env.local", "/.env.production"];
const SQL_PATHS = ["/backup.sql", "/db.sql", "/dump.sql", "/database.sql", "/data.sql"];

function stripQuotes(v) {
  return String(v || "").replace(/^["']|["']$/g, "").trim();
}

/** Parse .env — nooit wachtwoorden teruggeven (alleen metadata voor verkoop/rapport). */
export function parseDatabaseFromEnv(text) {
  if (!text || text.length > 80_000) return null;
  const kv = {};
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const m = t.match(/^([A-Za-z0-9_]+)\s*=\s*(.*)$/);
    if (m) kv[m[1].toUpperCase()] = stripQuotes(m[2]);
  }

  let type = (kv.DB_CONNECTION || kv.DB_TYPE || "").toLowerCase();
  let host = kv.DB_HOST || kv.MYSQL_HOST || kv.DATABASE_HOST;
  let port = kv.DB_PORT || kv.MYSQL_PORT || "3306";
  let database = kv.DB_DATABASE || kv.DB_NAME || kv.MYSQL_DATABASE;
  let username = kv.DB_USERNAME || kv.DB_USER || kv.MYSQL_USER;

  const url = kv.DATABASE_URL || kv.MYSQL_URL;
  if (url && url.includes("://")) {
    try {
      const u = new URL(url.replace(/^mysql2:/, "mysql:").replace(/^postgres:/, "http:"));
      if (!type) type = url.split(":")[0].replace("mysql2", "mysql");
      if (!host) host = u.hostname;
      if (u.port) port = u.port;
      if (!database) database = u.pathname.replace(/^\//, "").split("?")[0];
      if (!username) username = u.username;
    } catch {
      /* ignore */
    }
  }

  if (!type && host) type = "mysql";
  if (!type && !host && !database) return null;

  return {
    type: type || "onbekend",
    host: host || null,
    port,
    database: database || null,
    username: username || null,
    wachtwoordAanwezig: !!(kv.DB_PASSWORD || kv.MYSQL_PASSWORD || (url && url.includes("@"))),
    bron: "env-bestand",
  };
}

export function parseSqlDumpMeta(text) {
  if (!text || text.length > 500_000) return { tableCount: 0, tables: [], grootteBytes: text?.length ?? 0 };
  const tables = [];
  const re = /CREATE\s+TABLE\s+[`'"]?(\w+)[`'"]?/gi;
  let m;
  while ((m = re.exec(text)) && tables.length < 40) {
    if (!tables.includes(m[1])) tables.push(m[1]);
  }
  const inserts = (text.match(/INSERT\s+INTO/gi) || []).length;
  return {
    tableCount: tables.length,
    tables,
    insertStatements: inserts,
    grootteBytes: text.length,
    bron: "sql-dump",
  };
}

function panelMeta(finding) {
  const url = finding.evidence || "";
  let panel = "database-beheer";
  if (/phpmyadmin/i.test(finding.title || url)) panel = "phpMyAdmin";
  else if (/adminer/i.test(finding.title || url)) panel = "Adminer";
  else if (/elastic/i.test(finding.title || "")) panel = "Elasticsearch";
  else if (/mongo/i.test(finding.title || "")) panel = "MongoDB";
  else if (/redis/i.test(finding.title || "")) panel = "Redis";

  let host = null;
  try {
    host = new URL(url).host;
  } catch {
    /* */
  }
  return { panel, url, host };
}

/**
 * @param {import('./leak-hits.mjs').hasLeakFindings extends Function ? any[] : any[]} findings
 * @param {{ origin?: string | null, finalUrl?: string }} ctx
 */
export async function buildDatabaseProfile(findings, ctx) {
  const leakFindings = (findings || []).filter(isLeakFinding);
  const profile = {
    samenvatting: "Geen database blootstelling gevonden (passieve check).",
    heeftLek: leakFindings.length > 0,
    panels: [],
    credentials: null,
    sqlDump: null,
    apiExposure: [],
  };

  if (!leakFindings.length) return profile;

  profile.samenvatting = `${leakFindings.length} bevinding(en) — database of gegevens mogelijk bereikbaar via web.`;

  for (const f of leakFindings) {
    if (f.check === "database") {
      profile.panels.push(panelMeta(f));
      if (f.id?.startsWith("elastic")) profile.apiExposure.push({ type: "Elasticsearch", url: f.evidence });
      if (f.id?.includes("mongo")) profile.apiExposure.push({ type: "Mongo Express", url: f.evidence });
      if (f.id?.includes("redis")) profile.apiExposure.push({ type: "Redis UI", url: f.evidence });
    }
  }

  const origin = ctx?.origin || (ctx?.finalUrl ? originOf(ctx.finalUrl) : null);
  if (!origin) return profile;

  for (const path of ENV_PATHS) {
    const hasEnvFinding = leakFindings.some((f) => f.evidence?.includes(path) || f.id?.startsWith("env"));
    if (!hasEnvFinding) continue;
    const pr = await probePath(origin, path, { timeoutMs: 8000, maxBytes: 48_000 });
    if (pr.status === 200) {
      const cred = parseDatabaseFromEnv(pr.body || "");
      if (cred) {
        profile.credentials = cred;
        break;
      }
    }
  }

  for (const path of SQL_PATHS) {
    const hit = leakFindings.find((f) => f.evidence?.includes(path) || f.id?.includes("sql"));
    if (!hit) continue;
    const pr = await probePath(origin, path, { timeoutMs: 12000, maxBytes: 200_000 });
    if (pr.status === 200 && /CREATE TABLE|INSERT INTO/i.test(pr.body || "")) {
      profile.sqlDump = parseSqlDumpMeta(pr.body || "");
      profile.sqlDump.url = pr.url;
      break;
    }
  }

  if (profile.credentials?.host && profile.panels.length) {
    profile.samenvatting = `Database ${profile.credentials.type} (${profile.credentials.database || "?"}) + open beheerpanelen.`;
  } else if (profile.credentials) {
    profile.samenvatting = `Database-credentials in .env (${profile.credentials.type}, host ${profile.credentials.host || "?" }).`;
  } else if (profile.sqlDump?.tableCount) {
    profile.samenvatting = `SQL-dump met ${profile.sqlDump.tableCount} tabellen mogelijk downloadbaar.`;
  }

  return profile;
}