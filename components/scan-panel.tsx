"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  VAKSCAN_DISCLAIMER,
  niveauKleur,
  nieuwQueueItem,
  mergeQueueItem,
  reportsIndexUrl,
  reportJsonUrl,
  scanQueueUrl,
  type ScanIndexItem,
  type ScanQueue,
} from "@/lib/vakscan";

type FullReport = ScanIndexItem & {
  klantBullets: string[];
  verkoop: { whatsapp: string; dienst: string; prijs: string };
};

export function ScanPanel() {
  const [reports, setReports] = useState<ScanIndexItem[]>([]);
  const [queue, setQueue] = useState<ScanQueue | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [detail, setDetail] = useState<FullReport | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const [bedrijf, setBedrijf] = useState("");
  const [plaats, setPlaats] = useState("");
  const [url, setUrl] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [ri, q] = await Promise.all([
        fetch(reportsIndexUrl()).then((r) => (r.ok ? r.json() : [])),
        fetch(scanQueueUrl()).then((r) => (r.ok ? r.json() : { items: [] })),
      ]);
      setReports(Array.isArray(ri) ? ri : []);
      setQueue(q);
    } catch {
      setReports([]);
      setQueue({ updatedAt: "", items: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function openReport(id: string) {
    if (expanded === id) {
      setExpanded(null);
      setDetail(null);
      return;
    }
    setExpanded(id);
    try {
      const r = await fetch(reportJsonUrl(id));
      if (r.ok) setDetail(await r.json());
    } catch {
      setDetail(null);
    }
  }

  function copyText(text: string, key: string) {
    void navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  function downloadQueueJson() {
    const item = nieuwQueueItem({ bedrijf, plaats, url });
    if (!item.url) return;
    const merged = mergeQueueItem(queue || { updatedAt: "", items: [] }, item);
    const blob = new Blob([JSON.stringify(merged, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "scan-queue.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const pending = queue?.items.filter((i) => i.status === "pending").length ?? 0;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-rose-400/20 bg-rose-400/5 p-5">
        <p className="text-sm font-medium text-rose-200">Juridisch & ethisch</p>
        <p className="mt-2 text-sm text-white/55">{VAKSCAN_DISCLAIMER}</p>
        <p className="mt-2 text-xs text-white/40">
          Database-check: alleen bekende HTTP-paden (phpMyAdmin, Adminer, Elastic/Mongo UI, .env, SQL-dumps) — geen
          poortscan en geen inlogpogingen.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-emerald-400/15 bg-[var(--site-surface)]/60 p-5">
          <h2 className="text-lg font-semibold text-emerald-200">Queue — nieuwe vakman</h2>
          <p className="mt-1 text-sm text-white/45">
            Vul in → download <code className="text-emerald-300/80">scan-queue.json</code> → vervang in{" "}
            <code className="text-white/50">data/</code> + <code className="text-white/50">public/</code> → push of{" "}
            <code className="text-white/50">npm run scan:batch</code>
          </p>
          <div className="mt-4 space-y-3">
            <input
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
              placeholder="Bedrijfsnaam"
              value={bedrijf}
              onChange={(e) => setBedrijf(e.target.value)}
            />
            <input
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
              placeholder="Plaats"
              value={plaats}
              onChange={(e) => setPlaats(e.target.value)}
            />
            <input
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              type="button"
              onClick={downloadQueueJson}
              disabled={!url.trim()}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black disabled:opacity-40"
            >
              Queue-item downloaden
            </button>
          </div>
          <p className="mt-3 text-xs text-white/35">
            Lokaal één site: <code className="text-white/50">npm run scan -- https://site.nl --bedrijf Naam</code>
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[var(--site-surface)]/40 p-5">
          <h2 className="text-lg font-semibold">Wachtrij-status</h2>
          <p className="mt-1 text-3xl font-bold text-amber-300">{pending}</p>
          <p className="text-sm text-white/45">pending in queue</p>
          <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto text-sm">
            {(queue?.items || []).slice(0, 8).map((i) => (
              <li key={i.id} className="flex justify-between gap-2 border-b border-white/5 pb-2">
                <span className="truncate text-white/70">{i.bedrijf || i.url}</span>
                <span className="shrink-0 text-white/40">{i.status}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Rapporten</h2>
          <button type="button" onClick={load} className="text-sm text-emerald-400 hover:underline">
            Vernieuwen
          </button>
        </div>
        {loading && <p className="text-white/45">Laden…</p>}
        {!loading && reports.length === 0 && (
          <p className="rounded-xl border border-dashed border-white/15 p-8 text-center text-white/45">
            Nog geen rapporten. Draai een scan en commit <code className="text-white/50">public/reports/</code>.
          </p>
        )}
        <ul className="space-y-3">
          {reports.map((r) => (
            <li key={r.id} className="rounded-xl border border-white/10 bg-black/20">
              <button
                type="button"
                onClick={() => openReport(r.id)}
                className="flex w-full flex-wrap items-center gap-3 p-4 text-left"
              >
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${niveauKleur(r.niveau)}`}>
                  {r.niveauLabel} · {r.risicoScore}
                </span>
                <span className="font-medium">{r.bedrijf || r.url}</span>
                {r.plaats && <span className="text-sm text-white/40">{r.plaats}</span>}
                <span className="ml-auto text-xs text-white/35">{new Date(r.scannedAt).toLocaleDateString("nl-NL")}</span>
              </button>
              {expanded === r.id && detail && (
                <div className="border-t border-white/10 px-4 pb-4 pt-3">
                  <ul className="list-inside list-disc text-sm text-white/65">
                    {detail.klantBullets.map((b) => (
                      <li key={b.slice(0, 40)}>{b}</li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => copyText(detail.verkoop.whatsapp, "wa")}
                      className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-sm text-emerald-200"
                    >
                      {copied === "wa" ? "Gekopieerd ✓" : "WhatsApp kopiëren"}
                    </button>
                    <Link href="/actie/" className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/70">
                      Naar /actie/
                    </Link>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}