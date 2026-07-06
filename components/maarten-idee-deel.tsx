"use client";

import { useState, type FormEvent } from "react";
import { publiceerMaartenIdee, type MaartenIdee } from "@/lib/maarten-ideeen";
import { genereerAgentOpdracht, githubIssueUrl } from "@/lib/maarten-wachtrij";

type Props = {
  compact?: boolean;
};

const snelVoorbeelden = [
  "€899 — klant X wil configurator",
  "€500 — Excel tool voor installateur",
  "€299 — Google-pakket voor netwerk-contact",
];

export function MaartenIdeeDeel({ compact = false }: Props) {
  const [tekst, setTekst] = useState("");
  const [status, setStatus] = useState<"idle" | "bezig" | "klaar" | "fout">("idle");
  const [laatste, setLaatste] = useState<MaartenIdee | null>(null);
  const [kopieFeedback, setKopieFeedback] = useState(false);

  async function deel(e?: FormEvent) {
    e?.preventDefault();
    const trimmed = tekst.trim();
    if (!trimmed) return;
    setStatus("bezig");
    try {
      const idee = await publiceerMaartenIdee(trimmed);
      setTekst("");
      setLaatste(idee);
      setStatus("klaar");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("fout");
      setTimeout(() => setStatus("idle"), 2500);
    }
  }

  async function kopieerOpdracht() {
    if (!laatste) return;
    await navigator.clipboard.writeText(genereerAgentOpdracht(laatste));
    setKopieFeedback(true);
    setTimeout(() => setKopieFeedback(false), 2000);
  }

  return (
    <form
      onSubmit={deel}
      className={`rounded-xl border border-sky-400/30 bg-sky-950/30 ${
        compact ? "p-2.5" : "p-4"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className={`font-bold text-sky-300 ${compact ? "text-[10px]" : "text-xs"}`}>
          Maarten — snel idee → goudzoeker
        </p>
        {!compact && (
          <span className="rounded-full bg-sky-400/15 px-2 py-0.5 text-[9px] font-medium text-sky-200/80">
            sync via ntfy → agent-wachtrij
          </span>
        )}
      </div>
      {!compact && (
        <p className="mt-1 text-[10px] text-white/40">
          Formaat: <span className="font-mono text-white/55">€500 — jouw idee</span> (euro optioneel)
        </p>
      )}
      <textarea
        value={tekst}
        onChange={(e) => setTekst(e.target.value)}
        placeholder="Bijv. €899 — site voor zonweringbedrijf uit Fiverr-lead"
        rows={compact ? 2 : 3}
        className={`mt-2 w-full resize-none rounded-lg border border-white/10 bg-black/35 px-3 py-2 text-white/85 placeholder:text-white/25 focus:border-sky-400/40 focus:outline-none ${
          compact ? "text-xs" : "text-sm"
        }`}
      />
      {!compact && (
        <div className="mt-2 flex flex-wrap gap-1">
          {snelVoorbeelden.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setTekst(v)}
              className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] text-white/45 hover:border-sky-400/30 hover:text-sky-200"
            >
              {v}
            </button>
          ))}
        </div>
      )}
      <button
        type="submit"
        disabled={!tekst.trim() || status === "bezig"}
        className={`mt-2 w-full rounded-lg bg-sky-500 font-bold text-slate-900 hover:bg-sky-400 disabled:opacity-40 ${
          compact ? "py-1.5 text-xs" : "py-2 text-sm"
        }`}
      >
        {status === "bezig" ? "Versturen…" : status === "klaar" ? "✓ Goudzoeker heeft het!" : "Deel in goudzoeker →"}
      </button>

      {laatste && status !== "bezig" && (
        <div className="mt-3 rounded-lg border border-amber-400/20 bg-amber-400/5 p-3">
          <p className="text-[10px] font-medium text-amber-200/80">
            Agent kan dit doorvoeren (sync ~5 min of lokaal: npm run sync:maarten)
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={kopieerOpdracht}
              className="rounded-lg bg-amber-400/15 px-3 py-1.5 text-xs font-semibold text-amber-200 hover:bg-amber-400/25"
            >
              {kopieFeedback ? "✓ Gekopieerd" : "Kopieer Grok-opdracht"}
            </button>
            <a
              href={githubIssueUrl(laatste)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/55 hover:border-white/20 hover:text-white/75"
            >
              GitHub issue →
            </a>
          </div>
        </div>
      )}
    </form>
  );
}