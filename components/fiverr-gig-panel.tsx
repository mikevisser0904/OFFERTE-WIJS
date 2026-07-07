"use client";

import { useState } from "react";
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
} from "@/data/fiverr-gig";

const tabs = ["Setup", "Packages", "Berichten", "Profiel"] as const;
type Tab = (typeof tabs)[number];

export function FiverrGigPanel() {
  const [tab, setTab] = useState<Tab>("Setup");

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
          <Link href="/marktplaats/" className="text-sm text-emerald-300 hover:underline">
            Malt / Marktplaats
          </Link>
        </>
      )}
    </div>
  );
}