"use client";

import { useCallback, useEffect, useState } from "react";

type DbExportRow = {
  bedrijf: string;
  plaats: string;
  url: string;
  heeftLek: boolean;
  dbType: string | null;
  dbHost: string | null;
  dbName: string | null;
  dbUser: string | null;
  wachtwoordLek: boolean;
  panelUrl: string | null;
  sqlTabellen: string[];
  sqlTabelCount: number;
  risicoScore: number;
  reportId: string | null;
};

type Rapport = {
  generatedAt: string;
  gescand: number;
  metLek: number;
  disclaimer: string;
  klanten: {
    bedrijf: string;
    url: string;
    heeftLek: boolean;
    database: { samenvatting: string };
    bevindingen: { titel: string; url: string }[];
    reportId?: string;
  }[];
};

type ExportPayload = {
  totaalMetLek: number;
  rijen: DbExportRow[];
};

function urls() {
  const base = typeof window !== "undefined" && window.location.pathname.startsWith("/OFFERTE-WIJS") ? "/OFFERTE-WIJS" : "";
  const o = typeof window !== "undefined" ? window.location.origin : "";
  return {
    rapport: `${o}${base}/klanten-lek-rapport.json`,
    export: `${o}${base}/klanten-database-export.json`,
  };
}

export function KlantenLekPanel() {
  const [rapport, setRapport] = useState<Rapport | null>(null);
  const [exp, setExp] = useState<ExportPayload | null>(null);

  const load = useCallback(async () => {
    const u = urls();
    const [r1, r2] = await Promise.all([
      fetch(u.rapport, { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
      fetch(u.export, { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
    ]);
    setRapport(r1);
    setExp(r2);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const lekken = rapport?.klanten?.filter((k) => k.heeftLek) || [];

  return (
    <section className="rounded-2xl border border-rose-400/30 bg-rose-500/5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-300">Klanten-lek agent</p>
          <h2 className="text-xl font-bold text-white">
            {rapport ? `${rapport.metLek} echte lek(ken) / ${rapport.gescand} gescand` : "Nog geen scan"}
          </h2>
          <p className="mt-1 text-sm text-white/50">
            Database-info: type, host, naam, user, panel-URL, SQL-tabellen —{" "}
            <strong className="text-white/70">geen wachtwoorden</strong> in het dashboard.
          </p>
        </div>
        <button type="button" onClick={load} className="text-sm text-rose-200 hover:underline">
          Vernieuwen
        </button>
      </div>

      <p className="mt-3 font-mono text-xs text-white/40">
        npm run agent:klanten-lek · KLANTEN_LEK_LIMIT=184 voor alle leads
      </p>

      {!rapport && (
        <p className="mt-4 text-sm text-white/45">Draai lokaal of wacht op workflow klanten-lek.yml (maandag 05:00 UTC).</p>
      )}

      {exp && exp.rijen.length > 0 && (
        <div className="mt-5 overflow-x-auto">
          <p className="mb-2 text-sm font-semibold text-rose-200">Database-export ({exp.totaalMetLek} rijen)</p>
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead className="text-white/45">
              <tr>
                <th className="p-2">Bedrijf</th>
                <th className="p-2">DB</th>
                <th className="p-2">Host</th>
                <th className="p-2">Database</th>
                <th className="p-2">User</th>
                <th className="p-2">Panel / tabellen</th>
              </tr>
            </thead>
            <tbody>
              {exp.rijen.map((row) => (
                <tr key={row.url} className="border-t border-white/10">
                  <td className="p-2 font-medium text-white">{row.bedrijf}</td>
                  <td className="p-2 text-amber-200">{row.dbType || "—"}</td>
                  <td className="p-2 text-white/60">{row.dbHost || "—"}</td>
                  <td className="p-2 text-white/60">{row.dbName || "—"}</td>
                  <td className="p-2 text-white/60">
                    {row.dbUser || "—"}
                    {row.wachtwoordLek ? " · pw⚠" : ""}
                  </td>
                  <td className="p-2 text-white/50">
                    {row.panelUrl ? (
                      <a href={row.panelUrl} target="_blank" rel="noreferrer" className="text-sky-300 hover:underline">
                        panel
                      </a>
                    ) : null}
                    {row.sqlTabelCount > 0 ? ` · ${row.sqlTabelCount} tabellen` : ""}
                    {row.sqlTabellen?.length ? `: ${row.sqlTabellen.slice(0, 4).join(", ")}` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {lekken.length > 0 && (
        <ul className="mt-5 space-y-2">
          {lekken.slice(0, 12).map((k) => (
            <li key={k.url} className="rounded-lg border border-rose-400/20 bg-black/25 px-3 py-2 text-sm">
              <span className="font-semibold">{k.bedrijf}</span>
              <span className="text-white/45"> — {k.database.samenvatting}</span>
              {k.reportId && (
                <a
                  href={(() => {
                    const u = urls();
                    const base = u.rapport.replace(/\/klanten-lek-rapport\.json$/, "");
                    return `${base}/reports/${k.reportId}.json`;
                  })()}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2 text-xs text-sky-300"
                >
                  rapport
                </a>
              )}
            </li>
          ))}
        </ul>
      )}

      {rapport?.disclaimer && <p className="mt-4 text-[10px] text-white/30">{rapport.disclaimer}</p>}
    </section>
  );
}