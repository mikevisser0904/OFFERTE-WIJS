import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { AutopilotPanel } from "@/components/autopilot-panel";
import { DashboardVandaag } from "@/components/dashboard-vandaag";
import { EchteKlantenPanel } from "@/components/echte-klanten-panel";
import { RisicoPassiefPanel } from "@/components/risico-passief-panel";
import { ToegangScanPanel } from "@/components/toegang-scan-panel";
import { MaartenWachtrijPanel } from "@/components/maarten-wachtrij-panel";
import { GoalTracker, GoalBreakdown, GoalMilestones } from "@/components/goal-tracker";
import { doelWekelijks, hoofddoel } from "@/data/doel";
import {
  getDashboardStats,
  aanbeveling,
  spoorMeta,
  categoryMeta,
  spoorOrder,
} from "@/lib/dashboard";
import { hostingOpties, hostingAdvies } from "@/data/hosting";
import { seoLandingen } from "@/data/seo-landingen";

const stats = getDashboardStats();

function StatCard({
  label,
  value,
  sub,
  accent = "emerald",
}: {
  label: string;
  value: string;
  sub: string;
  accent?: "emerald" | "amber" | "sky" | "rose";
}) {
  const colors = {
    emerald: { box: "border-emerald-400/20 bg-emerald-400/5", value: "text-emerald-300" },
    amber: { box: "border-amber-400/20 bg-amber-400/5", value: "text-amber-300" },
    sky: { box: "border-sky-400/20 bg-sky-400/5", value: "text-sky-300" },
    rose: { box: "border-rose-400/20 bg-rose-400/5", value: "text-rose-300" },
  };

  return (
    <div className={`rounded-2xl border p-5 ${colors[accent].box}`}>
      <p className="text-xs font-medium uppercase tracking-wider text-white/40">{label}</p>
      <p className={`mt-2 text-2xl font-bold sm:text-3xl ${colors[accent].value}`}>{value}</p>
      <p className="mt-1 text-xs text-white/45">{sub}</p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardShell
      active="/dashboard/"
      title="Geld Dashboard"
      subtitle={`Eerste doel: ${hoofddoel.label} in ${hoofddoel.deadline}`}
    >
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-2xl border border-violet-400/40 bg-gradient-to-r from-violet-500/15 to-emerald-500/10 p-6 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-300">Groots bouwen</p>
            <h2 className="mt-2 text-xl font-bold">Agent-machine + VakScan = schaal</h2>
            <p className="mt-1 text-sm text-white/55">Fase 1 nu: leads, scan, outreach. Roadmap tot platform.</p>
          </div>
          <Link
            href="/visie/"
            className="mt-4 inline-flex shrink-0 rounded-full bg-violet-500 px-8 py-3 font-bold text-white hover:bg-violet-400 sm:mt-0"
          >
            Groot plan →
          </Link>
        </section>

        <EchteKlantenPanel />
        <ToegangScanPanel />
        <RisicoPassiefPanel />
        <AutopilotPanel />
        <DashboardVandaag />
        <MaartenWachtrijPanel />

        <section className="rounded-2xl border border-violet-400/30 bg-violet-400/[0.07] p-6 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">
              KPI & slagingskans
            </p>
            <h2 className="mt-2 text-xl font-bold">Monitor bijwerken</h2>
            <p className="mt-1 text-sm text-white/55">
              Omzet en contacten — autopilot leest dit voor agent-tips.
            </p>
          </div>
          <Link
            href="/monitor/"
            className="mt-4 inline-flex shrink-0 rounded-full bg-violet-400 px-8 py-3 font-bold text-slate-900 hover:bg-violet-300 sm:mt-0"
          >
            Open monitor →
          </Link>
        </section>

        <section className="rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.07] p-6 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Webwinkel live
            </p>
            <h2 className="mt-2 text-xl font-bold">WebKlaar verkoopt online</h2>
            <p className="mt-1 text-sm text-white/55">
              Klanten bestellen op de homepage. Jij bouwt na bestelling.
            </p>
          </div>
          <Link
            href="/"
            className="mt-4 inline-flex shrink-0 rounded-full bg-emerald-400 px-6 py-3 font-bold text-slate-900 hover:bg-emerald-300 sm:mt-0"
          >
            Naar webshop →
          </Link>
        </section>

        <section className="rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.07] p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Alles klaar — jij klikt alleen Verstuur
            </p>
            <h2 className="mt-2 text-xl font-bold">Actie-pagina</h2>
            <p className="mt-1 text-sm text-white/55">
              Plak 5 nummers → WhatsApp opent met bericht + demo-link.
            </p>
          </div>
          <Link
            href="/actie/"
            className="mt-4 inline-flex shrink-0 rounded-full bg-emerald-400 px-8 py-3 font-bold text-slate-900 hover:bg-emerald-300 sm:mt-0"
          >
            Naar actie →
          </Link>
        </section>

        <GoalTracker />
        <GoalMilestones />
        <GoalBreakdown />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Week 1–2 target" value="€1.500" sub="Eerste mijlpaal" accent="emerald" />
          <StatCard
            label="Ideeën actief"
            value={String(stats.actiefIdeeën)}
            sub={`${stats.dezeWeek} deze week · ${stats.dezeMaand} deze maand`}
            accent="amber"
          />
          <StatCard
            label="Top score"
            value={`${stats.topScore}/25`}
            sub={stats.topIdea?.title ?? "—"}
            accent="sky"
          />
          <StatCard label="Sporen" value="5" sub="Verkopen · uren · netwerk" accent="rose" />
        </section>

        <section>
          <h2 className="mb-4 text-lg font-bold">Hosting — goedkoopste optie</h2>
          <p className="mb-4 text-sm text-emerald-400">{hostingAdvies}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {hostingOpties.map((h) => (
              <div
                key={h.naam}
                className={`rounded-xl border p-4 ${h.aanbevolen ? "border-emerald-400/30 bg-emerald-400/5" : "border-white/8 bg-white/[0.02]"}`}
              >
                <p className="font-bold">{h.naam}</p>
                <p className="font-mono text-sm text-emerald-400">{h.prijs}</p>
                <p className="mt-2 text-xs text-white/55">{h.waarom}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-bold">SEO — {seoLandingen.length} landingspagina&apos;s live</h2>
          <p className="text-sm text-white/55">
            Sitemap: /sitemap.xml · robots.txt · FAQ schema · JSON-LD · llms.txt
          </p>
          <p className="mt-2 text-xs text-white/40">
            Volgende stap: Google Search Console → sitemap indienen → eventueel domein webklaar.nl (~€10/jaar)
          </p>
        </section>

        <section className="flex flex-wrap gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-5">
          <Link href="/verkoop/" className="rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-900">
            Verkoopkit
          </Link>
          <Link href="/ideeen/" className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-900">
            Ideeën
          </Link>
          <Link href="/" className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/80">
            Webshop
          </Link>
        </section>
      </div>
    </DashboardShell>
  );
}