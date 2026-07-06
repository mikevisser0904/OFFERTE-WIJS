"use client";

import { useState } from "react";
import { useMaartenWachtrij } from "@/hooks/use-maarten-wachtrij";
import { githubIssueUrl } from "@/lib/maarten-wachtrij";

const statusKleur: Record<string, string> = {
  pending: "bg-amber-400/20 text-amber-200",
  bezig: "bg-sky-400/20 text-sky-200",
  klaar: "bg-emerald-400/20 text-emerald-200",
  afgewezen: "bg-white/10 text-white/45",
};

function formatDatum(iso: string | undefined, fallback: number) {
  const d = iso ? new Date(iso) : new Date(fallback);
  return d.toLocaleString("nl-NL", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MaartenWachtrijPanel() {
  const { wachtrij, pending, laden } = useMaartenWachtrij();
  const [kopieFeedback, setKopieFeedback] = useState<string | null>(null);

  async function kopieerOpdracht(id: string, tekst: string) {
    await navigator.clipboard.writeText(tekst);
    setKopieFeedback(id);
    setTimeout(() => setKopieFeedback(null), 2000);
  }

  const recent = wachtrij.ideeen.slice(0, 8);

  return (
    <section className="rounded-2xl border border-amber-400/25 bg-amber-400/5 p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-amber-300">Agent-wachtrij</h2>
          <p className="mt-1 text-sm text-white/55">
            Pending ideeën wachten op Grok/Cursor. Zeg:{" "}
            <span className="font-mono text-amber-200/90">voer maarten wachtrij uit</span>
          </p>
        </div>
        <div className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-bold text-amber-200">
          {laden ? "…" : `${pending.length} pending`}
        </div>
      </div>

      {wachtrij.lastSync && (
        <p className="mt-2 text-[10px] text-white/35">
          Laatste sync: {formatDatum(wachtrij.lastSync, Date.now())}
        </p>
      )}

      {recent.length === 0 && !laden ? (
        <p className="mt-4 rounded-xl border border-white/8 bg-black/20 px-4 py-6 text-center text-sm text-white/45">
          Nog geen ideeën in de wachtrij. Maarten deelt via het formulier hierboven.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {recent.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-white/8 bg-black/25 p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${statusKleur[item.status] ?? statusKleur.pending}`}
                >
                  {item.status}
                </span>
                <span className="text-[10px] text-white/35">{item.van}</span>
                {item.euro && (
                  <span className="font-mono text-xs text-emerald-300">{item.euro}</span>
                )}
                <span className="text-[10px] text-white/30">
                  {formatDatum(item.aangemaakt, item.tijd)}
                </span>
              </div>
              <p className="mt-2 text-sm text-white/80">{item.tekst}</p>
              {item.notitie && (
                <p className="mt-1 text-xs text-white/45">→ {item.notitie}</p>
              )}
              {item.status === "pending" && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => kopieerOpdracht(item.id, item.agentOpdracht)}
                    className="rounded-lg bg-amber-400/15 px-3 py-1.5 text-xs font-semibold text-amber-200 hover:bg-amber-400/25"
                  >
                    {kopieFeedback === item.id ? "✓ Gekopieerd" : "Kopieer Grok-opdracht"}
                  </button>
                  <a
                    href={githubIssueUrl(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/55 hover:border-white/20 hover:text-white/75"
                  >
                    GitHub issue →
                  </a>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}