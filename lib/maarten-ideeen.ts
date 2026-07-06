export const MAARTEN_IDEE_TOPIC = "webklaar-maarten-ideeen";
export const MAARTEN_IDEE_STORAGE = "webklaar-maarten-ideeen";
export const MAARTEN_IDEE_SINCE_KEY = "webklaar-maarten-ideeen-since";
export const MAARTEN_IDEE_EVENT = "maarten-idee-nieuw";

export type MaartenIdee = {
  id: string;
  tekst: string;
  euro?: string;
  tijd: number;
  van: string;
};

type NtfyBericht = {
  id: string;
  time: number;
  message: string;
  title?: string;
};

function parseIdee(raw: string, meta?: { id?: string; time?: number; title?: string }): MaartenIdee | null {
  const tekst = raw.trim();
  if (!tekst || tekst.length < 3) return null;

  let euro: string | undefined;
  let body = tekst;
  const euroMatch = tekst.match(/^€\s*([\d.,]+(?:k)?)\s*[-:–]\s*(.+)$/i);
  if (euroMatch) {
    euro = `€${euroMatch[1]}`;
    body = euroMatch[2]!.trim();
  }

  return {
    id: meta?.id ?? `l-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    tekst: body,
    euro,
    tijd: meta?.time ? Math.floor(meta.time / 1_000_000_000) : Date.now(),
    van: meta?.title?.toLowerCase().includes("mike") ? "Mike" : "Maarten",
  };
}

export function laadLokaleIdeeen(): MaartenIdee[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(MAARTEN_IDEE_STORAGE);
    if (!raw) return [];
    return JSON.parse(raw) as MaartenIdee[];
  } catch {
    return [];
  }
}

export function slaIdeeenOp(ideeen: MaartenIdee[]) {
  if (typeof window === "undefined") return;
  const gesorteerd = [...ideeen].sort((a, b) => b.tijd - a.tijd).slice(0, 40);
  localStorage.setItem(MAARTEN_IDEE_STORAGE, JSON.stringify(gesorteerd));
}

function mergeIdeeen(bestaand: MaartenIdee[], nieuw: MaartenIdee[]): MaartenIdee[] {
  const map = new Map<string, MaartenIdee>();
  [...bestaand, ...nieuw].forEach((i) => map.set(i.id, i));
  return [...map.values()].sort((a, b) => b.tijd - a.tijd);
}

export function voegIdeeToe(idee: MaartenIdee): MaartenIdee[] {
  const merged = mergeIdeeen(laadLokaleIdeeen(), [idee]);
  slaIdeeenOp(merged);
  window.dispatchEvent(new CustomEvent(MAARTEN_IDEE_EVENT, { detail: idee }));
  return merged;
}

export async function publiceerMaartenIdee(tekst: string): Promise<MaartenIdee> {
  const idee =
    parseIdee(tekst) ??
    ({
      id: `local-${Date.now()}`,
      tekst: tekst.trim(),
      tijd: Date.now(),
      van: "Maarten",
    } satisfies MaartenIdee);

  voegIdeeToe(idee);

  try {
    await fetch(`https://ntfy.sh/${MAARTEN_IDEE_TOPIC}`, {
      method: "POST",
      headers: {
        Title: "Maarten idee",
        Tags: "bulb,moneybag",
        Priority: "4",
      },
      body: tekst.trim(),
    });
  } catch {
    /* lokaal opgeslagen — sync later via poll */
  }

  return idee;
}

export async function haalIdeeenOp(): Promise<MaartenIdee[]> {
  let merged = laadLokaleIdeeen();

  if (typeof window !== "undefined") {
    try {
      const since = localStorage.getItem(MAARTEN_IDEE_SINCE_KEY) ?? "";
      const url = since
        ? `https://ntfy.sh/${MAARTEN_IDEE_TOPIC}/json?poll=1&since=${since}`
        : `https://ntfy.sh/${MAARTEN_IDEE_TOPIC}/json?poll=1`;
      const res = await fetch(url);
      if (res.ok) {
        const data = (await res.json()) as NtfyBericht | NtfyBericht[];
        const lijst = Array.isArray(data) ? data : data ? [data] : [];
        const nieuw = lijst
          .map((m) => parseIdee(m.message, { id: m.id, time: m.time, title: m.title }))
          .filter((i): i is MaartenIdee => i !== null);

        if (lijst.length > 0) {
          const laatste = lijst[lijst.length - 1]!;
          localStorage.setItem(MAARTEN_IDEE_SINCE_KEY, laatste.id);
        }

        if (nieuw.length > 0) {
          const vorig = merged;
          merged = mergeIdeeen(merged, nieuw);
          slaIdeeenOp(merged);
          const vers = nieuw.find((n) => !vorig.some((v) => v.id === n.id));
          if (vers) {
            window.dispatchEvent(new CustomEvent(MAARTEN_IDEE_EVENT, { detail: vers }));
          }
        }
      }
    } catch {
      /* offline */
    }
  }

  try {
    const jsonUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}${
            window.location.pathname.startsWith("/OFFERTE-WIJS") ? "/OFFERTE-WIJS" : ""
          }/maarten-ideeen.json`
        : "/maarten-ideeen.json";
    const res = await fetch(jsonUrl, { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { ideeen?: MaartenIdee[] };
      if (data.ideeen?.length) {
        merged = mergeIdeeen(merged, data.ideeen);
        slaIdeeenOp(merged);
      }
    }
  } catch {
    /* geen static file */
  }

  return merged;
}

export function nieuwsteIdee(ideeen: MaartenIdee[]): MaartenIdee | null {
  return ideeen[0] ?? null;
}

export function mompelVanIdee(idee: MaartenIdee): string {
  const prefix = idee.van === "Maarten" ? "Maarten zegt" : idee.van;
  return idee.euro ? `${prefix}: ${idee.tekst} (${idee.euro})` : `${prefix}: ${idee.tekst}`;
}