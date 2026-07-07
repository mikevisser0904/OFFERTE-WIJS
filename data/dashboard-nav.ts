export type NavItem = { href: string; label: string; icon: string };

/** Dagelijks werk — sidebar bovenaan */
export const navVerkopen: NavItem[] = [
  { href: "/dashboard/", label: "Werkblad", icon: "▦" },
  { href: "/actie/", label: "Actie", icon: "→" },
  { href: "/verkoop/", label: "Verkoop", icon: "€" },
  { href: "/fiverr/", label: "Fiverr", icon: "◆" },
  { href: "/marktplaats/", label: "Listings", icon: "⊕" },
  { href: "/", label: "Webshop", icon: "🛒" },
];

export const navBeheer: NavItem[] = [
  { href: "/monitor/", label: "Monitor", icon: "◉" },
  { href: "/ideeen/", label: "Ideeën", icon: "◎" },
];

export const navTools: NavItem[] = [
  { href: "/leads/", label: "Klanten DB", icon: "◈" },
  { href: "/scan/", label: "VakScan", icon: "⛨" },
  { href: "/agents/", label: "Agents", icon: "◇" },
  { href: "/visie/", label: "Visie", icon: "✦" },
  { href: "/configurator/", label: "Configurator", icon: "⚙" },
];

export const dashboardQuickLinks = [
  { href: "/actie/", label: "Vandaag geld", sub: "WhatsApp + Marktplaats", accent: "amber" as const },
  { href: "/spoed/", label: "Spoed €50", sub: "1 uur hulp", accent: "amber" as const },
  { href: "/start/", label: "Google Start", sub: "€299 klantlink", accent: "emerald" as const },
  { href: "/fiverr/", label: "Fiverr gig", sub: "Copy plakken", accent: "violet" as const },
  { href: "/", label: "Webshop", sub: "Bestellingen", accent: "emerald" as const },
  { href: "/monitor/", label: "KPI", sub: "Slagingskans", accent: "sky" as const },
] as const;

export const defaultMikeActie =
  "Werkblad: /actie/ (warm netwerk) · /fiverr/ · klantlink /start/";