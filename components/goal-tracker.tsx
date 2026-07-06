"use client";

import { useEffect, useState } from "react";
import { hoofddoel, doelMijlpalen, doelBronnen } from "@/data/doel";

const STORAGE_KEY = "offertewijs-doel-bijgewerkt";

export function GoalTracker() {
  const [ingehouden, setIngehouden] = useState(0);
  const [geladen, setGeladen] = useState(false);

  useEffect(() => {
    const opgeslagen = localStorage.getItem(STORAGE_KEY);
    if (opgeslagen) setIngehouden(Number(opgeslagen) || 0);
    setGeladen(true);
  }, []);

  function update(bedrag: number) {
    const waarde = Math.max(0, Math.min(hoofddoel.bedrag, bedrag));
    setIngehouden(waarde);
    localStorage.setItem(STORAGE_KEY, String(waarde));
  }

  const pct = Math.min(100, (ingehouden / hoofddoel.bedrag) * 100);
  const resterend = hoofddoel.bedrag - ingehouden;
  const huidigeMijlpaal = doelMijlpalen.find((m) => ingehouden < m.cumulatief) ?? doelMijlpalen.at(-1);

  if (!geladen) {
    return (
      <div className="h-48 animate-pulse rounded-2xl border border-white/8 bg-white/[0.02]" />
    );
  }

  return (
    <section className="rounded-2xl border border-amber-400/25 bg-gradient-to-br from-amber-400/[0.08] to-emerald-400/[0.04] p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Eerste doel
          </p>
          <h2 className="mt-1 text-3xl font-bold sm:text-4xl">
            {hoofddoel.label}
            <span className="ml-2 text-white/40">· €10.000</span>
          </h2>
          <p className="mt-2 text-sm text-white/55">{hoofddoel.realistisch}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-3xl font-bold text-emerald-300">
            €{ingehouden.toLocaleString("nl-NL")}
          </p>
          <p className="text-xs text-white/40">
            van €{hoofddoel.bedrag.toLocaleString("nl-NL")} · {hoofddoel.deadline}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="h-4 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-white/40">
          <span>{pct.toFixed(0)}%</span>
          <span>Nog €{resterend.toLocaleString("nl-NL")}</span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <label className="text-xs text-white/50">Bijwerken:</label>
        <input
          type="range"
          min={0}
          max={hoofddoel.bedrag}
          step={100}
          value={ingehouden}
          onChange={(e) => update(Number(e.target.value))}
          className="h-2 flex-1 min-w-[120px] cursor-pointer accent-emerald-400"
        />
        <input
          type="number"
          min={0}
          max={hoofddoel.bedrag}
          step={100}
          value={ingehouden}
          onChange={(e) => update(Number(e.target.value))}
          className="w-24 rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-right font-mono text-sm"
        />
      </div>

      {huidigeMijlpaal && (
        <div className="mt-5 rounded-xl border border-white/8 bg-black/20 p-4">
          <p className="text-xs font-semibold text-emerald-400">
            Nu: {huidigeMijlpaal.week} — {huidigeMijlpaal.label} (€{huidigeMijlpaal.cumulatief.toLocaleString("nl-NL")})
          </p>
          <ul className="mt-2 space-y-1">
            {huidigeMijlpaal.acties.map((a) => (
              <li key={a} className="text-sm text-white/60">
                · {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-4 text-xs text-white/30">{hoofddoel.split}</p>
    </section>
  );
}

export function GoalBreakdown() {
  const totaal = doelBronnen.reduce((s, b) => s + b.totaal, 0);

  return (
    <section>
      <h2 className="mb-1 text-lg font-bold">Pad naar €10.000</h2>
      <p className="mb-4 text-sm text-white/45">
        Concrete mix — {totaal.toLocaleString("nl-NL")} totaal over 12 weken
      </p>
      <div className="overflow-hidden rounded-2xl border border-white/8">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/8 bg-white/[0.03] text-xs uppercase tracking-wider text-white/40">
              <th className="px-4 py-3">Bron</th>
              <th className="px-4 py-3">Stuks</th>
              <th className="hidden px-4 py-3 sm:table-cell">Per stuk</th>
              <th className="px-4 py-3">Totaal</th>
            </tr>
          </thead>
          <tbody>
            {doelBronnen.map((b) => (
              <tr key={b.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <p className="font-medium">{b.label}</p>
                  <p className="text-xs text-white/40">{b.wie}</p>
                </td>
                <td className="px-4 py-3 font-mono text-white/60">{b.stuks}×</td>
                <td className="hidden px-4 py-3 font-mono text-white/50 sm:table-cell">
                  €{b.perStuk.toLocaleString("nl-NL")}
                </td>
                <td className="px-4 py-3 font-mono font-semibold text-emerald-400">
                  €{b.totaal.toLocaleString("nl-NL")}
                </td>
              </tr>
            ))}
            <tr className="bg-emerald-400/5 font-bold">
              <td className="px-4 py-3" colSpan={3}>
                Totaal
              </td>
              <td className="px-4 py-3 font-mono text-emerald-300">
                €{totaal.toLocaleString("nl-NL")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function GoalMilestones() {
  return (
    <section>
      <h2 className="mb-4 text-lg font-bold">Mijlpalen</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {doelMijlpalen.map((m) => (
          <div
            key={m.id}
            className="rounded-xl border border-white/8 bg-white/[0.02] p-4"
          >
            <p className="text-xs font-semibold text-amber-400">{m.week}</p>
            <p className="mt-1 font-bold">{m.label}</p>
            <p className="mt-2 font-mono text-lg text-emerald-400">
              €{m.cumulatief.toLocaleString("nl-NL")}
            </p>
            <p className="mt-1 text-xs text-white/40">+€{m.bedrag.toLocaleString("nl-NL")} deze fase</p>
          </div>
        ))}
      </div>
    </section>
  );
}