import Link from "next/link";
import { demo } from "@/data/demo-site";
import { brand } from "@/data/brand";

export function DemoVakmanSite() {
  const waOfferte = `https://wa.me/${demo.whatsapp}?text=${encodeURIComponent(
    "Hoi, ik wil graag een vrijblijvende offerte voor zonwering."
  )}`;

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      {/* Demo strip */}
      <div className="sticky top-0 z-50 border-b border-amber-200/80 bg-amber-50 px-4 py-2.5 text-center text-sm text-amber-950">
        <span className="font-semibold">DEMO</span>
        <span className="mx-2 text-amber-700/60">·</span>
        Zo ziet de site van uw klant eruit
        <span className="mx-2 hidden text-amber-700/60 sm:inline">·</span>
        <Link href="/bestellen/" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
          Eigen site bestellen →
        </Link>
        <span className="mx-2 hidden text-amber-700/60 md:inline">·</span>
        <Link href="/show/" className="hidden font-medium text-amber-800/80 hover:underline md:inline">
          {brand.name} tour
        </Link>
      </div>

      {/* Header */}
      <header className="sticky top-[41px] z-40 border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-lg font-bold tracking-tight sm:text-xl" style={{ color: demo.kleur }}>
              {demo.bedrijf}
            </p>
            <p className="truncate text-xs text-slate-500">{demo.tagline}</p>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#diensten" className="hover:text-slate-900">
              Diensten
            </a>
            <a href="#over" className="hover:text-slate-900">
              Over ons
            </a>
            <a href="#reviews" className="hover:text-slate-900">
              Reviews
            </a>
            <a href="#faq" className="hover:text-slate-900">
              FAQ
            </a>
          </nav>
          <a
            href={`tel:${demo.telefoonTel}`}
            className="shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-95 sm:px-5"
            style={{ backgroundColor: demo.kleur }}
          >
            <span className="hidden sm:inline">{demo.telefoon}</span>
            <span className="sm:hidden">Bel</span>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, ${demo.kleur} 0%, transparent 50%), radial-gradient(circle at 80% 70%, ${demo.kleurDonker} 0%, transparent 45%)`,
          }}
        />
        <div
          className="relative px-5 py-16 text-white sm:px-6 sm:py-24"
          style={{
            background: `linear-gradient(135deg, ${demo.kleur} 0%, ${demo.kleurDonker} 55%, #134e4a 100%)`,
          }}
        >
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">{demo.regio}</p>
              <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.25rem]">
                Zonwering op maat voor uw woning
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/90">
                Screens, rolluiken, knikarm en kozijnen. Gratis advies — offerte binnen 24 uur.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={waOfferte}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-slate-900 shadow-lg shadow-black/10 transition hover:bg-emerald-50"
                >
                  WhatsApp offerte
                </a>
                <a
                  href="#diensten"
                  className="inline-flex rounded-full border-2 border-white/35 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Bekijk diensten
                </a>
              </div>
              <p className="mt-6 text-sm text-white/65">Al sinds {demo.sinds} actief in de regio</p>
            </div>

            {/* Visueel blok (geen stockfoto nodig) */}
            <div className="relative hidden lg:block">
              <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-sm">
                <div className="flex h-full flex-col justify-between p-8">
                  <div className="flex gap-2">
                    {demo.werkgebied.slice(0, 3).map((w) => (
                      <span key={w} className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                        {w}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div className="h-3 w-2/3 rounded-full bg-white/25" />
                    <div className="h-3 w-full rounded-full bg-white/15" />
                    <div className="grid grid-cols-2 gap-3 pt-4">
                      {demo.diensten.slice(0, 2).map((d) => (
                        <div key={d.titel} className="rounded-2xl bg-white/15 p-4">
                          <p className="text-2xl opacity-90">{d.icon}</p>
                          <p className="mt-2 font-semibold">{d.titel}</p>
                          <p className="text-xs text-white/70">vanaf {d.vanaf}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-100 bg-slate-50/80 py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 sm:grid-cols-4 sm:px-6">
          {demo.stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold tabular-nums tracking-tight" style={{ color: demo.kleur }}>
                {s.value}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* USPs */}
      <section className="border-b border-slate-100 py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-3 px-5 sm:gap-4 sm:px-6">
          {demo.usps.map((u) => (
            <span
              key={u}
              className="rounded-full border border-emerald-100 bg-emerald-50/80 px-4 py-2 text-sm font-medium text-emerald-900"
            >
              ✓ {u}
            </span>
          ))}
        </div>
      </section>

      {/* Diensten */}
      <section id="diensten" className="scroll-mt-28 px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">Wat we doen</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Onze diensten</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {demo.diensten.map((d) => (
              <article
                key={d.titel}
                className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl text-white"
                    style={{ backgroundColor: demo.kleur }}
                  >
                    {d.icon}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-lg font-bold text-slate-900">{d.titel}</h3>
                      <span className="font-mono text-sm font-bold text-emerald-700">vanaf {d.vanaf}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{d.tekst}</p>
                    <a
                      href={waOfferte}
                      className="mt-4 inline-block text-sm font-semibold transition group-hover:underline"
                      style={{ color: demo.kleur }}
                    >
                      Offerte aanvragen →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Stappen */}
      <section className="bg-slate-50 px-5 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold">Zo werkt het</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {demo.stappen.map((s) => (
              <div key={s.stap} className="rounded-2xl bg-white p-6 text-center shadow-sm">
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: demo.kleur }}
                >
                  {s.stap}
                </span>
                <h3 className="mt-4 font-bold">{s.titel}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Over */}
      <section id="over" className="scroll-mt-28 px-5 py-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-bold">Over {demo.bedrijf}</h2>
            <p className="mt-4 leading-relaxed text-slate-600">{demo.over}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Werkgebied</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {demo.werkgebied.map((w) => (
                <span key={w} className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm">
                  {w}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="scroll-mt-28 bg-slate-50 px-5 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold">Wat klanten zeggen</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {demo.reviews.map((r) => (
              <blockquote key={r.naam} className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-amber-500" aria-hidden>
                  {"★".repeat(r.sterren)}
                </p>
                <p className="mt-3 flex-1 text-slate-600">&ldquo;{r.tekst}&rdquo;</p>
                <footer className="mt-4 border-t border-slate-100 pt-4 text-sm font-semibold text-slate-800">
                  {r.naam} · {r.plaats}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-28 px-5 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold">Veelgestelde vragen</h2>
          <dl className="mt-8 space-y-6">
            {demo.faq.map((item) => (
              <div key={item.v} className="rounded-xl border border-slate-200 p-5">
                <dt className="font-semibold text-slate-900">{item.v}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-slate-600">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-16 text-center text-white sm:px-6" style={{ backgroundColor: demo.kleur }}>
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold sm:text-3xl">Klaar voor een vrijblijvende offerte?</h2>
          <p className="mt-3 text-white/90">Bel of app ons — reactie binnen 24 uur.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={waOfferte}
              className="rounded-full bg-white px-8 py-3.5 font-bold text-slate-900 shadow-lg transition hover:bg-emerald-50"
            >
              WhatsApp
            </a>
            <a
              href={`tel:${demo.telefoonTel}`}
              className="rounded-full border-2 border-white/40 px-8 py-3.5 font-semibold hover:bg-white/10"
            >
              {demo.telefoon}
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 px-5 py-10 text-center text-xs text-slate-500 sm:px-6">
        <p>
          {demo.bedrijf} · {demo.email} · {demo.regio}
        </p>
        <p className="mt-2">
          Voorbeeldsite door{" "}
          <Link href="/" className="font-medium text-emerald-600 hover:underline">
            {brand.name}
          </Link>
        </p>
      </footer>

      {/* Mobiele sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 p-3 backdrop-blur-md md:hidden">
        <a
          href={waOfferte}
          className="flex w-full items-center justify-center rounded-full py-3.5 text-sm font-bold text-white shadow-lg"
          style={{ backgroundColor: demo.kleur }}
        >
          WhatsApp — offerte aanvragen
        </a>
      </div>
      <div className="h-20 md:hidden" aria-hidden />
    </div>
  );
}