import { SITE_URL } from "@/lib/seo";

export const integrations = {
  uptimerobot: {
    email: "mikevisser0904@gmail.com",
    monitors: [
      `${SITE_URL}/`,
      `${SITE_URL}/bestellen/`,
      `${SITE_URL}/diensten/`,
      `${SITE_URL}/sitemap.xml`,
    ],
    status: "pending_activation" as const,
    actie: "Check inbox mikevisser0904@gmail.com → klik UptimeRobot activatielinks (4×)",
    dashboard: "https://dashboard.uptimerobot.com/",
  },
  googleSearchConsole: {
    property: SITE_URL,
    sitemap: `${SITE_URL}/sitemap.xml`,
    status: "html_file_ready" as const,
    stappen: [
      `Property URL-prefix: ${SITE_URL}`,
      "Verificatie → HTML-bestand → googlec6b9c20bff6e7f49.html (staat in public/, live na deploy)",
      "Klik Verifiëren in GSC",
      `Sitemaps → nieuwe sitemap: sitemap.xml`,
      "Optioneel meta-tag: GitHub Secret GOOGLE_SITE_VERIFICATION + rebuild",
    ],
    verifyFile: `${SITE_URL}googlec6b9c20bff6e7f49.html`,
    urls: {
      welcome: "https://search.google.com/search-console/welcome",
      sitemaps: `https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent(SITE_URL)}`,
    },
  },
  indexnow: {
    status: "active" as const,
    key: "webklaar2026indexnowkey",
    note: "Bing/Yandex indexering — draait bij elke deploy",
  },
  ntfy: {
    topic: "webklaar-mike",
    subscribe: "https://ntfy.sh/webklaar-mike",
    note: "Autopilot elke 4u + site-down + nieuwe bestellingen",
  },
  autopilot: {
    workflow: "https://github.com/mikevisser0904/OFFERTE-WIJS/actions/workflows/autopilot.yml",
    cron: "elke 4 uur",
    statusUrl: "/autopilot-status.json",
    note: "Health + wachtrij-sync + agent-prompt naar ntfy",
  },
  maartenIdeeen: {
    topic: "webklaar-maarten-ideeen",
    publish: "https://ntfy.sh/webklaar-maarten-ideeen",
    subscribe: "https://ntfy.sh/webklaar-maarten-ideeen",
    note: "Maarten deelt idee → goudzoeker mompelt + agent-wachtrij (sync elke 5 min)",
    voorbeeld: '€899 — site voor installateur X',
    wachtrij: "data/maarten-wachtrij.json",
    agentTrigger: "voer maarten wachtrij uit",
  },
};