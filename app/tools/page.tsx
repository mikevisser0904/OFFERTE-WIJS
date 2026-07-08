import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { focusAchtergrond, focusHoog, focusLaagUi } from "@/data/site-focus";

const toolLinks = [
  {
    href: "/leads/",
    title: "Klanten DB",
    sub: "Export, scores, bellen — warme lijsten",
  },
  {
    href: "/scan/",
    title: "VakScan",
    sub: "Alleen met toestemming · lokaal npm run scan",
  },
  {
    href: "/agents/",
    title: "Agents",
    sub: "Lead hunter, outreach, status JSON",
  },
] as const;

export const metadata = {
  title: "Tools — DoekoeWijs",
  description: "Leads, VakScan en agents — niet dagelijkse verkoop.",
};

export default function ToolsPage() {
  return (
    <DashboardShell
      active="/tools/"
      title="Tools"
      subtitle="Achtergrond · scripts blijven in repo — UI alleen als je het nodig hebt"
    >
      <div className="mx-auto max-w-3xl space-y-8">
        <section className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5 text-sm text-white/65">
          <p className="font-bold text-emerald-200">Dagelijks geld — niet hier</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {focusHoog.slice(0, 6).map((f) => (
              <li key={f.href}>
                <Link href={f.href} className="font-medium text-emerald-300 hover:underline">
                  {f.label}
                </Link>
                <span className="text-white/40"> — {f.waarom}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="grid gap-4 sm:grid-cols-3">
          {toolLinks.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-emerald-400/30"
            >
              <p className="font-bold">{t.title}</p>
              <p className="mt-2 text-xs text-white/45">{t.sub}</p>
            </Link>
          ))}
        </div>

        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/35">Achtergrond</p>
          <ul className="mt-3 space-y-2 text-sm">
            {focusAchtergrond.map((f) => (
              <li key={f.href}>
                <Link href={f.href} className="text-sky-300 hover:underline">
                  {f.label}
                </Link>
                <span className="text-white/40"> — {f.waarom}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/35">Later / archief</p>
          <ul className="mt-3 space-y-2 text-sm">
            {focusLaagUi.map((f) => (
              <li key={f.href}>
                {f.href === "/configurator/" ? (
                  <span className="text-white/50">{f.label} (redirect werkblad)</span>
                ) : (
                  <Link href={f.href} className="text-white/60 hover:text-white hover:underline">
                    {f.label}
                  </Link>
                )}
                <span className="text-white/35"> — {f.waarom}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </DashboardShell>
  );
}