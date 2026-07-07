import Link from "next/link";
import type { Metadata } from "next";
import { StorefrontShell } from "@/components/storefront-shell";
import { webklaar } from "@/data/diensten-online";
import { pageMetadata } from "@/lib/seo";
import { vandaagLinks } from "@/data/vandaag-geld";

export const metadata: Metadata = pageMetadata({
  title: "Google Start €299 — online in 2 dagen",
  description:
    "Google Business + one-pager + WhatsApp voor vakmannen. Vaste prijs €299. DoekoeWijs — direct aanvragen.",
  path: "/start",
  keywords: ["google business vakman", "website zzp snel", "google start pakket"],
});

const waIntro = `Hoi Mike, ik wil het Google Start pakket (€299). Bedrijf: `;

export default function StartPage() {
  return (
    <StorefrontShell>
      <section className="bg-gradient-to-b from-emerald-600 to-emerald-700 px-6 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-100">Vaste prijs</p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Google Start — €299</h1>
          <p className="mt-4 text-lg text-emerald-50">
            Google-profiel + one-pager + WhatsApp-knop. Live in <strong>2 werkdagen</strong> na uw gegevens.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/bestellen/?dienst=google-start"
              className="rounded-full bg-white px-8 py-4 text-base font-bold text-emerald-800 hover:bg-emerald-50"
            >
              Aanvragen (1 minuut) →
            </Link>
            <a
              href={`https://wa.me/${webklaar.whatsapp}?text=${encodeURIComponent(waIntro)}`}
              className="rounded-full border-2 border-white/80 px-8 py-4 text-base font-bold hover:bg-white/10"
            >
              WhatsApp Mike →
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-14">
        <ul className="space-y-4 text-slate-700">
          {[
            "Google Business volledig ingericht",
            "One-pager met telefoon & WhatsApp",
            "Review-template voor klanten",
            "Geen abonnement — eenmalig €299",
          ].map((b) => (
            <li key={b} className="flex gap-3 text-lg">
              <span className="text-emerald-600">✓</span>
              {b}
            </li>
          ))}
        </ul>
        <p className="mt-10 text-center text-sm text-slate-500">
          Demo volledige site:{" "}
          <Link href="/demo/" className="font-medium text-emerald-600 hover:underline">
            bekijk voorbeeld
          </Link>
        </p>
        <p className="mt-6 text-center font-mono text-xs text-slate-400">{vandaagLinks.googleStart}</p>
      </section>
    </StorefrontShell>
  );
}