"use client";

import Link from "next/link";
import { Goudzoeker } from "@/components/goudzoeker";
import { GOUZOEKER_ENABLED } from "@/lib/goudzoeker-config";
import { goudTargetVoorHref, isGoudNavItem } from "@/lib/goud-nav-target";
import { navBeheer, navTools, navVerkopen, type NavItem } from "@/data/dashboard-nav";
import { BrandLogo } from "@/components/brand-logo";
import { brand } from "@/data/brand";

export type DashboardRoute = NavItem["href"];

function NavLink({ item, active }: { item: NavItem; active: string }) {
  const isActive = active === item.href;
  return (
    <Link
      href={item.href}
      data-goud-target={goudTargetVoorHref(item.href)}
      data-goud-highlight={isGoudNavItem(item.href) ? "" : undefined}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
        isActive
          ? "bg-emerald-400/10 font-semibold text-emerald-300"
          : "text-white/55 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className="text-base opacity-70">{item.icon}</span>
      {item.label}
    </Link>
  );
}

function NavGroup({ label, items, active }: { label: string; items: NavItem[]; active: string }) {
  return (
    <div className="pt-2">
      <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-white/25">{label}</p>
      <div className="space-y-0.5">
        {items.map((item) => (
          <NavLink key={item.href} item={item} active={active} />
        ))}
      </div>
    </div>
  );
}

export function DashboardShell({
  children,
  active,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  active: DashboardRoute;
  title: string;
  subtitle?: string;
}) {
  const mobileNav = [...navVerkopen, ...navBeheer];

  return (
    <div className="min-h-screen bg-[var(--site-bg)] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.14),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(52,211,153,0.08),_transparent_45%)]" />

      <div className="relative flex min-h-screen">
        <aside className="hidden w-56 shrink-0 flex-col border-r border-emerald-400/10 bg-[var(--site-surface)]/90 backdrop-blur-xl lg:flex">
          <div className="border-b border-emerald-400/10 px-5 py-6">
            <BrandLogo href="/dashboard/" size="md" />
            <p className="mt-2 text-[11px] font-medium text-amber-400/90">{brand.motto}</p>
            <p className="mt-1 text-xs text-white/40">{brand.team}</p>
          </div>
          <nav className="flex-1 overflow-y-auto p-3">
            <NavGroup label="Verkopen" items={navVerkopen} active={active} />
            <NavGroup label="Beheer" items={navBeheer} active={active} />
            <NavGroup label="Tools" items={navTools} active={active} />
          </nav>
          <div className="border-t border-white/5 p-4">
            <p className="text-xs text-white/35">GitHub Pages</p>
            <p className="mt-1 truncate font-mono text-[10px] text-white/25">OFFERTE-WIJS</p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-emerald-400/10 bg-[var(--site-header)]/92 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
              <div>
                <h1 className="text-xl font-bold sm:text-2xl">{title}</h1>
                {subtitle && <p className="mt-0.5 text-sm text-white/45">{subtitle}</p>}
              </div>
              <Link
                href="/actie/"
                className="shrink-0 rounded-full bg-amber-400 px-4 py-2 text-xs font-bold text-slate-900 sm:text-sm"
              >
                Actie →
              </Link>
            </div>

            <nav className="flex gap-1 overflow-x-auto border-t border-white/5 px-4 py-2 lg:hidden">
              {mobileNav.map((item) => {
                const isActive = active === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition ${
                      isActive ? "bg-emerald-400/15 text-emerald-300" : "text-white/50 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
        </div>
      </div>
      {GOUZOEKER_ENABLED ? <Goudzoeker /> : null}
    </div>
  );
}