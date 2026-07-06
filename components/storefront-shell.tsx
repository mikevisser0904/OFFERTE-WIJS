import Link from "next/link";
import { webklaar } from "@/data/diensten-online";

const nav = [
  { href: "/", label: "Home" },
  { href: "/diensten/", label: "Diensten" },
  { href: "/demo/", label: "Demo" },
  { href: "/bestellen/", label: "Bestellen" },
] as const;

export function StorefrontShell({
  children,
  cta = true,
}: {
  children: React.ReactNode;
  cta?: boolean;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Web<span className="text-emerald-600">Klaar</span>
          </Link>
          <nav className="hidden items-center gap-6 sm:flex">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/bestellen/"
              className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              Bestel nu
            </Link>
          </nav>
          <Link
            href="/bestellen/"
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white sm:hidden"
          >
            Bestel
          </Link>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <p className="font-bold">{webklaar.naam}</p>
              <p className="mt-2 text-sm text-slate-500">{webklaar.sub}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Diensten</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-500">
                <li>
                  <Link href="/diensten/vakman-site/" className="hover:text-emerald-600">
                    Vakman Website €899
                  </Link>
                </li>
                <li>
                  <Link href="/diensten/google-start/" className="hover:text-emerald-600">
                    Google Start €299
                  </Link>
                </li>
                <li>
                  <Link href="/diensten/" className="hover:text-emerald-600">
                    Alle diensten →
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold">Contact</p>
              <p className="mt-2 text-sm text-slate-500">
                Mike Visser + Maarten
              </p>
              <a
                href={`https://wa.me/${webklaar.whatsapp}`}
                className="mt-2 block text-sm text-emerald-600 hover:underline"
              >
                WhatsApp {webklaar.telefoonDisplay}
              </a>
              <a
                href={`mailto:${webklaar.email}`}
                className="block text-sm text-emerald-600 hover:underline"
              >
                {webklaar.email}
              </a>
              <Link
                href="/dashboard/"
                className="mt-3 inline-block text-xs text-slate-400 hover:text-slate-600"
              >
                Team dashboard →
              </Link>
            </div>
          </div>
          <p className="mt-10 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} WebKlaar · {webklaar.url}
          </p>
        </div>
      </footer>

      {cta && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white p-3 sm:hidden">
          <Link
            href="/bestellen/"
            className="block rounded-full bg-emerald-600 py-3 text-center text-sm font-bold text-white"
          >
            Bestel een dienst →
          </Link>
        </div>
      )}
    </div>
  );
}