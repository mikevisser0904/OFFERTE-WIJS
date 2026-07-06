import Link from "next/link";
import { ideas, scoreLabels, aanbeveling } from "@/data/ideas";

function ScoreBar({ label, value, max = 5 }: { label: string; value: number; max?: number }) {
  const pct = (value / max) * 100;
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="w-28 shrink-0 text-white/50">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-amber-400/80"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-4 text-right font-mono text-white/70">{value}</span>
    </div>
  );
}

export default function IdeeenPage() {
  const sorted = [...ideas].sort((a, b) => b.totaal - a.totaal);

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      <header className="border-b border-white/5 bg-[#0a0f1a]/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-sm font-medium text-white/60 hover:text-white">
            ← OfferteWijs
          </Link>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">
            Mike + Maarten · beslisdocument
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 pb-24">
        {/* Intro */}
        <section className="border-b border-white/5 py-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">
            Projectkeuze 2026
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
            Waar zetten jullie jullie energie?
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/60">
            Jullie hebben ZonComfort bewezen. Dit document vergelijkt 6 concrete projecten —
            met probleem, geld, risico en wie wat doet. Geen vaag gepraat.
          </p>
          <p className="mt-4 text-sm text-white/40">
            Deel met Maarten:{" "}
            <span className="text-sky-400">mikevisser0904.github.io/OFFERTE-WIJS/ideeen/</span>
          </p>
        </section>

        {/* Ranking */}
        <section className="py-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white/40">
            Ranking (totaalscore /25)
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {sorted.map((idea, i) => (
              <a
                key={idea.id}
                href={`#${idea.id}`}
                className={`rounded-full px-4 py-2 text-sm font-medium transition hover:scale-105 ${
                  i === 0
                    ? "bg-amber-400 text-slate-900"
                    : "bg-white/5 text-white/80 hover:bg-white/10"
                }`}
              >
                {i + 1}. {idea.title}
                <span className="ml-1 opacity-60">({idea.totaal})</span>
              </a>
            ))}
          </div>
        </section>

        {/* Aanbeveling */}
        <section className="rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-400/15 to-transparent p-8">
          <h2 className="text-xl font-bold text-amber-300">{aanbeveling.titel}</h2>
          <p className="mt-3 leading-relaxed text-white/75">{aanbeveling.tekst}</p>
          <ol className="mt-6 space-y-2">
            {aanbeveling.beslissing.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm text-white/70">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-xs font-bold text-amber-300">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        {/* Ideeën */}
        <div className="mt-14 space-y-16">
          {sorted.map((idea) => (
            <article
              key={idea.id}
              id={idea.id}
              className={`scroll-mt-8 rounded-2xl border p-8 ${
                idea.recommended
                  ? "border-amber-400/40 bg-amber-400/[0.06]"
                  : "border-white/8 bg-white/[0.02]"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold">{idea.title}</h2>
                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-sm text-amber-300">
                      {idea.totaal}/25
                    </span>
                    {idea.recommended && (
                      <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-bold text-slate-900">
                        aanbevolen
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-lg text-sky-300/90">{idea.tagline}</p>
                </div>
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl bg-red-500/5 p-5 ring-1 ring-red-400/10">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-red-300/80">
                    Het probleem
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{idea.problem}</p>
                </div>
                <div className="rounded-xl bg-emerald-500/5 p-5 ring-1 ring-emerald-400/10">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-300/80">
                    Jullie oplossing
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{idea.solution}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/40">Klant</p>
                  <p className="mt-1 text-white/75">{idea.klant}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/40">Voorbeeld</p>
                  <p className="mt-1 italic text-white/60">{idea.voorbeeldKlant}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/40">Geld</p>
                  <p className="mt-1 font-semibold text-emerald-400">{idea.geld}</p>
                  <p className="mt-1 text-xs text-white/50">{idea.geldDetail}</p>
                </div>
              </div>

              <p className="mt-6 rounded-lg bg-white/5 p-4 text-sm text-white/65">
                <strong className="text-white/90">Waarom jullie:</strong> {idea.waaromJullie}
              </p>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                    Mike
                  </p>
                  <ul className="mt-2 space-y-1">
                    {idea.mike.map((item) => (
                      <li key={item} className="text-sm text-white/65">
                        · {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    Maarten
                  </p>
                  <ul className="mt-2 space-y-1">
                    {idea.maarten.map((item) => (
                      <li key={item} className="text-sm text-white/65">
                        · {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                {(Object.keys(idea.scores) as (keyof typeof idea.scores)[]).map((key) => (
                  <ScoreBar key={key} label={scoreLabels[key]} value={idea.scores[key]} />
                ))}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
                    MVP (3 weken)
                  </h3>
                  <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm text-white/65">
                    {idea.mvp.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
                    Risico + oplossing
                  </h3>
                  <p className="mt-2 text-sm text-white/60">{idea.risico}</p>
                  <p className="mt-4 text-xs text-white/35">
                    Niet nu: {idea.nietNu.join(" · ")}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Afsluiting */}
        <section className="mt-20 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <h2 className="text-xl font-bold">Volgende stap</h2>
          <p className="mx-auto mt-3 max-w-md text-white/60">
            Bel of app 20 minuten. Kies één project. Begin maandag.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/configurator/"
              className="rounded-full bg-amber-400 px-6 py-2.5 text-sm font-semibold text-slate-900"
            >
              Start OfferteWijs MVP
            </Link>
            <Link href="/" className="rounded-full border border-white/20 px-6 py-2.5 text-sm">
              Terug naar home
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}