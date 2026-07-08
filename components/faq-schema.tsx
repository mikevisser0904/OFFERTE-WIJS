import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";
import { betalingStandaard, diensten, webklaar } from "@/data/diensten-online";

const faqs = [
  {
    q: "Wat zijn internetdiensten bij DoekoeWijs?",
    a: "Vaste-prijs pakketten: online zichtbaarheid (SEO, Google, listings), websites, automatisering, AI en onderhoud — van €50 spoed tot €899 site.",
  },
  {
    q: "Wat kost een website of Google-pakket?",
    a: "SEO Starter €199, Google Start €299, Landing Snel €349, Vakman Website €899. Alle prijzen op de dienstenpagina.",
  },
  {
    q: "Hoe snel is levering?",
    a: "Spoed €50 vaak vandaag (1 uur). Google Start en SEO Starter in 2–3 werkdagen. Volledige site in 3 werkdagen na uw content.",
  },
  {
    q: "Voor wie is DoekoeWijs?",
    a: "ZZP en mkb — installateurs en vakbedrijven zijn onze specialiteit, hetzelfde tempo geldt voor elk bedrijf.",
  },
  {
    q: "Hoe bestel ik?",
    a: `Online via het bestelformulier per dienst. ${betalingStandaard}`,
  },
  {
    q: "Is hosting inbegrepen?",
    a: "Bij de Vakman Website: 1 jaar hosting inbegrepen. Onderhoud optioneel €49/maand.",
  },
  {
    q: "Wat is het snelst te bestellen?",
    a: "Op de homepage: Google Start €299, SEO Starter €199 of Vakman Website €899. Spoed €50 en Listings €149 staan eronder als snelle opties.",
  },
  {
    q: "Werken jullie alleen voor vakmannen?",
    a: "Nee — zzp en mkb in heel Nederland. Vakbedrijven zijn onze specialiteit; hetzelfde tempo en prijzen gelden voor elk bedrijf.",
  },
];

export function FaqSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const instap = diensten.filter((d) =>
    ["spoed-hulp", "seo-starter", "google-start", "listings-setup"].includes(d.slug)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <section className="border-t border-slate-100 bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold">Veelgestelde vragen</h2>
          <div className="mt-8 space-y-6">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-bold text-slate-900">{f.q}</h3>
                <p className="mt-2 text-slate-600">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-xl border border-emerald-100 bg-white p-5">
            <p className="text-sm font-semibold text-slate-800">Instap-pakketten</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {instap.map((d) => (
                <li key={d.slug}>
                  <Link href={`/diensten/${d.slug}/`} className="text-emerald-600 hover:underline">
                    {d.naam} {d.prijs}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-8 text-sm text-slate-500">
            <Link href="/diensten/" className="text-emerald-600 hover:underline">
              Alle {diensten.length} diensten →
            </Link>
            {" · "}
            <a href={absoluteUrl("/bestellen/")} className="text-emerald-600 hover:underline">
              Bestellen
            </a>
          </p>
          <p className="mt-2 text-xs text-slate-400">{webklaar.tagline}</p>
        </div>
      </section>
    </>
  );
}