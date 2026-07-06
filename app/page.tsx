import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { GoalTracker, GoalBreakdown, GoalMilestones } from "@/components/goal-tracker";
import { doelWekelijks, hoofddoel } from "@/data/doel";
import {
  getDashboardStats,
  aanbeveling,
  spoorMeta,
  categoryMeta,
  spoorOrder,
} from "@/lib/dashboard";

const stats = getDashboardStats();

function StatCard({
  label,
  value,
  sub,
  accent = "emerald",
}: {
  label: string;
  value: string;
  sub: string;
  accent?: "emerald" | "amber" | "sky" | "rose";
}) {
  const colors = {
    emerald: { box: "border-emerald-400/20 bg-emerald-400/5", value: "text-emerald-300" },
    amber: { box: "border-amber-400/20 bg-amber-400/5", value: "text-amber-300" },
    sky: { box: "border-sky-400/20 bg-sky-400/5", value: "text-sky-300" },
    rose: { box: "border-rose-400/20 bg-rose-400/5", value: "text-rose-300" },
  };

  return (
    <div className={`rounded-2xl border p-5 ${colors[accent].box}`}>
      <p className="text-xs font-medium uppercase tracking-wider text-white/40">{label}</p>
      <p className={`mt-2 text-2xl font-bold sm:text-3xl ${colors[accent].value}`}>{value}</p>
      <p className="mt-1 text-xs text-white/45">{sub}</p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardShell
      active="/"
      title="Geld Dashboard"
      subtitle={`Eerste doel: ${hoofddoel.label} in ${hoofddoel.deadline}`}
    >
      <div className="mx-auto max-w-6xl space-y-8">
        <GoalTracker />

        <GoalMilestones />

        <GoalBreakdown />

        {/* KPI row */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Week 1–2 target"
            value="€1.500"
            sub="Eerste mijlpaal · ZonComfort + 1 verkoop"
            accent="emerald"
          />
          <StatCard
            label="Ideeën actief"
            value={String(stats.actiefIdeeën)}
            sub={`${stats.dezeWeek} deze week · ${stats.dezeMaand} deze maand`}
            accent="amber"
          />
          <StatCard
            label="Top score"
            value={`${stats.topScore}/25`}
            sub={stats.topIdea?.title ?? "—"}
            accent="sky"
          />
          <StatCard
            label="Sporen"
            value="5"
            sub="Verkopen · uren · netwerk · doorverkoop · recurring"
            accent="rose"
          />
        </section>

        {/* Week plan + start hier */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">4-weken plan</h2>
              <span className="text-xs text-white/35">{aanbeveling.titel}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {aanbeveling.plan.map((fase, i) => (
                <div
                  key={fase.fase}
                  className="relative rounded-2xl border border-white/8 bg-white/[0.02] p-5"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/15 text-xs font-bold text-emerald-300">
                      {i + 1}
                    </span>
                    <p className="font-bold text-emerald-300">{fase.fase}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-white/65">{fase.actie}</p>
                  <p className="mt-3 font-mono text-sm font-semibold text-emerald-400">
                    {fase.euro}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.06] p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Start hier
            </p>
            {stats.recommended.map((idea) => (
              <div key={idea.id} className="mt-4">
                <h3 className="text-lg font-bold">{idea.title}</h3>
                <p className="mt-1 text-sm text-white/55">{idea.tagline}</p>
                <p className="mt-3 inline-block rounded-lg bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">
                  {idea.eersteEuro}
                </p>
                <p className="mt-3 text-lg font-bold text-emerald-400">{idea.geld}</p>
              </div>
            ))}
            <Link
              href="/ideeen/#site-verkopen"
              className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-emerald-300 hover:text-emerald-200"
            >
              Volledig uitgewerkt →
            </Link>
          </div>
        </section>

        {/* 5 sporen */}
        <section>
          <h2 className="mb-4 text-lg font-bold">5 sporen</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {spoorOrder.map((spoor) => {
              const meta = spoorMeta[spoor];
              const data = stats.perSpoor[spoor];
              const aanbevel = aanbeveling.sporen.find((s) => s.spoor === spoor);
              return (
                <div
                  key={spoor}
                  className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 transition hover:border-white/15"
                >
                  <p className="text-xl">{meta.emoji}</p>
                  <p className="mt-2 font-bold">{meta.label}</p>
                  <p className="mt-1 text-xs text-white/40">{meta.uitleg}</p>
                  {aanbevel && (
                    <p className="mt-3 font-mono text-xs text-emerald-400">{aanbevel.euro}</p>
                  )}
                  {data.top && (
                    <p className="mt-2 truncate text-xs text-white/50" title={data.top.title}>
                      → {data.top.title}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-white/30">{data.count} ideeën</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Prioriteiten + deze week */}
        <section className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Top prioriteiten</h2>
              <Link href="/ideeen/" className="text-xs text-white/40 hover:text-white">
                Alle ideeën →
              </Link>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/8">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.03] text-xs uppercase tracking-wider text-white/40">
                    <th className="px-4 py-3 font-medium">#</th>
                    <th className="px-4 py-3 font-medium">Idee</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Spoor</th>
                    <th className="px-4 py-3 font-medium">Score</th>
                    <th className="hidden px-4 py-3 font-medium md:table-cell">Eerste €</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topVijf.map((idea, i) => (
                    <tr
                      key={idea.id}
                      className="border-b border-white/5 transition hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3 font-mono text-white/40">{i + 1}</td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/ideeen/#${idea.id}`}
                          className="font-medium hover:text-emerald-300"
                        >
                          {idea.title}
                        </Link>
                        <p className="mt-0.5 text-xs text-white/40 sm:hidden">
                          {spoorMeta[idea.spoor].label}
                        </p>
                      </td>
                      <td className="hidden px-4 py-3 text-white/50 sm:table-cell">
                        {spoorMeta[idea.spoor].emoji} {spoorMeta[idea.spoor].label}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-xs">
                          {idea.totaal}/25
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 text-xs text-emerald-400/80 md:table-cell">
                        {idea.eersteEuro}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="mb-4 text-lg font-bold">
              {categoryMeta["deze-week"].label}
            </h2>
            <div className="space-y-2">
              {stats.perCategorie["deze-week"]
                .sort((a, b) => b.totaal - a.totaal)
                .map((idea) => (
                  <Link
                    key={idea.id}
                    href={`/ideeen/#${idea.id}`}
                    className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3 transition hover:border-emerald-400/30 hover:bg-emerald-400/5"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{idea.title}</p>
                      <p className="text-xs text-white/40">{idea.geld}</p>
                    </div>
                    <span className="ml-3 shrink-0 font-mono text-xs text-white/50">
                      {idea.totaal}
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* Wekelijkse KPI's */}
        <section>
          <h2 className="mb-4 text-lg font-bold">Wekelijkse discipline</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {doelWekelijks.map((w) => (
              <div
                key={w.metric}
                className="rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3"
              >
                <p className="text-xs text-white/40">{w.metric}</p>
                <p className="mt-1 font-bold text-emerald-300">{w.doel}</p>
                <p className="text-xs text-white/35">{w.wie}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Rollen + niet nu + links */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-sky-400/20 bg-sky-400/5 p-5">
            <p className="text-sm font-bold text-sky-300">Mike → €5.000</p>
            <ul className="mt-3 space-y-1.5 text-sm text-white/60">
              <li>· 5 contacten/week (60 totaal)</li>
              <li>· 6 sites verkopen + upsells</li>
              <li>· Renovatie + digitaal upsell</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
            <p className="text-sm font-bold text-amber-300">Maarten → €5.000</p>
            <ul className="mt-3 space-y-1.5 text-sm text-white/60">
              <li>· 6 sites klonen (template)</li>
              <li>· Levertijd ≤ 3 dagen</li>
              <li>· Excel-tools + remote support</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/5 p-5">
            <p className="text-sm font-bold text-rose-300">Niet nu</p>
            <ul className="mt-3 space-y-1.5 text-sm text-white/60">
              {aanbeveling.nietNu.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="flex flex-wrap gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-5">
          <Link
            href="/ideeen/"
            className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-300"
          >
            Alle ideeën bekijken
          </Link>
          <Link
            href="/configurator/"
            className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white/80 hover:bg-white/5"
          >
            Configurator MVP
          </Link>
          <span className="flex items-center text-xs text-white/30">
            Deel: mikevisser0904.github.io/OFFERTE-WIJS/
          </span>
        </section>
      </div>
    </DashboardShell>
  );
}