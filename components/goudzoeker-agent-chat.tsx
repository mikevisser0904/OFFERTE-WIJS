"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { laadKpi, STORAGE_KEY } from "@/lib/goudzoeker";
import { MaartenIdeeDeel } from "@/components/maarten-idee-deel";
import { GoudzoekerAvatarMini } from "@/components/goudzoeker-art";
import {
  beantwoord,
  bouwAgentContext,
  snelleVragen,
  userBericht,
  welkomBericht,
  type AgentBericht,
  type AgentContext,
} from "@/lib/goudzoeker-agent";

type Props = {
  open: boolean;
  onClose: () => void;
};

function BerichtTekst({ tekst }: { tekst: string }) {
  const delen = tekst.split(/(\*\*[^*]+\*\*|_[^_]+_)/g);

  return (
    <p className="whitespace-pre-wrap text-sm leading-relaxed">
      {delen.map((deel, i) => {
        if (deel.startsWith("**") && deel.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-amber-200">
              {deel.slice(2, -2)}
            </strong>
          );
        }
        if (deel.startsWith("_") && deel.endsWith("_")) {
          return (
            <em key={i} className="text-white/50">
              {deel.slice(1, -1)}
            </em>
          );
        }
        return <span key={i}>{deel}</span>;
      })}
    </p>
  );
}

export function GoudzoekerAgentChat({ open, onClose }: Props) {
  const [ctx, setCtx] = useState<AgentContext | null>(null);
  const [berichten, setBerichten] = useState<AgentBericht[]>([]);
  const [invoer, setInvoer] = useState("");
  const [kopieFeedback, setKopieFeedback] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const ververs = useCallback(() => {
    const nieuwCtx = bouwAgentContext(laadKpi());
    setCtx(nieuwCtx);
    return nieuwCtx;
  }, []);

  useEffect(() => {
    if (!open) return;
    const nieuwCtx = ververs();
    setBerichten([welkomBericht(nieuwCtx)]);
    setInvoer("");
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [open, ververs]);

  useEffect(() => {
    if (!open) return;

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) ververs();
    };
    window.addEventListener("storage", onStorage);

    const interval = setInterval(ververs, 8000);

    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
    };
  }, [open, ververs]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [berichten]);

  function stuur(vraag: string) {
    const trimmed = vraag.trim();
    if (!trimmed || !ctx) return;

    setBerichten((prev) => {
      const ids = prev.map((b) => b.id);
      const user = userBericht(trimmed, ids);
      const antwoord = beantwoord(trimmed, ctx, [...ids, user.id]);
      return [...prev, user, antwoord];
    });
    setInvoer("");
  }

  async function kopieer(tekst: string, label: string) {
    await navigator.clipboard.writeText(tekst);
    setKopieFeedback(label);
    setTimeout(() => setKopieFeedback(null), 2000);
  }

  if (!open || !ctx) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[110] flex w-[min(100vw-1.5rem,22rem)] flex-col sm:w-96">
      <div className="flex max-h-[min(70vh,32rem)] flex-col overflow-hidden rounded-2xl border border-amber-400/35 bg-[#120e06]/98 shadow-2xl shadow-amber-950/50 backdrop-blur-xl">
        <header className="flex items-center justify-between border-b border-amber-400/20 px-4 py-3">
          <div className="flex items-center gap-2">
            <GoudzoekerAvatarMini className="h-9 w-9 shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-300">Goudzoeker-agent</p>
              <p className="text-[10px] text-white/40">
                Slagingskans {ctx.slagings.totaal}% · week {ctx.slagings.week}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-white/50 hover:bg-white/10 hover:text-white"
            aria-label="Sluit agent"
          >
            ×
          </button>
        </header>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
          {berichten.map((b) => (
            <div
              key={b.id}
              className={`flex ${b.van === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[92%] rounded-xl px-3 py-2 ${
                  b.van === "user"
                    ? "bg-emerald-500/20 text-emerald-100"
                    : "border border-amber-400/15 bg-amber-950/40 text-white/80"
                }`}
              >
                <BerichtTekst tekst={b.tekst} />
                {b.acties && b.acties.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {b.acties.map((actie) =>
                      actie.type === "link" && actie.href ? (
                        <Link
                          key={actie.label}
                          href={actie.href}
                          className="rounded-full bg-amber-400/15 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-400/25"
                        >
                          {actie.label}
                        </Link>
                      ) : actie.type === "copy" && actie.copy ? (
                        <button
                          key={actie.label}
                          type="button"
                          onClick={() => kopieer(actie.copy!, actie.label)}
                          className="rounded-full bg-violet-400/15 px-2.5 py-1 text-xs font-semibold text-violet-300 hover:bg-violet-400/25"
                        >
                          {kopieFeedback === actie.label ? "✓ Gekopieerd" : actie.label}
                        </button>
                      ) : actie.type === "quick" && actie.vraag ? (
                        <button
                          key={actie.label}
                          type="button"
                          onClick={() => stuur(actie.vraag!)}
                          className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/70 hover:bg-white/15"
                        >
                          {actie.label}
                        </button>
                      ) : null
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-amber-400/15 px-3 py-2">
          <MaartenIdeeDeel compact />
          <div className="mb-2 mt-2 flex flex-wrap gap-1">
            {snelleVragen.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => stuur(v)}
                className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-medium text-white/55 hover:border-amber-400/30 hover:text-amber-300"
              >
                {v}
              </button>
            ))}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              stuur(invoer);
            }}
          >
            <input
              ref={inputRef}
              value={invoer}
              onChange={(e) => setInvoer(e.target.value)}
              placeholder="Vraag de agent..."
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm placeholder:text-white/25 focus:border-amber-400/40 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!invoer.trim()}
              className="shrink-0 rounded-xl bg-amber-500 px-3 py-2 text-sm font-bold text-slate-900 hover:bg-amber-400 disabled:opacity-40"
            >
              →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}