import Link from "next/link";
import { DienstCard } from "@/components/internet-diensten-grid";
import { dienstenPerTier, tierLabels, type InstapTier } from "@/data/dienst-meta";

const order: InstapTier[] = ["vandaag", "deze-week", "project", "doorlopend", "op-verzoek"];

export function DienstenTierOverview() {
  const perTier = dienstenPerTier();

  return (
    <div className="mt-12 space-y-14">
      {order.map((tier) => {
        const items = perTier[tier];
        if (!items.length) return null;
        const { label, sub } = tierLabels[tier];
        return (
          <section key={tier} id={`tier-${tier}`} className="scroll-mt-24">
            <h2 className="text-xl font-bold text-slate-900">{label}</h2>
            <p className="mt-1 text-sm text-slate-500">{sub}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {items.map((d) => (
                <DienstCard key={d.slug} d={d} compact />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}