import { DashboardShell } from "@/components/dashboard-shell";
import { CopyBlock } from "@/components/copy-block";
import {
  merk,
  pakketten,
  whatsappBerichten,
  mailTemplates,
  belScript,
  bezwaren,
  verkoopWeek,
} from "@/data/verkoop";

export default function VerkoopPage() {
  return (
    <DashboardShell
      active="/verkoop/"
      title="Verkoopkit"
      subtitle="Kopieer → plak → verstuur. Mike verkoopt, Maarten levert."
    >
      <div className="mx-auto max-w-4xl space-y-10">
        <section className="rounded-2xl border border-amber-400/25 bg-gradient-to-br from-amber-400/[0.08] to-transparent p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Klaar om te versturen
          </p>
          <h2 className="mt-2 text-2xl font-bold">{merk.naam}</h2>
          <p className="mt-1 text-white/55">{merk.tagline}</p>
          <p className="mt-4 text-sm text-white/45">
            {merk.wie} · {merk.contact}
          </p>
          <p className="mt-2 font-mono text-xs text-emerald-400/70">{merk.demo}</p>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-bold">Pakketten (vaste prijs)</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {pakketten.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-white/8 bg-white/[0.02] p-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold">{p.naam}</h3>
                  <span className="shrink-0 font-mono text-lg font-bold text-emerald-400">
                    {p.prijs}
                  </span>
                </div>
                <p className="mt-1 text-xs text-white/40">
                  {p.levertijd} · {p.voor}
                </p>
                <ul className="mt-3 space-y-1">
                  {p.bullets.map((b) => (
                    <li key={b} className="text-sm text-white/60">
                      · {b}
                    </li>
                  ))}
                </ul>
                {p.upsell && (
                  <p className="mt-3 text-xs text-amber-400/80">Upsell: {p.upsell}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-1 text-lg font-bold">WhatsApp — kopieer & verstuur</h2>
          <p className="mb-4 text-sm text-white/45">
            Vervang [NAAM] en [DEMO-LINK]. Verstuur 5× deze week.
          </p>
          <div className="space-y-4">
            {whatsappBerichten.map((b) => (
              <div key={b.id}>
                <p className="mb-2 text-xs text-white/40">
                  {b.label} · {b.wanneer}
                </p>
                <CopyBlock label={b.label} tekst={b.tekst} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-bold">Mail</h2>
          {mailTemplates.map((b) => (
            <CopyBlock key={b.id} label={b.label} tekst={b.tekst} />
          ))}
        </section>

        <section>
          <h2 className="mb-4 text-lg font-bold">{belScript.titel}</h2>
          <div className="space-y-3">
            {belScript.stappen.map((s) => (
              <div
                key={s.fase}
                className="rounded-xl border border-white/8 bg-white/[0.02] p-4"
              >
                <p className="text-xs font-semibold text-sky-400">{s.fase}</p>
                <p className="mt-2 text-sm italic text-white/65">{s.tekst}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-bold">Bezwaren → antwoorden</h2>
          <div className="space-y-2">
            {bezwaren.map((b) => (
              <div
                key={b.vraag}
                className="rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3"
              >
                <p className="text-sm font-medium text-rose-300/90">"{b.vraag}"</p>
                <p className="mt-1 text-sm text-white/60">{b.antwoord}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-bold">Verkoopweek Mike</h2>
          <div className="overflow-hidden rounded-2xl border border-white/8">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/8 bg-white/[0.03] text-xs uppercase text-white/40">
                  <th className="px-4 py-3">Dag</th>
                  <th className="px-4 py-3">Actie</th>
                  <th className="px-4 py-3">Doel</th>
                </tr>
              </thead>
              <tbody>
                {verkoopWeek.map((v) => (
                  <tr key={v.dag} className="border-b border-white/5">
                    <td className="px-4 py-3 font-mono text-amber-400">{v.dag}</td>
                    <td className="px-4 py-3">{v.actie}</td>
                    <td className="px-4 py-3 text-emerald-400/80">{v.doel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}