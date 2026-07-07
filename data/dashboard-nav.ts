export type NavItem = { href: string; label: string; icon: string };

/** Dagelijks werk — sidebar bovenaan */
export const navVerkopen: NavItem[] = [
  { href: "/dashboard/", label: "Werkblad", icon: "▦" },
  { href: "/actie/", label: "Actie", icon: "→" },
  { href: "/listings/", label: "Listings", icon: "⊕" },
  { href: "/verkoop/", label: "Verkoop", icon: "€" },
  { href: "/", label: "Webshop", icon: "🛒" },
];

export const navBeheer: NavItem[] = [
  { href: "/monitor/", label: "Monitor", icon: "◉" },
  { href: "/ideeen/", label: "Ideeën", icon: "◎" },
];

export const navTools: NavItem[] = [{ href: "/tools/", label: "Tools", icon: "⚙" }];

export const dashboardQuickLinks = [
  { href: "/actie/", label: "Vandaag geld", sub: "WhatsApp + warm netwerk", accent: "amber" as const },
  { href: "/spoed/", label: "Spoed €50", sub: "1 uur hulp", accent: "amber" as const },
  { href: "/start/", label: "Google Start", sub: "€299 klantlink", accent: "emerald" as const },
  { href: "/listings/", label: "Listings", sub: "Fiverr + Marktplaats", accent: "violet" as const },
  { href: "/", label: "Webshop", sub: "Bestellingen", accent: "emerald" as const },
  { href: "/monitor/", label: "KPI", sub: "Slagingskans", accent: "sky" as const },
] as const;

export const defaultMikeActie =
  "Werkblad: /actie/ (warm netwerk) · /listings/ · klantlink /start/";