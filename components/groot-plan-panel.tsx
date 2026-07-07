import Link from "next/link";
import { visie, fases, dezeWeek, huidigeFase } from "@/data/groot-plan";
import { hoofddoel } from "@/data/doel";

export function GrootPlanPanel() {
  const nu = huidigeFase();

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-violet-400/35 bg-gradient-to-br from-violet-600/20 via-transparent to-emerald-600/15 p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Groot plan</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{visie.naam}</h2>
        <p className="mt-4 max-w-2xl text-lg text-white/70">{visie.elevator}</p>
        <p className="mt-4 text-sm text-emerald-300/90">North star: {visie.northStar}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/agents/"
            className="rounded-full bg-violet-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-violet-400"
          >
            Agent-hub →
          </Link>
          <Link
            href="/actie/"
            className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/5"
          >
            Verkopen vandaag →
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-400/25 bg-emerald-400/5 p-6">
        <p className="text-xs uppercase text-white/40">Nu bezig · Fase {nu.fase}</p>
        <h3 className="text-2xl font-bold text-emerald-200">{nu.titel}</h3>
        <p className="text-white/55">{nu.tagline}</p>
        <p className="mt-2 text-sm text-white/45">
          Eerste geld-doel: {hoofddoel.label} ({hoofddoel.deadline}) — past in {nu.doelOmzet}
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {nu.mijlpalen.map((m) => (
            <li key={m} className="flex gap-2 text-sm text-white/65">
              <span className="text-emerald-400">→</span> {m}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold">Fases</h3>
        <div className="mt-4 space-y-4">
          {fases.map((f) => (
            <div
              key={f.id}
              className={`rounded-xl border p-5 ${
                f.status === "nu"
                  ? "border-violet-400/40 bg-violet-500/10"
                  : "border-white/10 bg-black/20 opacity-90"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-white/40">F{f.fase}</span>
                <span className="font-semibold">{f.titel}</span>
                {f.status === "nu" && (
                  <span className="rounded-full bg-violet-500/30 px-2 py-0.5 text-xs text-violet-200">NU</span>
                )}
              </div>
              <p className="mt-1 text-sm text-white/50">{f.tagline}</p>
              <p className="mt-2 text-xs text-emerald-300/80">Agents: {f.agents.join(" · ")}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 p-5">
        <h3 className="font-semibold">Deze week (ritme)</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {dezeWeek.map((d) => (
            <li key={d.dag} className="flex gap-4 text-white/65">
              <span className="w-8 font-mono text-white/40">{d.dag}</span>
              <span className="text-violet-300">{d.agent}</span>
              <span>{d.actie}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}