import Link from "next/link";
import { pakketten, merk } from "@/data/verkoop";

export default function WebKlaarPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      <header className="border-b border-white/5 px-6 py-5">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <p className="text-xl font-bold">
            Web<span className="text-emerald-400">Klaar</span>
          </p>
          <Link href="/" className="text-sm text-white/50 hover:text-white">
            Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
          Voor vakmannen & installateurs
        </p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
          Uw site live in 3 dagen.
          <br />
          <span className="text-white/45">Vaste prijs. Geen bureau.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-white/60">
          Wij bouwen. U levert logo + teksten. Klaar. Gebouwd door Mike & Maarten —
          bewezen met ZonComfort en tientallen vakbedrijven.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/demo/"
            className="rounded-full bg-emerald-400 px-8 py-3 font-semibold text-slate-900 hover:bg-emerald-300"
          >
            Bekijk demo-site →
          </Link>
          <Link
            href="/actie/"
            className="rounded-full border border-white/20 px-8 py-3 font-semibold hover:bg-white/5"
          >
            Bestellen →
          </Link>
        </div>

        <section className="mt-20 grid gap-6 sm:grid-cols-2">
          {pakketten.slice(0, 2).map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-8"
            >
              <p className="text-3xl font-bold text-emerald-400">{p.prijs}</p>
              <h2 className="mt-2 text-xl font-bold">{p.naam}</h2>
              <p className="mt-1 text-sm text-white/45">{p.levertijd}</p>
              <ul className="mt-5 space-y-2">
                {p.bullets.map((b) => (
                  <li key={b} className="text-sm text-white/65">
                    ✓ {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="mt-16 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-8 text-center">
          <h2 className="text-xl font-bold">Zo werkt het</h2>
          <ol className="mx-auto mt-6 max-w-md space-y-4 text-left text-sm text-white/65">
            <li>
              <span className="font-bold text-emerald-300">1.</span> U stuurt logo,
              teksten, telefoonnummer
            </li>
            <li>
              <span className="font-bold text-emerald-300">2.</span> Wij bouwen binnen 3
              dagen
            </li>
            <li>
              <span className="font-bold text-emerald-300">3.</span> Betaling bij
              oplevering — site live
            </li>
          </ol>
        </section>

        <p className="mt-12 text-center text-xs text-white/30">Demo: {merk.demo}</p>
      </main>
    </div>
  );
}