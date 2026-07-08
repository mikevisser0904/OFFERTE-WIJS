"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CopyBlock } from "@/components/copy-block";
import { recordContactVerstuurd } from "@/lib/kpi-autobump";
import {
  VANDAAG_DOEL,
  bijJaChecklist,
  vandaagBerichten,
  vandaagDeelStatus,
  vandaagHero,
  vandaagLinks,
  vandaagLinkedIn,
  vandaagMailWarm,
  vandaagBel15sec,
  vandaagStappen,
  whatsappShareUrl,
  type VandaagBerichtId,
} from "@/data/vandaag-geld";
import { merk } from "@/data/verkoop";

const STORAGE_KEY = "webklaar-vandaag-verstuurd";

function parseNummers(input: string): string[] {
  return input
    .split(/[\n,;]+/)
    .map((s) => s.trim().replace(/\D/g, ""))
    .filter((s) => s.length >= 9)
    .map((s) => (s.startsWith("31") ? s : s.startsWith("0") ? `31${s.slice(1)}` : `31${s}`));
}

function readSentCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    return Number(localStorage.getItem(STORAGE_KEY) || "0") || 0;
  } catch {
    return 0;
  }
}

function bumpSentCount(): number {
  const n = readSentCount() + 1;
  try {
    localStorage.setItem(STORAGE_KEY, String(n));
  } catch {
    /* */
  }
  window.dispatchEvent(new Event("webklaar-vandaag-sent"));
  return n;
}

export function VandaagGeldPanel() {
  const [berichtId, setBerichtId] = useState<VandaagBerichtId>("warm-kort");
  const [namen, setNamen] = useState("");
  const [nummers, setNummers] = useState("");
  const [sent, setSent] = useState(0);

  const refreshSent = useCallback(() => setSent(readSentCount()), []);

  useEffect(() => {
    refreshSent();
    window.addEventListener("webklaar-vandaag-sent", refreshSent);
    return () => window.removeEventListener("webklaar-vandaag-sent", refreshSent);
  }, [refreshSent]);

  const template = vandaagBerichten[berichtId].tekst;

  const contacten = useMemo(() => {
    const naamLijst = namen.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean);
    const nummerLijst = parseNummers(nummers);
    const max = Math.max(naamLijst.length, nummerLijst.length);
    const result: { naam: string; nummer: string; url: string }[] = [];
    for (let i = 0; i < max; i++) {
      const naam = naamLijst[i] || `contact ${i + 1}`;
      const nummer = nummerLijst[i];
      if (!nummer) continue;
      const bericht = template.replace(/\[NAAM\]/g, naam);
      result.push({
        naam,
        nummer,
        url: `https://wa.me/${nummer}?text=${encodeURIComponent(bericht)}`,
      });
    }
    return result;
  }, [namen, nummers, template]);

  const doelOk = sent >= VANDAAG_DOEL.whatsapps;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border-2 border-amber-400/50 bg-gradient-to-br from-amber-400/15 to-emerald-400/5 p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-300">Vandaag geld</p>
        <h2 className="mt-2 text-2xl font-bold text-white">
          {sent}/{VANDAAG_DOEL.whatsapps} WhatsApps → min. {VANDAAG_DOEL.gesprekken} gesprek
        </h2>
        <p className="mt-2 text-sm text-white/60">
          Instap: <strong className="text-emerald-300">{vandaagHero.titel}</strong> — {vandaagHero.sub}
        </p>
        <p className="mt-1 text-xs text-white/45">{vandaagHero.alternatief}</p>
        <CopyBlock label="Deel catalogus (alle diensten)" tekst={vandaagLinks.diensten} />
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={vandaagLinks.diensten}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-900 hover:bg-white/90"
          >
            /diensten/ →
          </a>
          <a
            href={vandaagLinks.start}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/25 px-5 py-2 text-sm font-bold text-white hover:bg-white/10"
          >
            Google Start €299 →
          </a>
          <a
            href={`tel:${merk.telefoon.replace(/\s/g, "")}`}
            className="rounded-full border border-white/30 px-5 py-2 text-sm font-bold text-white hover:bg-white/10"
          >
            Bel warm netwerk →
          </a>
          <a
            href={whatsappShareUrl(vandaagDeelStatus)}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-bold text-slate-900 hover:bg-emerald-300"
          >
            Deel via WhatsApp-status →
          </a>
          <Link href="/listings/" className="rounded-full border border-white/25 px-5 py-2 text-sm text-white/80 hover:border-white/40">
            Marktplaats copy
          </Link>
        </div>
        {doelOk ? (
          <p className="mt-4 text-sm font-semibold text-emerald-300">✓ Dagdoel bereikt — opvolg wie reageert, stuur sluiting-bericht.</p>
        ) : (
          <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-white/55">
            {vandaagStappen.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        )}
      </section>

      <section className="rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.06] p-6">
        <p className="text-sm font-semibold text-emerald-200">Bericht-type</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(Object.keys(vandaagBerichten) as VandaagBerichtId[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setBerichtId(id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                berichtId === id ? "bg-emerald-400 text-slate-900" : "border border-white/15 text-white/55"
              }`}
            >
              {vandaagBerichten[id].label}
            </button>
          ))}
        </div>
        <CopyBlock label="Voorbeeld (met [NAAM])" tekst={template} />
      </section>

      <section className="rounded-2xl border border-white/10 p-6">
        <h3 className="font-bold text-white">Jouw 5 contacten</h3>
        <p className="mt-1 text-sm text-white/50">Namen + 06-nummers — één klik opent WhatsApp met tekst erin.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs text-white/40">Namen</label>
            <textarea
              value={namen}
              onChange={(e) => setNamen(e.target.value)}
              placeholder={"Jan\nPiet\n..."}
              rows={5}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-white/40">Telefoon</label>
            <textarea
              value={nummers}
              onChange={(e) => setNummers(e.target.value)}
              placeholder={"0612345678\n..."}
              rows={5}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm"
            />
          </div>
        </div>
        {contacten.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {contacten.map((c) => (
              <li
                key={c.nummer}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/8 bg-black/20 px-4 py-3"
              >
                <span className="font-medium">{c.naam}</span>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    recordContactVerstuurd();
                    bumpSentCount();
                  }}
                  className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-bold text-slate-900"
                >
                  Verstuur →
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-white/35">Vul minstens 1 nummer in.</p>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <CopyBlock label="LinkedIn / Facebook (copy)" tekst={vandaagLinkedIn} />
        <CopyBlock label="Bij JA — checklist" tekst={bijJaChecklist} />
        <CopyBlock
          label="E-mail warm contact"
          tekst={`Onderwerp: ${vandaagMailWarm.onderwerp}\n\n${vandaagMailWarm.body}`}
        />
        <CopyBlock label="Bel 15 sec (script)" tekst={vandaagBel15sec} />
      </section>
    </div>
  );
}