export type ScanNiveau = "ok" | "let-op" | "hoog" | "kritiek";

export type ScanIndexItem = {
  id: string;
  url: string;
  bedrijf: string;
  plaats: string;
  scannedAt: string;
  risicoScore: number;
  niveau: ScanNiveau;
  niveauLabel: string;
};

export type ScanQueueItem = {
  id: string;
  bedrijf: string;
  plaats: string;
  url: string;
  status: "pending" | "klaar" | "fout";
  toegevoegd?: string;
  scannedAt?: string;
  reportId?: string;
  risicoScore?: number;
  fout?: string;
};

export type ScanQueue = {
  updatedAt: string;
  items: ScanQueueItem[];
};

export const VAKSCAN_DISCLAIMER =
  "Scan alleen met toestemming van de eigenaar of als onderdeel van een door jou aangeboden gratis veiligheidscheck. Passief: geen poortscan, geen inlog.";

export function niveauKleur(niveau: ScanNiveau): string {
  switch (niveau) {
    case "ok":
      return "text-emerald-300 bg-emerald-400/10 border-emerald-400/25";
    case "let-op":
      return "text-amber-300 bg-amber-400/10 border-amber-400/25";
    case "hoog":
      return "text-orange-300 bg-orange-400/10 border-orange-400/25";
    case "kritiek":
      return "text-rose-300 bg-rose-400/10 border-rose-400/25";
    default:
      return "text-white/60 bg-white/5 border-white/10";
  }
}

function publicBase(): string {
  if (typeof window === "undefined") return "";
  return window.location.pathname.startsWith("/OFFERTE-WIJS") ? "/OFFERTE-WIJS" : "";
}

function publicUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (typeof window === "undefined") return p;
  return `${window.location.origin}${publicBase()}${p}`;
}

export function reportsIndexUrl(): string {
  return publicUrl("/reports/index.json");
}

export function reportJsonUrl(id: string): string {
  return publicUrl(`/reports/${id}.json`);
}

export function scanQueueUrl(): string {
  return publicUrl("/scan-queue.json");
}

export function nieuwQueueItem(input: {
  bedrijf: string;
  plaats: string;
  url: string;
}): ScanQueueItem {
  const id = `q-${Date.now().toString(36)}`;
  return {
    id,
    bedrijf: input.bedrijf.trim(),
    plaats: input.plaats.trim(),
    url: input.url.trim(),
    status: "pending",
    toegevoegd: new Date().toISOString(),
  };
}

export function mergeQueueItem(queue: ScanQueue, item: ScanQueueItem): ScanQueue {
  return {
    updatedAt: new Date().toISOString(),
    items: [item, ...queue.items],
  };
}