export type AgentRegistryEntry = {
  id: string;
  naam: string;
  rol: string;
  skill: string;
  script: string;
  workflow: string;
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
  reportId?: string;
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