import { integrations } from "@/data/integrations";

export function IntegrationsPanel() {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold">Externe monitoring</h2>

      <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/5 p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="font-bold text-emerald-300">UptimeRobot</p>
          <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-xs text-amber-300">
            Activeer via e-mail
          </span>
        </div>
        <p className="mt-2 text-sm text-white/60">{integrations.uptimerobot.actie}</p>
        <ul className="mt-3 space-y-1 text-xs text-white/45">
          {integrations.uptimerobot.monitors.map((u) => (
            <li key={u}>· {u}</li>
          ))}
        </ul>
        <a
          href={integrations.uptimerobot.dashboard}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm text-emerald-400 hover:underline"
        >
          UptimeRobot dashboard →
        </a>
      </div>

      <div className="rounded-2xl border border-sky-400/25 bg-sky-400/5 p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="font-bold text-sky-300">Google Search Console</p>
          <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-xs text-amber-300">
            1 secret nodig
          </span>
        </div>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-white/60">
          {integrations.googleSearchConsole.stappen.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={integrations.googleSearchConsole.urls.welcome}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-sky-500 px-4 py-2 text-sm font-bold text-white"
          >
            Search Console openen →
          </a>
          <a
            href={integrations.googleSearchConsole.urls.sitemaps}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80"
          >
            Sitemap indienen →
          </a>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
          <p className="font-bold text-emerald-400">IndexNow ✓</p>
          <p className="mt-1 text-xs text-white/50">{integrations.indexnow.note}</p>
        </div>
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
          <p className="font-bold text-violet-400">ntfy push</p>
          <a
            href={integrations.ntfy.subscribe}
            className="mt-1 block text-xs text-violet-300 hover:underline"
          >
            Abonneer: {integrations.ntfy.subscribe}
          </a>
        </div>
        <div className="rounded-xl border border-sky-400/20 bg-sky-400/5 p-4 sm:col-span-2">
          <p className="font-bold text-sky-300">Maarten ideeën → goudzoeker</p>
          <p className="mt-1 text-xs text-white/50">{integrations.maartenIdeeen.note}</p>
          <p className="mt-2 font-mono text-[10px] text-white/40">
            Voorbeeld: {integrations.maartenIdeeen.voorbeeld}
          </p>
          <a
            href="/ideeen/"
            className="mt-2 inline-block text-xs font-semibold text-sky-300 hover:underline"
          >
            Deel op /ideeen/ →
          </a>
        </div>
      </div>
    </section>
  );
}