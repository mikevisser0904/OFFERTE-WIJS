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
    status: "pending_verification" as const,
    stappen: [
      "Ga naar Search Console → URL-prefix property toevoegen",
      `Plak: ${SITE_URL}`,
      "Verificatie → HTML-tag → kopieer content= code",
      "GitHub repo → Settings → Secrets → GOOGLE_SITE_VERIFICATION → plak code",
      "Wacht op deploy (~1 min) → klik Verifiëren in GSC",
      `Sitemaps → voeg toe: sitemap.xml`,
    ],
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
    note: "Push bij site-down (GitHub Action)",
  },
};