"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CopyBlock } from "@/components/copy-block";
import {
  fiverrBuyerRequirements,
  fiverrCategoryHint,
  fiverrDescription,
  fiverrExtras,
  fiverrFaqs,
  fiverrGalleryShots,
  fiverrGigTitle,
  fiverrGigTitleVariants,
  fiverrMessages,
  fiverrPackageBlock,
  fiverrPackages,
  fiverrPortfolioUrl,
  fiverrSellerProfile,
  fiverrSellerUrl,
  fiverrSetupSteps,
  fiverrTags,
  fiverrThumbnailBullets,
  fiverrThumbnailHeadline,
  marktplaatsAdvertentie,
  marktplaatsTekst,
  marktplaatsTitel,
} from "@/data/fiverr-gig";

const tabs = ["Setup", "Packages", "Berichten", "Profiel", "Marktplaats"] as const;
type Tab = (typeof tabs)[number];

export function FiverrGigPanel({ initialTab }: { initialTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab ?? "Setup");

  useEffect(() => {
    if (initialTab) setTab(initialTab);
  }, [initialTab]);

  const faqText = fiverrFaqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n");
  const extrasText = fiverrExtras.map((e) => `${e.name}: +$${e.priceUsd} — ${e.note}`).join("\n");
  const galleryText = fiverrGalleryShots.map((g) => `${g.label} → ${g.url}`).join("\n");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              tab === t ? "bg-violet-500 text-white" : "border border-white/15 text-white/55 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <section className="rounded-2xl border border-violet-400/25 bg-violet-400/5 p-5 text-sm">
        <a href={fiverrSellerUrl} target="_blank" rel="noreferrer" className="text-violet-300 hover:underline">
          Fiverr seller
        </a>
        {" · "}
        <a href={fiverrPortfolioUrl} target="_blank" rel="noreferrer" className="text-emerald-300 hover:underline">
          Portfolio demo
        </a>
      </section>

      <section className="rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.06] p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Marktplaats</p>
        <p className="mt-1 text-sm text-white/55">
          Diensten en Vakmensen → Websites. Plak titel en omschrijving apart, of alles-in-één.
        </p>
        <div className="mt-4 space-y-4">
          <CopyBlock label="Titel" tekst={marktplaatsTitel} />
          <CopyBlock label="Omschrijving" tekst={marktplaatsTekst} />
          <CopyBlock label="Alles in één veld" tekst={marktplaatsAdvertentie} />
        </div>
        <button
          type="button"
          onClick={() => setTab("Marktplaats")}
          className="mt-3 text-xs text-emerald-300/80 hover:text-emerald-200 hover:underline"
        >
          Meer in tab Marktplaats →
        </button>
      </section>

      {tab === "Setup" && (
        <>
          <section className="rounded-xl border border-white/10 p-4 text-sm text-white/70">
            <ol className="list-decimal space-y-1 pl-5">
              {fiverrSetupSteps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-white/45">{fiverrCategoryHint}</p>
          </section>
          <CopyBlock label="Gig title" tekst={fiverrGigTitle} />
          <CopyBlock label="Titel-varianten" tekst={fiverrGigTitleVariants.join("\n")} />
          <CopyBlock label="Tags" tekst={fiverrTags.join("\n")} />
          <CopyBlock label="Description" tekst={fiverrDescription} />
          <CopyBlock label="FAQ" tekst={faqText} />
          <CopyBlock label="Buyer requirements" tekst={fiverrBuyerRequirements} />
          <CopyBlock label="Gig extras" tekst={extrasText} />
          <CopyBlock label="Gallery shots" tekst={galleryText} />
          <CopyBlock label="Thumbnail headline" tekst={fiverrThumbnailHeadline} />
          <CopyBlock label="Thumbnail bullets" tekst={fiverrThumbnailBullets.join("\n")} />
        </>
      )}

      {tab === "Packages" && (
        <>
          {fiverrPackages.map((p) => (
            <CopyBlock key={p.tier} label={`${p.tier} $${p.priceUsd}`} tekst={fiverrPackageBlock(p)} />
          ))}
        </>
      )}

      {tab === "Berichten" && (
        <>
          <CopyBlock label="Vóór order" tekst={fiverrMessages.inquiryReply} />
          <CopyBlock label="Na order" tekst={fiverrMessages.orderReceived} />
          <CopyBlock label="Oplevering" tekst={fiverrMessages.delivery} />
          <p className="font-mono text-xs text-white/50">
            npm run order:intake -- --bedrijf &quot;Client&quot; --kanaal fiverr --prijs 199
          </p>
        </>
      )}

      {tab === "Profiel" && (
        <>
          <CopyBlock label="Seller bio" tekst={fiverrSellerProfile} />
          <button
            type="button"
            onClick={() => setTab("Marktplaats")}
            className="text-sm text-emerald-300 hover:underline"
          >
            Marktplaats-tab →
          </button>
        </>
      )}

      {tab === "Marktplaats" && (
        <>
          <p className="text-sm text-white/55">
            Marktplaats: categorie <strong className="text-white/75">Diensten en Vakmensen → Websites</strong> (of
            vergelijkbaar). Plak titel in titelveld, tekst in omschrijving.
          </p>
          <CopyBlock label="Titel" tekst={marktplaatsTitel} />
          <CopyBlock label="Omschrijving" tekst={marktplaatsTekst} />
          <CopyBlock label="Alles in één (als één veld)" tekst={marktplaatsAdvertentie} />
          <p className="text-xs text-white/40">
            Na reactie:{" "}
            <code className="text-white/55">npm run order:intake -- --bedrijf &quot;…&quot; --kanaal marktplaats --prijs 349</code>
          </p>
        </>
      )}
    </div>
  );
}