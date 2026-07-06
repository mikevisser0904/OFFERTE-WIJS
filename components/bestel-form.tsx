"use client";

import { useState } from "react";
import { diensten, webklaar } from "@/data/diensten-online";

export function BestelForm({ preselect }: { preselect?: string }) {
  const [dienst, setDienst] = useState(preselect ?? diensten[0].slug);
  const [bedrijf, setBedrijf] = useState("");
  const [naam, setNaam] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [opmerking, setOpmerking] = useState("");
  const [verzonden, setVerzonden] = useState(false);

  const gekozen = diensten.find((d) => d.slug === dienst)!;

  function orderTekst() {
    return `Bestelling WebKlaar

Dienst: ${gekozen.naam} (${gekozen.prijs})
Bedrijf: ${bedrijf}
Naam: ${naam}
Tel: ${tel}
E-mail: ${email}
${opmerking ? `Opmerking: ${opmerking}` : ""}

Ik ga akkoord met betaling bij oplevering.`;
  }

  function plaatsBestelling() {
    const body = orderTekst();
    const waNummer = webklaar.whatsapp;
    const waUrl = waNummer
      ? `https://wa.me/${waNummer}?text=${encodeURIComponent(body)}`
      : `https://wa.me/?text=${encodeURIComponent(body)}`;
    const mailUrl = `mailto:${webklaar.email}?subject=${encodeURIComponent(`Bestelling ${gekozen.naam}`)}&body=${encodeURIComponent(body)}`;

    window.open(waUrl, "_blank");
    setTimeout(() => {
      window.location.href = mailUrl;
    }, 500);
    setVerzonden(true);
  }

  if (verzonden) {
    return (
      <div className="rounded-2xl border border-teal-200 bg-teal-50 p-8 text-center">
        <p className="text-2xl font-bold text-teal-800">Bestelling verstuurd</p>
        <p className="mt-3 text-slate-600">
          WhatsApp en e-mail zijn geopend. Wij nemen binnen 24 uur contact op.
        </p>
        <p className="mt-6 font-mono text-sm text-slate-500">{gekozen.prijs} · {gekozen.levertijd}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        plaatsBestelling();
      }}
      className="space-y-5"
    >
      <div>
        <label className="text-sm font-medium text-slate-700">Dienst</label>
        <select
          value={dienst}
          onChange={(e) => setDienst(e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
        >
          {diensten.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.naam} — {d.prijs}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Bedrijfsnaam *</label>
          <input
            required
            value={bedrijf}
            onChange={(e) => setBedrijf(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            placeholder="De Zonmeester BV"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Uw naam *</label>
          <input
            required
            value={naam}
            onChange={(e) => setNaam(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Telefoon *</label>
          <input
            required
            type="tel"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            placeholder="06..."
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">E-mail *</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">Opmerking (optioneel)</label>
        <textarea
          value={opmerking}
          onChange={(e) => setOpmerking(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
          placeholder="Logo heb ik al, graag groene kleur..."
        />
      </div>

      <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
        <p>
          <strong>{gekozen.naam}</strong> — {gekozen.prijs}
        </p>
        <p className="mt-1">Levertijd: {gekozen.levertijd}</p>
        <p className="mt-2 text-xs">Betaling bij oplevering. Geen verborgen kosten.</p>
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-teal-600 py-4 text-base font-bold text-white hover:bg-teal-500"
      >
        Plaats bestelling → WhatsApp + e-mail
      </button>
    </form>
  );
}