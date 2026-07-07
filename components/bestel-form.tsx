"use client";

import { useEffect, useState } from "react";
import { diensten, webklaar } from "@/data/diensten-online";
import { notifyNtfy, recordBestelling } from "@/lib/kpi-autobump";

export function BestelForm({ preselect }: { preselect?: string }) {
  const [dienst, setDienst] = useState(preselect ?? "google-start");
  const [bedrijf, setBedrijf] = useState("");
  const [naam, setNaam] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [opmerking, setOpmerking] = useState("");
  const [verzonden, setVerzonden] = useState(false);
  const [waUrl, setWaUrl] = useState("");
  const [mailUrl, setMailUrl] = useState("");

  const gekozen = diensten.find((d) => d.slug === dienst)!;

  useEffect(() => {
    if (preselect && diensten.some((d) => d.slug === preselect)) {
      setDienst(preselect);
    }
  }, [preselect]);

  function orderTekst() {
    return `Bestelling DoekoeWijs

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
    const wa = `https://wa.me/${webklaar.whatsapp}?text=${encodeURIComponent(body)}`;
    const mail = `mailto:${webklaar.email}?subject=${encodeURIComponent(`Bestelling ${gekozen.naam}`)}&body=${encodeURIComponent(body)}`;
    setWaUrl(wa);
    setMailUrl(mail);
    setVerzonden(true);
    recordBestelling(gekozen.prijs);
    void notifyNtfy(
      "webklaar-mike",
      `Bestelling: ${gekozen.naam}`,
      `${bedrijf} · ${naam}\n${tel}\n${gekozen.prijs}`,
      "urgent"
    );
    window.open(wa, "_blank", "noopener,noreferrer");
  }

  if (verzonden) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8">
        <p className="text-2xl font-bold text-emerald-800">Bestelling klaar</p>
        <p className="mt-3 text-slate-600">
          WhatsApp zou moeten openen. Werkt dat niet? Gebruik de knoppen hieronder.
        </p>
        <p className="mt-4 font-mono text-sm text-slate-500">
          {gekozen.prijs} · {gekozen.levertijd}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-emerald-600 px-6 py-3 text-center text-sm font-bold text-white hover:bg-emerald-500"
          >
            Verstuur via WhatsApp →
          </a>
          <a
            href={mailUrl}
            className="rounded-full border border-emerald-300 px-6 py-3 text-center text-sm font-bold text-emerald-800 hover:bg-emerald-100"
          >
            Verstuur via e-mail →
          </a>
        </div>
        <p className="mt-6 text-xs text-slate-500">
          Gaat naar {webklaar.telefoonDisplay} en {webklaar.email}
        </p>
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
        className="w-full rounded-full bg-emerald-600 py-4 text-base font-bold text-white hover:bg-emerald-500"
      >
        Plaats bestelling →
      </button>
    </form>
  );
}