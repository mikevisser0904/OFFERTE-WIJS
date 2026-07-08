export type GrootFase = {
  id: string;
  fase: number;
  titel: string;
  tagline: string;
  doelOmzet: string;
  status: "nu" | "volgende" | "later";
  metrics: { label: string; target: string }[];
  agents: string[];
  mijlpalen: string[];
  product: string;
};

export const visie = {
  naam: "DoekoeWijs internetdiensten",
  elevator:
    "Vaste-prijs shop voor zzp/mkb: SEO, Google, websites, listings. Actie + listings voor geld vandaag; traffic en autopilot op de achtergrond. VakScan blijft in repo, verkoop daarop gepauzeerd.",
  northStar: "8+ opdrachten geleverd per maand via warm netwerk + SEO",
  nu: "Fase 1 — catalogus, actie, monitor, show/demo live",
};

export const fases: GrootFase[] = [
  {
    id: "f1-machine",
    fase: 1,
    titel: "De verkoopmachine",
    tagline: "Actie + listings + SEO → Spoed €50 t/m Vakman €899",
    doelOmzet: "€10.000 (eerste rug)",
    status: "nu",
    metrics: [
      { label: "Leads in queue", target: "500+" },
      { label: "Scans / week", target: "200+" },
      { label: "WhatsApps / week", target: "25+" },
      { label: "Gesloten deals", target: "8–12" },
    ],
    agents: ["manager", "lead-hunter", "vakscan-leaks", "outreach", "maarten-bouw"],
    mijlpalen: [
      "OSM + import vult queue zonder handwerk",
      "Lek-rapport = standaard opener Website Veilig",
      "Mike: 30 min/dag op /agents/ + /actie/",
      "Maarten: template + fix-pakket in 2 dagen",
    ],
    product: "DoekoeWijs webshop + VakScan rapport",
  },
  {
    id: "f2-vakscan-product",
    fase: 2,
    titel: "VakScan als product",
    tagline: "Gratis scan → abonnement monitoring",
    doelOmzet: "€3k MRR pad",
    status: "volgende",
    metrics: [
      { label: "Actieve monitor-klanten", target: "50" },
      { label: "Scan op aanvraag (white-label PDF)", target: "€49" },
      { label: "Her-scan automatisch", target: "maandelijks" },
    ],
    agents: ["vakscan-full", "seo", "outreach", "kpi"],
    mijlpalen: [
      "Merk 'VakScan' los van DoekoeWijs op landings",
      "Rapport-PDF + klant-portal (static)",
      "Onderhoud €49/mnd koppelen aan her-scan",
    ],
    product: "VakScan Pro + Website Veilig",
  },
  {
    id: "f3-regio",
    fase: 3,
    titel: "Heel Nederland",
    tagline: "50 steden · branche-packs",
    doelOmzet: "€50k/jaar run-rate",
    status: "later",
    metrics: [
      { label: "Steden in lead-hunter", target: "50" },
      { label: "Branches", target: "zonwering, kozijnen, loodgieter, elektra" },
      { label: "Partner-vakmannen (referral)", target: "20" },
    ],
    agents: ["lead-hunter", "manager", "deploy-pages"],
    mijlpalen: [
      "SEO-landings per stad × branche",
      "Referral €50 in product",
      "Optioneel: lokale reseller (jij scant, zij verkopen)",
    ],
    product: "DoekoeWijs franchise-light",
  },
  {
    id: "f4-platform",
    fase: 4,
    titel: "Platform",
    tagline: "API, agencies, volume",
    doelOmzet: "Schaal buiten jullie uren",
    status: "later",
    metrics: [
      { label: "Bureau-API keys", target: "10" },
      { label: "Scans / maand", target: "10.000" },
    ],
    agents: ["vakscan-leaks", "health-monitor", "manager"],
    mijlpalen: [
      "Hosted scanner (niet alleen GH Actions)",
      "VakScan API + facturatie",
      "Compliance: alleen opt-in scans",
    ],
    product: "VakScan API + DoekoeWijs agency",
  },
];

export const dezeWeek = [
  { dag: "Ma", agent: "lead-hunter", actie: "agent:leads + queue vullen" },
  { dag: "Di", agent: "vakscan-leaks", actie: "agent:vakscan-leaks" },
  { dag: "Wo", agent: "outreach", actie: "10 WhatsApps van /agents/" },
  { dag: "Do", agent: "maarten-bouw", actie: "fixes voor verkochte Veilig/Site" },
  { dag: "Vr", agent: "manager", actie: "manager check + KPI export" },
];

export function huidigeFase(): GrootFase {
  return fases.find((f) => f.status === "nu") ?? fases[0];
}