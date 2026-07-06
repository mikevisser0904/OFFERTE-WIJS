import Link from "next/link";

const ideas = [
  {
    title: "OfferteWijs",
    star: true,
    desc: "Offerte in 2 minuten voor vakbedrijven (zonwering, kozijnen, schilders).",
    why: "Configurator + prijzen + UI al gedaan bij ZonComfort.",
    money: "SaaS €29/maand per bedrijf.",
    mike: "product, prijslogica",
    maarten: "UI, flows, deploy",
  },
  {
    title: "KlusBoard Web",
    desc: "Webversie van Mikes renovatie-app — uren, materialen, planning.",
    why: "Mike heeft de app al; Maarten maakt dashboard.",
    money: "Freemium voor zzp'ers.",
    mike: "app-logica, domeinkennis",
    maarten: "web dashboard",
  },
  {
    title: "ZonScan",
    desc: "Foto van raam → AI schat maat + productadvies + prijsrange.",
    why: "Wow-factor, viral potentie.",
    money: "Leads verkopen aan installateurs.",
    mike: "producten/prijzen",
    maarten: "UI + AI-koppeling",
  },
  {
    title: "InstallateurKit",
    desc: "ZonComfort-site als template — ander bedrijf, zelfde motor.",
    why: "Eenmalig bouwen, meerdere keren verkopen.",
    money: "€499 eenmalig + hosting.",
    mike: "sales, onboarding",
    maarten: "thema/branding systeem",
  },
  {
    title: "Beslisser",
    desc: '"Moet ik dit wel/niet?" — renovatie, aankoop, klus.',
    why: "Mike had Expo-idee; web + app combo.",
    money: "Affiliate, premium tips.",
    mike: "beslislogica",
    maarten: "web + UX",
  },
];

export default function IdeeenPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Link href="/" className="font-bold text-white/70 hover:text-white">
          ← OfferteWijs
        </Link>
        <span className="text-xs text-white/50">Mike + Maarten</span>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-20">
        <h1 className="text-3xl font-bold">Projectideeën</h1>
        <p className="mt-3 text-white/65">
          Deel deze pagina met Maarten — zelfde URL op jullie telefoons en laptops.
        </p>

        <div className="mt-10 space-y-6">
          {ideas.map((idea) => (
            <article
              key={idea.title}
              className={`rounded-2xl border p-6 ${
                idea.star
                  ? "border-amber-400/50 bg-amber-400/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{idea.title}</h2>
                {idea.star && (
                  <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-slate-900">
                    aanbevolen
                  </span>
                )}
              </div>
              <p className="mt-2 text-white/80">{idea.desc}</p>
              <p className="mt-2 text-sm text-white/55">
                <strong>Waarom:</strong> {idea.why}
              </p>
              <p className="mt-1 text-sm text-emerald-400/90">
                <strong>Geld:</strong> {idea.money}
              </p>
              <p className="mt-3 text-xs text-white/45">
                Mike: {idea.mike} · Maarten: {idea.maarten}
              </p>
            </article>
          ))}
        </div>

        <section className="mt-12 rounded-2xl border border-sky-400/30 bg-sky-400/10 p-6">
          <h2 className="font-bold text-sky-300">MVP OfferteWijs (v0.1)</h2>
          <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-white/75">
            <li>Bedrijfsnaam + logo</li>
            <li>Product kiezen</li>
            <li>Maten + opties</li>
            <li>PDF-offerte of shareable link</li>
            <li>Dashboard openstaande offertes</li>
          </ol>
        </section>
      </main>
    </div>
  );
}