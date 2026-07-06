import Link from "next/link";

export default function WebKlaarLegacy() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white text-slate-900">
      <p>WebKlaar is verhuisd naar de homepage.</p>
      <Link href="/" className="rounded-full bg-teal-600 px-6 py-3 font-bold text-white">
        Naar webshop →
      </Link>
    </div>
  );
}