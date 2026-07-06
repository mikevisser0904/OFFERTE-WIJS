"use client";

import { useState } from "react";

export function CopyBlock({ label, tekst }: { label: string; tekst: string }) {
  const [kopieerd, setKopieerd] = useState(false);

  async function kopieer() {
    await navigator.clipboard.writeText(tekst);
    setKopieerd(true);
    setTimeout(() => setKopieerd(false), 2000);
  }

  return (
    <div className="rounded-xl border border-white/8 bg-black/20">
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-2">
        <p className="text-sm font-medium text-white/80">{label}</p>
        <button
          type="button"
          onClick={kopieer}
          className="rounded-lg bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-400/25"
        >
          {kopieerd ? "✓ Gekopieerd" : "Kopieer"}
        </button>
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap p-4 font-sans text-sm leading-relaxed text-white/65">
        {tekst}
      </pre>
    </div>
  );
}