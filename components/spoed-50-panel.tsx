"use client";

import { CopyBlock } from "@/components/copy-block";
import {
  marktplaatsSpoed50Tekst,
  marktplaatsSpoed50Titel,
  spoed50,
  spoed50IntakeCmd,
  spoed50WaMe,
  whatsappSpoed50Share,
} from "@/data/spoed-50";

export function Spoed50Panel() {
  return (
    <section className="rounded-2xl border-2 border-amber-400/50 bg-amber-400/10 p-6">
      <p className="text-xs font-bold uppercase tracking-widest text-amber-300">€50 in 1 uur</p>
      <h2 className="mt-2 text-xl font-bold">{spoed50.titel}</h2>
      <p className="mt-1 text-sm text-white/55">
        Marktplaats + deel link. Doel: 1 Tikkie {spoed50.prijsLabel} vandaag.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={spoed50.url}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-amber-400 px-5 py-2 text-sm font-bold text-slate-900"
        >
          Open /spoed/ →
        </a>
        <a
          href={spoed50WaMe()}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-bold text-slate-900"
        >
          WhatsApp SPOED →
        </a>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(whatsappSpoed50Share)}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-white/25 px-5 py-2 text-sm text-white/80"
        >
          Deel status →
        </a>
      </div>
      <div className="mt-6 space-y-4">
        <CopyBlock label="Marktplaats titel" tekst={marktplaatsSpoed50Titel} />
        <CopyBlock label="Marktplaats tekst" tekst={marktplaatsSpoed50Tekst} />
        <CopyBlock label="Na betaling" tekst={spoed50IntakeCmd} />
      </div>
    </section>
  );
}