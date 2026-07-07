export type AgentRegistryEntry = {
  id: string;
  taak?: string;
  naam: string;
  rol: string;
  skill: string;
  script: string;
  workflow: string | null;
  trigger: string[];
};

export type OutreachContact = {
  type: string;
  prioriteit: number;
  bedrijf: string;
  plaats: string;
  url: string;
  risicoScore?: number;
  reden: string;
  actie: string;
  whatsapp: string;
  whatsappUrl?: string;
  telefoon?: string;
  reportId?: string;
};

export type FunnelStep = { id: string; ok: boolean };

export type FunnelStatus = {
  startedAt: string;
  finishedAt: string;
  mode: string;
  steps: FunnelStep[];
  ok: boolean;
  next: string;
};

export type OutreachVandaag = {
  generatedAt: string;
  agent: string;
  totaalKandidaten: number;
  vandaag: OutreachContact[];
  samenvatting: { lekken: number; hogeScore: number; koud: number };
  agentPrompt: string;
};

function publicBase(): string {
  if (typeof window === "undefined") return "";
  return window.location.pathname.startsWith("/OFFERTE-WIJS") ? "/OFFERTE-WIJS" : "";
}

function publicUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (typeof window === "undefined") return p;
  return `${window.location.origin}${publicBase()}${p}`;
}

export function agentsStatusUrl() {
  return publicUrl("/agents-status.json");
}

export function agentsRegistryUrl() {
  return publicUrl("/agents-registry.json");
}

export function outreachVandaagUrl() {
  return publicUrl("/outreach-vandaag.json");
}

export function potentieleKlantenUrl() {
  return publicUrl("/potentiele-klanten.json");
}

export function managerStatusUrl() {
  return publicUrl("/manager-status.json");
}

export function optimizerStatusUrl() {
  return publicUrl("/optimizer-status.json");
}

export function dataFlowStatusUrl() {
  return publicUrl("/data-flow-status.json");
}

export function funnelStatusUrl() {
  return publicUrl("/funnel-status.json");
}

export type DataFlowStream = {
  id: string;
  naam: string;
  status: string;
  drift: boolean;
  synced: boolean;
  detail: string;
  issues?: string[];
};

export type DataFlowStatus = {
  updatedAt: string;
  healthy: boolean;
  summary: {
    streams: number;
    ok: number;
    drift: number;
    synced: number;
    missing: number;
    warnings: number;
  };
  streams: DataFlowStream[];
  agentPrompt?: string;
};

export type OptimizerStatus = {
  updatedAt: string;
  grokPrompt: string;
  metrics: Record<string, number>;
  uitgevoerd: { titel: string; status: string }[];
  pendingGrok?: number;
};

export type ManagerCard = {
  id: string;
  naam: string;
  status: "ok" | "actie";
  detail: string;
  lastRun: string | null;
};

export type ManagerStatus = {
  updatedAt: string;
  fase: string;
  faseLabel: string;
  grokPrompt: string;
  mikeActie: string;
  acties: { wie: string; actie: string; script: string }[];
  cards: ManagerCard[];
};