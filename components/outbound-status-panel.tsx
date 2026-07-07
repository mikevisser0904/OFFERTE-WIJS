"use client";

import { useCallback, useEffect, useState } from "react";
import { publicAssetUrl } from "@/lib/github-pages-base";

type OutboundStatus = {
  updatedAt: string;
  live: boolean;
  gepland: number;
  verwerkt: number;
  verzonden: number;
  gesimuleerd: number;
  mislukt: number;
  agentPrompt?: string;
  items?: { bedrijf: string; status: string; email?: string; phone?: string }[];
};

export function OutboundStatusPanel() {
  const [st, setSt] = useState<OutboundStatus | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch(publicAssetUrl("/outbound-status.json"), { cache: "no-store" });
      if (r.ok) setSt(await r.json());
    } catch {
      setSt(null);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className="rounded-2xl border border-sky-400/30 bg-sky-500/10 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-sky-200/80">Outbound auto</p>
          <h2 className="text-lg font-bold text-white">
            {st ? (
              <>
                {st.live ? "LIVE" : "Dry-run"} · {st.verzonden} verzonden / {st.verwerkt} verwerkt
              </>
            ) : (
              "Nog geen run"
            )}
          </h2>
          <p className="mt-1 text-sm text-white/55">{st?.agentPrompt ?? "npm run agent:outbound-auto"}</p>
        </div>
        <button type="button" onClick={() => void load()} className="text-xs text-sky-300 hover:underline">
          Vernieuwen
        </button>
      </div>
      {st?.items?.length ? (
        <ul className="mt-3 space-y-1 text-xs text-white/70">
          {st.items.map((i) => (
            <li key={i.bedrijf}>
              {i.bedrijf} — <span className="text-sky-200">{i.status}</span>
              {i.email ? ` · ${i.email}` : i.phone ? ` · ${i.phone}` : ""}
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-3 font-mono text-[10px] text-white/40">
        Live: GitHub Secrets OUTBOUND_LIVE + RESEND_API_KEY · docs/OUTBOUND-AUTO.md
      </p>
    </section>
  );
}