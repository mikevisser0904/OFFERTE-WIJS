import type { DashboardRoute } from "@/components/dashboard-shell";

export function goudTargetVoorHref(href: DashboardRoute | string): string | undefined {
  const map: Record<string, string> = {
    "/dashboard/": "dashboard",
    "/visie/": "visie",
    "/leads/": "leads",
    "/scan/": "scan",
    "/agents/": "agents",
    "/monitor/": "monitor",
    "/": "webshop",
    "/actie/": "actie",
    "/verkoop/": "verkoop",
    "/fiverr/": "fiverr",
    "/marktplaats/": "listings",
    "/ideeen/": "ideeen",
    "/configurator/": "configurator",
  };
  return map[href];
}

export function isGoudNavItem(href: string): boolean {
  return goudTargetVoorHref(href) !== undefined;
}