import Link from "next/link";
import { betalingStandaard, webklaar } from "@/data/diensten-online";

type Variant = "light" | "dark";

export function TrustStrip({ variant = "light" }: { variant?: Variant }) {
  const isLight = variant === "light";
  return (
    <div
      className={`rounded-xl border p-4 text-sm ${
        isLight
          ? "border-slate-200 bg-slate-50 text-slate-700"
          : "border-white/10 bg-white/[0.03] text-white/70"
      }`}
    >
      <p className={isLight ? "font-semibold text-slate-900" : "font-semibold text-white/90"}>
        Vaste prijs · {webklaar.naam}
      </p>
      <p className="mt-2">{betalingStandaard}</p>
      <p className="mt-2 text-xs opacity-80">
        Reactie meestal dezelfde werkdag ·{" "}
        <a
          href={`https://wa.me/${webklaar.whatsapp}`}
          className={isLight ? "font-medium text-emerald-700 hover:underline" : "text-emerald-300 hover:underline"}
        >
          WhatsApp {webklaar.telefoonDisplay}
        </a>
        {" · "}
        <Link
          href="/show/"
          className={isLight ? "font-medium text-emerald-700 hover:underline" : "text-emerald-300 hover:underline"}
        >
          2-min show
        </Link>
      </p>
    </div>
  );
}