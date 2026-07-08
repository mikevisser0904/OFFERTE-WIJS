import Link from "next/link";
import type { Metadata } from "next";
import { StorefrontShell } from "@/components/storefront-shell";
import { betalingStandaard, getDienst, webklaar } from "@/data/diensten-online";
import { pageMetadata } from "@/lib/seo";
import { vandaagLinks } from "@/data/vandaag-geld";

const google = getDienst("google-start")!;

export const metadata: Metadata = pageMetadata({
  title: "Google Start €299 — online in 2 dagen",
  description:
    "Google Business + one-pager + WhatsApp. Onderdeel van DoekoeWijs internetdiensten. Vaste prijs €299.",
  path: "/start",
  keywords: ["google business", "google start pakket", "online zichtbaarheid zzp"],
});

const waIntro = `Hoi Mike, ik wil het Google Start pakket (€299). Bedrijf: `;

export default function StartPage() {
  return (
    <StorefrontShell>
      <section className="bg-gradient-to-b from-emerald-600 to-emerald-700 px-6 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-100">Internetdienst · vaste prijs</p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Google Start — €299</h1>
          <p className="mt-4 text-lg text-emerald-50">{google.korteOms}</p>
          <p className="mt-2 text-sm text-emerald-100/90">Live in {google.levertijd}</p>
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
          {google.bullets.map((b) => (
            <li key={b} className="flex gap-3 text-lg">
              <span className="text-emerald-600">✓</span>
              {b}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-slate-600">{betalingStandaard}</p>
        <div className="mt-10 rounded-xl border border-amber-100 bg-amber-50 p-5 text-sm text-amber-950">
          <p className="font-semibold">Kleinere stap?</p>
          <p className="mt-1">
            <Link href="/diensten/seo-starter/" className="font-medium text-emerald-700 hover:underline">
              SEO Starter €199
            </Link>
            {" · "}
            <Link href="/diensten/listings-setup/" className="font-medium text-emerald-700 hover:underline">
              Listings €149
            </Link>
          </p>
          <Link href="/diensten/" className="mt-3 inline-block font-medium text-emerald-700 hover:underline">
            Alle internetdiensten →
          </Link>
        </div>
        <p className="mt-8 text-center text-sm text-slate-500">
          Voorbeeld site:{" "}
          <Link href="/demo/" className="font-medium text-emerald-600 hover:underline">
            De Zonmeester demo
          </Link>
          {" · "}
          <Link href={vandaagLinks.show} className="font-medium text-emerald-600 hover:underline">
            Show
          </Link>
        </p>
      </section>
    </StorefrontShell>
  );
}