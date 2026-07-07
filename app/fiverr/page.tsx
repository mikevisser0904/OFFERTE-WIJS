import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { CopyBlock } from "@/components/copy-block";
import {
  fiverrBuyerRequirements,
  fiverrDescription,
  fiverrFaqs,
  fiverrGigTitle,
  fiverrPackages,
  fiverrPortfolioUrl,
  fiverrSetupSteps,
  fiverrTags,
  fiverrThumbnailHeadline,
} from "@/data/fiverr-gig";

export const metadata = {
  title: "Fiverr gig — WebKlaar",
  description: "Copy-paste Fiverr gig setup — $199 starter package.",
};

export default function FiverrPage() {
  const packagesText = fiverrPackages
    .map(
      (p) =>
        `${p.tier}: $${p.priceUsd} — ${p.pages} pages, ${p.revisions} revision(s), ${p.deliveryDays} days — ${p.extra}`,
    )
    .join("\n");

  const faqText = fiverrFaqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n");

  return (
    <DashboardShell
      active="/fiverr/"
      title="Fiverr gig"
      subtitle="Alles copy-paste — daarna Publish op fiverr.com"
    >
      <div className="mx-auto max-w-3xl space-y-8">
        <section className="rounded-2xl border border-violet-400/25 bg-violet-400/5 p-5">
          <p className="text-sm font-bold text-violet-200">Stappen</p>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-white/70">
            {fiverrSetupSteps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <p className="mt-4 text-sm">
            <a
              href="https://www.fiverr.com/start_selling"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-violet-300 hover:underline"
            >
              Open Fiverr Seller →
            </a>
            {" · "}
            <a href={fiverrPortfolioUrl} target="_blank" rel="noreferrer" className="text-emerald-300 hover:underline">
              Demo portfolio
            </a>
          </p>
        </section>

        <CopyBlock label="Gig title" tekst={fiverrGigTitle} />
        <CopyBlock label="Tags (één per regel in Fiverr)" tekst={fiverrTags.join("\n")} />
        <CopyBlock label="Description" tekst={fiverrDescription} />
        <CopyBlock label="Packages (handmatig in Fiverr UI)" tekst={packagesText} />
        <CopyBlock label="FAQ (3x)" tekst={faqText} />
        <CopyBlock label="Buyer requirements" tekst={fiverrBuyerRequirements} />
        <CopyBlock label="Thumbnail tekst (Canva)" tekst={fiverrThumbnailHeadline} />

        <section className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 text-sm text-white/65">
          <p className="font-bold text-amber-200">Na eerste order</p>
          <p className="mt-2 font-mono text-xs text-white/55">
            npm run order:intake -- --bedrijf &quot;Client&quot; --kanaal fiverr --prijs 199 --email klant@mail.com
          </p>
          <Link href="/marktplaats/" className="mt-3 inline-block text-emerald-300 hover:underline">
            Marktplaats-tekst →
          </Link>
        </section>
      </div>
    </DashboardShell>
  );
}