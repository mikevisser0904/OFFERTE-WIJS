import Link from "next/link";

export default function ConfiguratorPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white px-6 py-4">
        <Link href="/" className="font-bold text-slate-600 hover:text-slate-900">
          ← OfferteWijs
        </Link>
      </header>
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-3xl font-bold">Configurator (MVP)</h1>
        <p className="mt-4 text-slate-600">
          Hier komt de offerte-flow — hergebruik logica uit ZonComfort.
        </p>
        <ul className="mt-8 space-y-2 text-left text-sm text-slate-600">
          <li>1. Bedrijfsgegevens</li>
          <li>2. Product + maten</li>
          <li>3. Prijs + PDF</li>
        </ul>
        <p className="mt-10 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Volgende stap:</strong> kopieer <code>lib/pricing.ts</code> en{" "}
          <code>data/products.ts</code> uit MIKE-AND-MAARTEN en pas aan.
        </p>
      </main>
    </div>
  );
}