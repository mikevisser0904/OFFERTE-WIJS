"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { whatsappBerichten } from "@/data/verkoop";
import { belscriptToestemming, klantIntake } from "@/data/onboarding";
import { CopyBlock } from "@/components/copy-block";
import { recordContactVerstuurd } from "@/lib/kpi-autobump";
import { outreachVandaagUrl, type OutreachVandaag } from "@/lib/agents";
import { LEK_OUTREACH_OP_ACTIE } from "@/data/vandaag-geld";

const DEMO_LINK = "https://mikevisser0904.github.io/OFFERTE-WIJS/demo/";
const coldMsg = whatsappBerichten.find((b) => b.id === "cold-2")!;

function parseNummers(input: string): string[] {
  return input
    .split(/[\n,;]+/)
    .map((s) => s.trim().replace(/\D/g, ""))
    .filter((s) => s.length >= 9)
    .map((s) => (s.startsWith("31") ? s : s.startsWith("0") ? `31${s.slice(1)}` : `31${s}`));
}

export function ActiePanel() {
  const [namen, setNamen] = useState("");
  const [nummers, setNummers] = useState("");
  const [outreach, setOutreach] = useState<OutreachVandaag | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const loadOutreach = useCallback(async () => {
    const r = await fetch(outreachVandaagUrl());
    setOutreach(r.ok ? await r.json() : null);
  }, []);

  useEffect(() => {
    void loadOutreach();
  }, [loadOutreach]);

  const contacten = useMemo(() => {
    const naamLijst = namen.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean);
    const nummerLijst = parseNummers(nummers);
    const max = Math.max(naamLijst.length, nummerLijst.length);
    const result: { naam: string; nummer: string; bericht: string; url: string }[] = [];

    for (let i = 0; i < max; i++) {
      const naam = naamLijst[i] || `contact ${i + 1}`;
      const nummer = nummerLijst[i];
      if (!nummer) continue;

      const bericht = coldMsg.tekst
        .replace(/\[NAAM\]/g, naam)
        .replace(/\[DEMO-LINK\]/g, DEMO_LINK);

      result.push({
        naam,
        nummer,
        bericht,
        url: `https://wa.me/${nummer}?text=${encodeURIComponent(bericht)}`,
      });
    }
    return result;
  }, [namen, nummers]);

  return (
    <div className="space-y-6">
      {LEK_OUTREACH_OP_ACTIE && (
      <section className="rounded-2xl border border-emerald-400/25 bg-emerald-400/5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-emerald-300">Outreach vandaag (automatisch)</h2>
          <button type="button" onClick={() => void loadOutreach()} className="text-xs text-emerald-300/80 hover:underline">
            Vernieuwen
          </button>
        </div>
        <p className="mt-2 text-sm text-white/55">
          Komt uit <code className="text-white/60">npm run funnel</code> — zelfde lijst als{" "}
          <Link href="/agents/" className="text-emerald-300 hover:underline">
            /agents/
          </Link>
          . Geen nummers? Kopieer tekst en plak in WhatsApp.
        </p>
        {!outreach?.vandaag?.length ? (
          <p className="mt-4 text-sm text-white/40">Nog leeg — lokaal: npm run funnel</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {outreach.vandaag.slice(0, 8).map((c, i) => (
              <li key={`${c.url}-${i}`} className="rounded-xl border border-white/8 bg-black/25 px-4 py-3">
                <p className="font-medium text-white">{c.bedrijf}</p>
                <p className="text-xs text-rose-200/90">{c.reden}</p>
                {c.verkoopBericht && (
                  <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-xs text-white/55">{c.verkoopBericht}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  {c.whatsappUrl ? (
                    <a
                      href={c.whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => recordContactVerstuurd()}
                      className="rounded-full bg-emerald-400 px-4 py-1.5 text-sm font-bold text-slate-900"
                    >
                      Verstuur WhatsApp →
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        void navigator.clipboard.writeText(c.verkoopBericht || c.whatsapp);
                        setCopied(c.url);
                        setTimeout(() => setCopied(null), 2000);
                      }}
                      className="rounded-full bg-emerald-400/20 px-4 py-1.5 text-sm font-medium text-emerald-200"
                    >
                      {copied === c.url ? "Tekst gekopieerd ✓" : "Kopieer bericht"}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      )}

      <section
        className="rounded-2xl border border-amber-400/25 bg-amber-400/5 p-6"
        data-goud-target="actie"
        data-goud-highlight
      >
        <h2 className="text-lg font-bold text-amber-300">Handmatig: koude lijst</h2>
        <p className="mt-2 text-sm text-white/55">
          Plak namen + telefoonnummers. Klik per contact op <strong>Verstuur</strong>.
          Bericht en demo-link zitten er al in.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-white/40">Namen (1 per regel)</label>
          <textarea
            value={namen}
            onChange={(e) => setNamen(e.target.value)}
            placeholder={"Jan installateur\nPiet zonwering\n..."}
            rows={6}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm placeholder:text-white/20"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-white/40">
            Telefoon (1 per regel, 06...)
          </label>
          <textarea
            value={nummers}
            onChange={(e) => setNummers(e.target.value)}
            placeholder={"0612345678\n0687654321\n..."}
            rows={6}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm placeholder:text-white/20"
          />
        </div>
      </div>

      {contacten.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-emerald-400">
            {contacten.length} berichten klaar — klik Verstuur
          </p>
          {contacten.map((c) => (
            <div
              key={c.nummer}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3"
            >
              <div>
                <p className="font-medium">{c.naam}</p>
                <p className="text-xs text-white/40">+{c.nummer}</p>
              </div>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => recordContactVerstuurd()}
                className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-bold text-slate-900 hover:bg-emerald-300"
              >
                Verstuur WhatsApp →
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-white/35">
          Vul minstens 1 naam + nummer in om verstuur-knoppen te genereren.
        </p>
      )}

      <section className="rounded-2xl border border-sky-400/25 bg-sky-400/5 p-6">
        <h2 className="text-lg font-bold text-sky-300">Schriftelijke toestemming → diepere check</h2>
        <p className="mt-2 text-sm text-white/55">
          Leg vast in <code className="text-white/60">data/scan-toestemming.json</code>, optioneel inlog in{" "}
          <code className="text-white/60">scan-toestemming.local.json</code> (niet in git). Daarna lokaal:{" "}
          <code className="text-white/60">npm run scan:consent</code> en <code className="text-white/60">npm run lead:berichten</code>.
        </p>
        <div className="mt-4">
          <CopyBlock label="Belscript na toestemming" tekst={belscriptToestemming} />
        </div>
      </section>

      <section>
        <p className="mb-3 text-sm font-bold">Klant zegt ja? → stuur intake naar Grok</p>
        <CopyBlock label="Klant intake (plak in chat)" tekst={klantIntake} />
      </section>

      <section className="rounded-2xl border border-white/8 p-5">
        <p className="text-xs font-semibold uppercase text-white/40">Wat Grok al deed</p>
        <ul className="mt-3 space-y-1 text-sm text-white/55">
          <li>✓ Demo-site gebouwd en live</li>
          <li>✓ Verkoopteksten + prijzen klaar</li>
          <li>✓ WhatsApp-berichten met demo-link ingevuld</li>
          <li>✓ Site klonen voor klant → zeg welk bedrijf, wij leveren in 3 dagen</li>
          <li>✓ Factuur-template + onboarding (zie onder)</li>
        </ul>
      </section>
    </div>
  );
}