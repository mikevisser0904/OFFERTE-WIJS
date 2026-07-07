import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { CopyBlock } from "@/components/copy-block";
import { webklaar } from "@/data/diensten-online";
import {
  fiverrGigTitle,
  marktplaatsAdvertentie,
  marktplaatsTekst,
  marktplaatsTitel,
} from "@/data/fiverr-gig";

const maltProfiel = `DoekoeWijs — Websites voor vakmannen in 3 dagen

Wij bouwen moderne websites voor installateurs, zonwering en zzp'ers. Vaste prijs, geen bureau-tarieven.

Diensten:
• Vakman Website — €899 (3 dagen)
• Google Start — €299 (2 dagen)
• Digitale opruiming — €249
• Excel automatisering — €499

Demo: ${webklaar.demo}
Bestellen: ${webklaar.url}bestellen/`;

export default function MarktplaatsPage() {
  return (
    <DashboardShell
      active="/marktplaats/"
      title="Online verkopen"
      subtitle="Plak op Fiverr, Malt, LinkedIn — webshop staat al live"
    >
      <div className="mx-auto max-w-3xl space-y-8">
        <section className="rounded-2xl border border-emerald-400/25 bg-emerald-400/5 p-6">
          <p className="font-bold text-emerald-300">Webshop live</p>
          <p className="mt-2 text-sm text-white/60">
            Klanten kunnen al bestellen op{" "}
            <Link href="/" className="text-emerald-400 underline">
              homepage
            </Link>
            . Deze listings zijn extra kanalen.
          </p>
        </section>

        <section className="rounded-xl border border-violet-400/25 bg-violet-400/5 p-5">
          <p className="font-bold text-violet-200">Fiverr + Marktplaats</p>
          <p className="mt-2 text-sm text-white/60">
            Alles op{" "}
            <Link href="/fiverr/" className="font-semibold text-violet-300 hover:underline">
              /fiverr/
            </Link>{" "}
            (tab Marktplaats). Fiverr: {fiverrGigTitle}
          </p>
        </section>
        <CopyBlock label="Marktplaats — titel" tekst={marktplaatsTitel} />
        <CopyBlock label="Marktplaats — omschrijving" tekst={marktplaatsTekst} />
        <CopyBlock label="Marktplaats — alles in één" tekst={marktplaatsAdvertentie} />
        <CopyBlock label="Malt profiel (Nederlands)" tekst={maltProfiel} />

        <section className="rounded-xl border border-white/8 p-5 text-sm text-white/55">
          <p className="font-bold text-white/80">Plaatsen (1× per platform)</p>
          <ul className="mt-3 space-y-2">
            <li>· Fiverr.com → Create Gig → plak tekst</li>
            <li>· Malt.nl → Word freelancer → plak profiel</li>
            <li>· LinkedIn post → link naar {webklaar.url}</li>
            <li>· Google Search Console → sitemap indienen</li>
          </ul>
        </section>
      </div>
    </DashboardShell>
  );
}