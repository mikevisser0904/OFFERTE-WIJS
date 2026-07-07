import Link from "next/link";
import { MaartenIdeeDeel } from "@/components/maarten-idee-deel";
import { MaartenWachtrijPanel } from "@/components/maarten-wachtrij-panel";
import { DashboardShell } from "@/components/dashboard-shell";
import { GOUZOEKER_ENABLED } from "@/lib/goudzoeker-config";
import { integrations } from "@/data/integrations";
import {
  ideas,
  scoreLabels,
  aanbeveling,
  categoryMeta,
  spoorMeta,
  type IdeaCategory,
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

export default function IdeeenPage() {
  return (
    <DashboardShell
      active="/ideeen/"
      title="Ideeën"
      subtitle={`${ideas.filter((i) => i.category !== "later").length} actieve sporen · gesorteerd op timing`}
    >
      <div className="mx-auto max-w-4xl space-y-10">
        <section className="rounded-2xl border border-sky-400/25 bg-sky-400/5 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-sky-300">Maarten — snel delen</h2>
          <p className="mt-2 text-sm text-white/55">
            {GOUZOEKER_ENABLED
              ? "Typ idee → goudzoeker mompelt het bij Mike. Sync via "
              : "Typ idee → sync naar wachtrij via "}
            <a
              href={integrations.maartenIdeeen.subscribe}
              className="text-sky-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ntfy
            </a>
            .
            {GOUZOEKER_ENABLED ? " Of open de goudzoeker-agent (klik op de lopende goudzoeker)." : null}
          </p>
          <div className="mt-4">
            <MaartenIdeeDeel />
          </div>
        </section>

        <MaartenWachtrijPanel />

        <section className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 sm:p-8">
          <p className="text-sm text-white/55">
            Geen startup-dromen. Vijf manieren om cash te maken — met of zonder code.
            Kies maximaal 2 sporen.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex text-sm font-medium text-emerald-300 hover:text-emerald-200"
          >
            ← Terug naar dashboard
          </Link>
        </section>

        <section>
          <h2 className="text-lg font-bold text-emerald-300">{aanbeveling.titel}</h2>
          <p className="mt-2 text-white/60">{aanbeveling.tekst}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
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
        </section>

        {categoryOrder.map((cat) => {
          const meta = categoryMeta[cat];
          const items = ideas.filter((i) => i.category === cat);
          if (items.length === 0) return null;

          return (
            <section key={cat}>
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
                        className={`scroll-mt-24 rounded-2xl border p-7 ${
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
      </div>
    </DashboardShell>
  );
}