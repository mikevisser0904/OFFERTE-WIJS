import { absoluteUrl } from "@/lib/seo";

const faqs = [
  {
    q: "Wat kost een website voor een vakman?",
    a: "Een volledige Vakman Website kost €899 eenmalig, inclusief 1 jaar hosting. Google Start pakket is €299.",
  },
  {
    q: "Hoe snel is mijn website live?",
    a: "Google Start in 2 werkdagen, volledige website in 3 werkdagen na aanlevering van logo en teksten.",
  },
  {
    q: "Voor welke bedrijven is DoekoeWijs bedoeld?",
    a: "Installateurs, zonwering, kozijnen, zzp'ers en andere vakbedrijven die online gevonden willen worden.",
  },
  {
    q: "Hoe bestel ik?",
    a: "Online via het bestelformulier. U betaalt bij oplevering — geen vooruitbetaling verplicht.",
  },
  {
    q: "Is hosting inbegrepen?",
    a: "Ja, bij de Vakman Website is 1 jaar hosting inbegrepen. Daarna optioneel €25/maand of verhuizing.",
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
          <p className="mt-8 text-sm text-slate-500">
            <a href={absoluteUrl("/bestellen/")} className="text-emerald-600 hover:underline">
              Bestelformulier →
            </a>
          </p>
        </div>
      </section>
    </>
  );
}