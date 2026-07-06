import Link from "next/link";

const ideas = [
  {
    title: "OfferteWijs",
    tag: "Dit project",
    desc: "Offerte in 2 min voor vakbedrijven — bouwt voort op ZonComfort.",
    active: true,
  },
  {
    title: "KlusBoard Web",
    tag: "Idee",
    desc: "Renovatie-uren en materialen in een webdashboard.",
  },
  {
    title: "ZonScan",
    tag: "Idee",
    desc: "Foto van raam → maat + product + prijsrange.",
  },
  {
    title: "InstallateurKit",
    tag: "Idee",
    desc: "Jullie site als template voor andere bedrijven.",
  },
];

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
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-amber-400">
            Nieuw samenwerkingsproject
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Van ZonComfort naar
            <br />
            <span className="text-sky-400">elke vakman</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
            Configurator, prijzen, mooie PDF — jullie hebben het al gebouwd.
            Nu voor álle installateurs die nog in Word offertes typen.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/configurator"
              className="rounded-full bg-amber-400 px-8 py-3 font-semibold text-slate-900 transition hover:bg-amber-300"
            >
              MVP configurator →
            </Link>
            <Link
              href="/ideeen"
              className="rounded-full border border-white/20 px-8 py-3 font-semibold text-white/90 hover:bg-white/5"
            >
              Alle ideeën →
            </Link>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {ideas.map((idea) => (
            <article
              key={idea.title}
              className={`rounded-2xl border p-6 ${
                idea.active
                  ? "border-amber-400/40 bg-amber-400/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <h2 className="text-lg font-bold">{idea.title}</h2>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                  {idea.tag}
                </span>
              </div>
              <p className="text-sm text-white/65">{idea.desc}</p>
            </article>
          ))}
        </section>

        <section className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-xl font-bold">Jullie rollen</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="font-semibold text-sky-400">Mike</p>
              <p className="mt-1 text-sm text-white/65">
                Prijzen, productlogica, klantvalidatie, deploy
              </p>
            </div>
            <div>
              <p className="font-semibold text-amber-400">Maarten</p>
              <p className="mt-1 text-sm text-white/65">
                UI, flows, PDF/export, branding per klant
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