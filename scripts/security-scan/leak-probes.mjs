import { fetchSafe, originOf, probePath } from "./fetch-util.mjs";
import { panelProbeToFinding } from "./admin-panel-detect.mjs";

/** Bekende paden — alleen GET, geen poortscan. */
export const ADMIN_PANELS = [
  { path: "/phpmyadmin/", label: "phpMyAdmin" },
  { path: "/phpMyAdmin/", label: "phpMyAdmin" },
  { path: "/phpmyadmin2/", label: "phpMyAdmin" },
  { path: "/pma/", label: "phpMyAdmin" },
  { path: "/PMA/", label: "phpMyAdmin" },
  { path: "/db/", label: "Database beheer" },
  { path: "/mysql/", label: "MySQL beheer" },
  { path: "/mysqladmin/", label: "MySQL admin" },
  { path: "/adminer.php", label: "Adminer" },
  { path: "/adminer/", label: "Adminer" },
  { path: "/sql/", label: "SQL beheer" },
  { path: "/phpmyadmin/index.php", label: "phpMyAdmin" },
];

export const API_PROBES = [
  {
    path: "/_cluster/health",
    id: "elastic-open",
    title: "Elasticsearch mogelijk zonder beveiliging",
    test: (b, status) => status === 200 && b.includes("cluster_name"),
  },
  {
    path: "/_cat/indices?v",
    id: "elastic-indices",
    title: "Elasticsearch-indexen mogelijk zichtbaar",
    test: (b, status) => status === 200 && (b.includes("health") || b.includes("index")),
  },
  {
    path: "/mongo-express/",
    id: "mongo-express",
    title: "Mongo Express mogelijk open",
    test: (b, status) => status === 200 && b.toLowerCase().includes("mongo"),
  },
  {
    path: "/redis/",
    id: "redis-ui",
    title: "Redis-beheer mogelijk open",
    test: (b, status) =>
      status === 200 && /redis/i.test(b) && (b.includes("key") || b.includes("database")) && b.length < 20000,
  },
];

export const FILE_LEAKS = [
  { path: "/.env", id: "env-exposed", title: ".env mogelijk downloadbaar", match: (b) => /DB_|DATABASE_|PASSWORD|SECRET|MYSQL_/i.test(b) },
  { path: "/.env.local", id: "env-local", title: ".env.local mogelijk downloadbaar", match: (b) => /DB_|PASSWORD/i.test(b) },
  { path: "/.env.production", id: "env-prod", title: ".env.production mogelijk downloadbaar", match: (b) => /DB_|PASSWORD/i.test(b) },
  { path: "/.git/HEAD", id: "git-exposed", title: "Git-repository mogelijk openbaar", match: (b) => b.startsWith("ref:") },
  { path: "/backup.sql", id: "sql-backup", title: "SQL-backup mogelijk openbaar", match: (b) => /CREATE TABLE|INSERT INTO/i.test(b) },
  { path: "/db.sql", id: "sql-backup-2", title: "db.sql mogelijk openbaar", match: (b) => /CREATE TABLE|INSERT INTO/i.test(b) },
  { path: "/dump.sql", id: "sql-dump", title: "dump.sql mogelijk openbaar", match: (b) => /CREATE TABLE|INSERT INTO/i.test(b) },
  { path: "/database.sql", id: "sql-database", title: "database.sql mogelijk openbaar", match: (b) => /CREATE TABLE|INSERT INTO/i.test(b) },
  { path: "/data.sql", id: "sql-data", title: "data.sql mogelijk openbaar", match: (b) => /INSERT INTO/i.test(b) },
  { path: "/wp-config.php.bak", id: "wp-config-bak", title: "WordPress-config backup mogelijk open", match: (b) => /DB_NAME|DB_PASSWORD/i.test(b) },
  { path: "/config.php.bak", id: "config-bak", title: "Config-backup mogelijk open", match: (b) => /password|database/i.test(b) },
];

const PROBE_OPTS = { timeoutMs: 10000, maxBytes: 64_000 };

function panelFinding(panel, pr) {
  return panelProbeToFinding(panel, pr);
}

export async function resolveOrigin(targetUrl) {
  const start = targetUrl.href || targetUrl;
  try {
    const home = await fetchSafe(start, { timeoutMs: 9000, maxBytes: 4096 });
    return { origin: originOf(home.url), finalUrl: home.url, error: null };
  } catch (e) {
    try {
      const u = new URL(start);
      return { origin: originOf(u), finalUrl: start, error: String(e) };
    } catch {
      return { origin: null, finalUrl: start, error: String(e) };
    }
  }
}

async function mapPool(items, concurrency, fn) {
  const out = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return out;
}

/**
 * Lek-probes op één host — beperkte paralleliteit (sneller, zelfde passieve regels).
 */
export async function runLeakProbesForOrigin(origin) {
  const findings = [];
  const CONC = 5;

  const panelResults = await mapPool(ADMIN_PANELS, CONC, async (panel) => {
    const pr = await probePath(origin, panel.path, PROBE_OPTS);
    return panelFinding(panel, pr);
  });
  for (const f of panelResults) if (f) findings.push(f);

  const apiResults = await mapPool(API_PROBES, CONC, async (api) => {
    const pr = await probePath(origin, api.path, PROBE_OPTS);
    if (!api.test(pr.body || "", pr.status)) return null;
    return {
      id: api.id,
      check: "database",
      severity: "critical",
      title: api.title,
      klant: "Bedrijfsdata kan via internet benaderbaar zijn.",
      intern: "Passieve HTTP-check — geen poortscan.",
      evidence: pr.url,
    };
  });
  for (const f of apiResults) if (f) findings.push(f);

  const fileResults = await mapPool(FILE_LEAKS, CONC, async (lp) => {
    const pr = await probePath(origin, lp.path, PROBE_OPTS);
    if (pr.status !== 200 || !lp.match(pr.body || "")) return null;
    return {
      id: lp.id,
      check: "datalek",
      severity: "critical",
      title: lp.title,
      klant: "Gevoelige gegevens (o.a. database-wachtwoorden) kunnen op internet liggen.",
      intern: "Direct escaleren — Website Veilig.",
      evidence: pr.url,
    };
  });
  for (const f of fileResults) if (f) findings.push(f);

  const dedup = new Map();
  for (const f of findings) {
    dedup.set(`${f.id}:${f.evidence || ""}`, f);
  }
  return [...dedup.values()];
}

export async function runLeakChecks(targetInput) {
  const raw = typeof targetInput === "string" ? targetInput : targetInput.href;
  let startUrl;
  try {
    const u = new URL(raw.includes("://") ? raw : `https://${raw}`);
    startUrl = u;
  } catch (e) {
    return {
      findings: [
        {
          id: "bad-url",
          check: "bereikbaarheid",
          severity: "info",
          title: "Ongeldige URL",
          klant: "",
          intern: String(e),
          evidence: raw,
        },
      ],
      ctx: { mode: "leaks" },
    };
  }

  const { origin, finalUrl, error } = await resolveOrigin(startUrl.href);
  if (!origin) {
    return {
      findings: [],
      ctx: { mode: "leaks", finalUrl, unreachable: true, error },
    };
  }

  const findings = await runLeakProbesForOrigin(origin);
  return { findings, ctx: { mode: "leaks", finalUrl, origin } };
}