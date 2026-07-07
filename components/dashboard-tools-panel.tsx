"use client";

import { useState } from "react";
import Link from "next/link";
import { EchteKlantenPanel } from "@/components/echte-klanten-panel";
import { ToegangScanPanel } from "@/components/toegang-scan-panel";
import { RisicoPassiefPanel } from "@/components/risico-passief-panel";

export function DashboardToolsPanel() {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Tools</p>
          <p className="mt-1 font-bold">VakScan · klanten · risico</p>
          <p className="mt-1 text-sm text-white/45">Alleen nodig bij veiligheids-verkoop — standaard dicht</p>
        </div>
        <span className="text-white/50">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="space-y-6 border-t border-white/8 px-5 py-6">
          <div className="flex flex-wrap gap-2">
            <Link href="/agents/" className="rounded-full border border-white/15 px-4 py-1.5 text-xs text-white/70 hover:text-white">
              Agents hub →
            </Link>
            <Link href="/leads/" className="rounded-full border border-white/15 px-4 py-1.5 text-xs text-white/70 hover:text-white">
              Klanten DB →
            </Link>
            <Link href="/scan/" className="rounded-full border border-white/15 px-4 py-1.5 text-xs text-white/70 hover:text-white">
              VakScan →
            </Link>
          </div>
          <EchteKlantenPanel />
          <ToegangScanPanel />
          <RisicoPassiefPanel />
        </div>
      )}
    </section>
  );
}