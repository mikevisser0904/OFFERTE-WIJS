/**
 * Wat telt voor dagelijks geld vs achtergrond.
 * Scripts/pipelines blijven in package.json — alleen UI wordt gericht.
 */

export const focusHoog = [
  { href: "/dashboard/", label: "Werkblad", waarom: "Eén startpunt + manager-actie" },
  { href: "/actie/", label: "Actie", waarom: "WhatsApp + dienstenmenu, 5/5" },
  { href: "/diensten/", label: "Internetdiensten", waarom: "12 producten, vaste prijs" },
  { href: "/verkoop/", label: "Verkoopkit", waarom: "Scripts, bezwaren, mail" },
  { href: "/listings/", label: "Listings", waarom: "Fiverr + Marktplaats copy" },
  { href: "/show/", label: "Show", waarom: "2-min rondleiding" },
  { href: "/start/", label: "Google Start", waarom: "€299 klantlink" },
  { href: "/spoed/", label: "Spoed €50", waarom: "1 uur, warm netwerk" },
  { href: "/", label: "Webshop", waarom: "Bestellen live" },
  { href: "/monitor/", label: "Monitor", waarom: "KPI + verkoopladder" },
  { href: "/ideeen/", label: "Ideeën", waarom: "Mike + Maarten backlog" },
] as const;

export const focusAchtergrond = [
  { href: "/tools/", label: "Tools", waarom: "Leads, VakScan, agents" },
  { href: "/land/", label: "SEO landingen", waarom: "Traffic + SEO Starter product" },
  { href: "/demo/", label: "Vakman-demo", waarom: "Voorbeeld site De Zonmeester" },
] as const;

export const focusLaagUi = [
  { href: "/visie/", label: "Groot plan", waarom: "Fase 2+ — via Tools" },
  { href: "/configurator/", label: "Configurator", waarom: "Redirect werkblad" },
  { href: "/webklaar/", label: "Over DoekoeWijs", waarom: "Teampagina" },
] as const;