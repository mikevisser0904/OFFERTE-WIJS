"use client";

type Props = {
  actief: boolean;
  bijGoud: boolean;
  euro?: string;
  titel?: string;
};

export function GoudzoekerOpdringer({ actief, bijGoud, euro, titel }: Props) {
  if (!actief) return null;

  return (
    <>
      <div className={`goud-vignette pointer-events-none fixed inset-0 z-[85] ${bijGoud ? "goud-vignette-heftig" : ""}`} aria-hidden />
      <div className="goud-scanlijn pointer-events-none fixed inset-0 z-[86] overflow-hidden" aria-hidden>
        <div className="goud-scanlijn-balk" />
      </div>
      {bijGoud && (
        <div className="goud-alarm-balk pointer-events-none fixed left-0 right-0 top-0 z-[88] flex items-center justify-center gap-3 py-2">
          <span className="goud-alarm-ping h-2 w-2 rounded-full bg-amber-400" />
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300 sm:text-sm">
            Goud gevonden — {titel} — {euro}
          </p>
          <span className="goud-alarm-ping h-2 w-2 rounded-full bg-amber-400" />
        </div>
      )}
    </>
  );
}