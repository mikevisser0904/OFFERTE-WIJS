export type NavItem = { href: string; label: string; icon: string };

/** Dagelijks werk — sidebar bovenaan */
export const navVerkopen: NavItem[] = [
  { href: "/dashboard/", label: "Werkblad", icon: "▦" },
  { href: "/actie/", label: "Actie", icon: "→" },
  { href: "/listings/", label: "Listings", icon: "⊕" },
  { href: "/verkoop/", label: "Verkoop", icon: "€" },
  { href: "/diensten/", label: "Catalogus", icon: "◇" },
  { href: "/", label: "Webshop", icon: "🛒" },
];

export const navBeheer: NavItem[] = [
  { href: "/monitor/", label: "Monitor", icon: "◉" },
  { href: "/ideeen/", label: "Ideeën", icon: "◎" },
];

export const navTools: NavItem[] = [{ href: "/tools/", label: "Tools", icon: "⚙" }];

export const dashboardQuickLinks = [
  { href: "/actie/", label: "Vandaag geld", sub: "Internetdiensten + WhatsApp", accent: "amber" as const },
  { href: "/spoed/", label: "Spoed €50", sub: "1 uur hulp", accent: "amber" as const },
  { href: "/start/", label: "Google Start", sub: "€299 klantlink", accent: "emerald" as const },
  { href: "/show/", label: "Show", sub: "2-min rondleiding", accent: "violet" as const },
  { href: "/listings/", label: "Listings", sub: "Fiverr + Marktplaats", accent: "violet" as const },
  { href: "/", label: "Webshop", sub: "Bestellingen", accent: "emerald" as const },
  { href: "/monitor/", label: "KPI", sub: "Slagingskans", accent: "sky" as const },
  { href: "/diensten/", label: "Catalogus", sub: "12 producten live", accent: "emerald" as const },
  { href: "/verkoop/", label: "Productmatrix", sub: "Pitch per SKU", accent: "violet" as const },
] as const;

export const defaultMikeActie =
  "Werkblad: /actie/ (dienstenmenu) · SEO €199 / Google €299 · /show/ delen";