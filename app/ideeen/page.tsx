import Link from "next/link";
import {
  ideas,
  scoreLabels,
  aanbeveling,
  categoryMeta,
  spoorMeta,
  type IdeaCategory,
  type IncomeSpoor,
} from "@/data/ideas";

function ScoreBar({ label, value, max = 5 }: { label: string; value: number; max?: number }) {
  const pct = (value / max) * 100;
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="w-24 shrink-0 text-white/50">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-emerald-400/80" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-4 text-right font-mono text-white/70">{value}</span>
    </div>
  );
}

const categoryOrder: IdeaCategory[] = ["deze-week", "deze-maand", "later"];
const spoorOrder: IncomeSpoor[] = [
  "verkopen",
  "uren",
  "netwerk",
  "doorverkoop",
  "recurring",
];

export default function IdeeenPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      <header className="border-b border-white/5">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-sm text-white/60 hover:text-white">
            ← Home
          </Link>
          <span className="text-xs text-white/40">Geld · korte termijn · 5 sporen</span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 pb-24">
        <section className="border-b border-white/5 py-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
            Mike + Maarten
          </p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
            Geld verdienen
            <br />
            <span className="text-white/50">wat nu kan</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/55">
            Niet één SaaS-idee — maar vijf manieren om cash te maken: verkopen, uren,
            netwerk, doorverkoop en recurring. Alles wat jullie deze maand echt kunnen
            uitvoeren, met of zonder code.
          </p>
        </section>

        {/* 5 sporen */}
        <section className="py-10">
          <h2 className="text-lg font-bold text-white/90">5 sporen naar cash</h2>
          <p className="mt-2 text-sm text-white/50">
            Kies minstens 2 sporen — niet alles uit één categorie.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {spoorOrder.map((s) => {
              const meta = spoorMeta[s];
              const count = ideas.filter((i) => i.spoor === s && i.category !== "later").length;
              return (
                <div
                  key={s}
                  className="rounded-xl border border-white/8 bg-white/[0.03] p-4"
                >
                  <p className="text-lg">{meta.emoji}</p>
                  <p className="mt-1 font-bold text-white/90">{meta.label}</p>
                  <p className="mt-1 text-xs text-white/45">{meta.uitleg}</p>
                  <p className="mt-2 font-mono text-xs text-emerald-400/80">
                    {count} ideeën
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3-fasen plan */}
        <section className="border-t border-white/5 py-10">
          <h2 className="text-lg font-bold text-emerald-300">{aanbeveling.titel}</h2>
          <p className="mt-2 text-white/60">{aanbeveling.tekst}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {aanbeveling.sporen.map((s) => {
              const meta = spoorMeta[s.spoor];
              return (
                <div
                  key={s.spoor}
                  className="rounded-xl border border-emerald-400/15 bg-emerald-400/5 p-4"
                >
                  <p className="text-sm font-bold text-emerald-300">
                    {meta.emoji} {meta.label}
                  </p>
                  <p className="mt-1 text-xs text-white/60">{s.actie}</p>
                  <p className="mt-2 font-mono text-xs text-emerald-400">{s.euro}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {aanbeveling.plan.map((f) => (
              <div
                key={f.fase}
                className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-5"
              >
                <p className="font-bold text-emerald-300">{f.fase}</p>
                <p className="mt-2 text-sm text-white/70">{f.actie}</p>
                <p className="mt-3 font-mono text-sm text-emerald-400">{f.euro}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-white/35">
            Niet nu: {aanbeveling.nietNu.join(" · ")}
          </p>
        </section>

        {/* Per categorie */}
        {categoryOrder.map((cat) => {
          const meta = categoryMeta[cat];
          const items = ideas.filter((i) => i.category === cat);
          if (items.length === 0) return null;

          return (
            <section key={cat} className="mt-14">
              <div className="mb-6">
                <h2
                  className={`text-2xl font-bold ${
                    cat === "deze-week"
                      ? "text-emerald-400"
                      : cat === "deze-maand"
                        ? "text-amber-400"
                        : "text-sky-400"
                  }`}
                >
                  {meta.label}
                </h2>
                <p className="text-sm text-white/45">{meta.sub}</p>
              </div>

              <div className="space-y-8">
                {items
                  .sort((a, b) => b.totaal - a.totaal)
                  .map((idea) => {
                    const spoor = spoorMeta[idea.spoor];
                    return (
                      <article
                        key={idea.id}
                        id={idea.id}
                        className={`scroll-mt-8 rounded-2xl border p-7 ${
                          idea.recommended
                            ? "border-emerald-400/40 bg-emerald-400/[0.06]"
                            : "border-white/8 bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-bold">{idea.title}</h3>
                          {idea.recommended && (
                            <span className="rounded-full bg-emerald-400 px-2 py-0.5 text-xs font-bold text-slate-900">
                              start hier
                            </span>
                          )}
                          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/60">
                            {spoor.emoji} {spoor.label}
                          </span>
                          <span className="font-mono text-sm text-white/40">{idea.totaal}/25</span>
                        </div>
                        <p className="mt-1 text-sky-300/80">{idea.tagline}</p>
                        <p className="mt-3 inline-block rounded-lg bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">
                          {idea.eersteEuro}
                        </p>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                          <div>
                            <p className="text-xs uppercase text-white/35">Probleem</p>
                            <p className="mt-1 text-sm text-white/65">{idea.problem}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase text-white/35">Aanpak</p>
                            <p className="mt-1 text-sm text-white/65">{idea.aanpak}</p>
                          </div>
                        </div>

                        <div className="mt-5 rounded-lg bg-white/5 p-4">
                          <p className="text-lg font-bold text-emerald-400">{idea.geld}</p>
                          <p className="mt-1 text-sm text-white/55">{idea.geldDetail}</p>
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                          <div>
                            <p className="text-xs font-semibold text-sky-400">Mike</p>
                            <ul className="mt-1 space-y-0.5">
                              {idea.wie.mike.map((s) => (
                                <li key={s} className="text-sm text-white/60">
                                  · {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-amber-400">Maarten</p>
                            <ul className="mt-1 space-y-0.5">
                              {idea.wie.maarten.map((s) => (
                                <li key={s} className="text-sm text-white/60">
                                  · {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <ol className="mt-5 list-decimal space-y-1 pl-5 text-sm text-white/60">
                          {idea.stappen.map((s) => (
                            <li key={s}>{s}</li>
                          ))}
                        </ol>

                        <div className="mt-5 space-y-1.5">
                          {(Object.keys(idea.scores) as (keyof typeof idea.scores)[]).map(
                            (key) => (
                              <ScoreBar
                                key={key}
                                label={scoreLabels[key]}
                                value={idea.scores[key]}
                              />
                            )
                          )}
                        </div>

                        <p className="mt-4 text-xs text-white/40">⚠ {idea.risico}</p>
                      </article>
                    );
                  })}
              </div>
            </section>
          );
        })}

        <section className="mt-16 rounded-2xl border border-white/10 p-8 text-center">
          <h2 className="text-xl font-bold">Besluit</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/55">
            Kies 2 sporen: één voor deze week (cash), één voor recurring of doorverkoop.
            Niet alles tegelijk. Bel 20 min. Begin maandag.
          </p>
          <p className="mt-4 text-sm text-white/35">
            Deel: mikevisser0904.github.io/OFFERTE-WIJS/ideeen/
          </p>
        </section>
      </main>
    </div>
  );
}