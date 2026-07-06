import Link from "next/link";
import { ideas, spoorMeta, type IncomeSpoor } from "@/data/ideas";

const topThree = [...ideas]
  .filter((i) => i.category !== "later")
  .sort((a, b) => b.totaal - a.totaal)
  .slice(0, 3);

const spoorCounts = (Object.keys(spoorMeta) as IncomeSpoor[]).map((s) => ({
  spoor: s,
  count: ideas.filter((i) => i.spoor === s && i.category !== "later").length,
}));

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="text-xl font-bold tracking-tight">
          Offerte<span className="text-amber-400">Wijs</span>
        </span>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
          Mike + Maarten
        </span>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-20">
        <section className="py-16 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-emerald-400">
            Mike + Maarten · geld · korte termijn
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Wat kunnen jullie
            <br />
            <span className="text-amber-400">deze maand verdienen?</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
            Vijf sporen: verkopen, uren, netwerk, doorverkoop, recurring. Sites,
            digitale opruiming, renovatie-upsell, platform-gigs — alles wat nu cash oplevert.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/ideeen"
              className="rounded-full bg-amber-400 px-8 py-3 font-semibold text-slate-900 transition hover:bg-amber-300"
            >
              Alle ideeën →
            </Link>
            <Link
              href="/configurator"
              className="rounded-full border border-white/20 px-8 py-3 font-semibold text-white/90 hover:bg-white/5"
            >
              MVP configurator
            </Link>
          </div>
        </section>

        <section className="flex flex-wrap justify-center gap-3">
          {spoorCounts.map(({ spoor, count }) => (
            <span
              key={spoor}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70"
            >
              {spoorMeta[spoor].emoji} {spoorMeta[spoor].label} · {count}
            </span>
          ))}
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          {topThree.map((idea, i) => (
            <article
              key={idea.id}
              className={`rounded-2xl border p-6 ${
                idea.recommended
                  ? "border-amber-400/40 bg-amber-400/10 sm:col-span-1"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-amber-400">#{i + 1}</span>
                <h2 className="text-lg font-bold">{idea.title}</h2>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                  {idea.totaal}/25
                </span>
              </div>
              <p className="text-sm text-white/65">{idea.tagline}</p>
              <p className="mt-2 text-xs text-white/40">
                {spoorMeta[idea.spoor].emoji} {spoorMeta[idea.spoor].label}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-xl font-bold">Jullie rollen</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="font-semibold text-sky-400">Mike</p>
              <p className="mt-1 text-sm text-white/65">
                Netwerk, verkopen, renovatie, intake, content, facturen
              </p>
            </div>
            <div>
              <p className="font-semibold text-amber-400">Maarten</p>
              <p className="mt-1 text-sm text-white/65">
                Bouwen, deploy, support, templates, technische levering
              </p>
            </div>
          </div>
          <p className="mt-6 text-sm text-white/50">
            Werkwijze: git pull → afspreken wie wat pakt → push. Zie INSPIRATIE.md.
          </p>
        </section>
      </main>
    </div>
  );
}