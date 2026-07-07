/**
 * Wat telt voor dagelijks geld vs achtergrond.
 * Scripts/pipelines blijven in package.json — alleen UI wordt gericht.
 */

export const focusHoog = [
  { href: "/dashboard/", label: "Werkblad", waarom: "Eén startpunt + manager-actie" },
  { href: "/actie/", label: "Actie", waarom: "Warm netwerk, WhatsApp, doel 5+1" },
  { href: "/listings/", label: "Listings", waarom: "Fiverr + Marktplaats copy-paste" },
  { href: "/verkoop/", label: "Verkoopkit", waarom: "Scripts, bezwaren, mail" },
  { href: "/start/", label: "Google Start", waarom: "€299 klantlink" },
  { href: "/spoed/", label: "Spoed €50", waarom: "Snelle hulp, warm netwerk" },
  { href: "/", label: "Webshop", waarom: "Bestellen live" },
  { href: "/monitor/", label: "Monitor", waarom: "KPI + GSC" },
  { href: "/ideeen/", label: "Ideeën", waarom: "Mike + Maarten backlog" },
] as const;

/** Achtergrond / alleen bij VAKSCAN_SALES of lokaal npm */
export const focusAchtergrond = [
  { href: "/tools/", label: "Tools", waarom: "Leads, VakScan, agents — niet dagelijks" },
  { href: "/land/", label: "SEO landingen", waarom: "Traffic traag, cron vult pool" },
] as const;

/** Uit navigatie; URL blijft voor bookmarks/docs */
export const focusLaagUi = [
  { href: "/visie/", label: "Groot plan", waarom: "Fase 2+ — link alleen via Tools" },
  { href: "/configurator/", label: "Configurator", waarom: "Leeg MVP → redirect werkblad" },
] as const;