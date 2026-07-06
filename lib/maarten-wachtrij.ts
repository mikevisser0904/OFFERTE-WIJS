import type { MaartenIdee } from "@/lib/maarten-ideeen";

export type MaartenWachtrijStatus = "pending" | "bezig" | "klaar" | "afgewezen";

export type MaartenWachtrijItem = MaartenIdee & {
  status: MaartenWachtrijStatus;
  agentOpdracht: string;
  aangemaakt: string;
  uitgevoerdOp?: string;
  notitie?: string;
};

export type MaartenWachtrij = {
  versie: number;
  repo: string;
  lastSync: string | null;
  lastNtfyId: string | null;
  ideeen: MaartenWachtrijItem[];
};

export const WACHTRIJ_PAD = "data/maarten-wachtrij.json";
export const WACHTRIJ_PUBLIC = "public/maarten-wachtrij.json";
export const GITHUB_REPO = "mikevisser0904/OFFERTE-WIJS";

export function genereerAgentOpdracht(idee: MaartenIdee): string {
  const euro = idee.euro ? `Potentieel: ${idee.euro}\n` : "";
  return `## Maarten-idee — uitvoeren in OFFERTE-WIJS

**ID:** ${idee.id}
**Van:** ${idee.van}
**Datum:** ${new Date(idee.tijd).toISOString()}
${euro}**Idee:** ${idee.tekst}

### Jouw opdracht (Grok/Cursor agent)
1. Lees \`data/maarten-wachtrij.json\` — dit item heeft status \`pending\`
2. Implementeer het idee in ~/Developer/offerte-wijs (Next.js static export, GitHub Pages)
3. Build moet slagen: \`GITHUB_PAGES=true npm run build\`
4. Commit + push met duidelijke message
5. Update dit item in \`data/maarten-wachtrij.json\`:
   - \`status\`: \`klaar\`
   - \`uitgevoerdOp\`: ISO-datum
   - \`notitie\`: korte samenvatting wat je deed
6. Sync ook naar \`public/maarten-wachtrij.json\` (zelfde inhoud)

### Context project
- Live: https://mikevisser0904.github.io/OFFERTE-WIJS/
- Mike verkoopt, Maarten bouwt · doel €10k
- Geen server-side API routes — static export only

### Vraag aan Mike/Maarten alleen als echt nodig
Anders: kies beste implementatie en voer door.`;
}

export function naarWachtrijItem(idee: MaartenIdee): MaartenWachtrijItem {
  return {
    ...idee,
    status: "pending",
    agentOpdracht: genereerAgentOpdracht(idee),
    aangemaakt: new Date(idee.tijd).toISOString(),
  };
}

export function githubIssueUrl(idee: MaartenIdee): string {
  const title = encodeURIComponent(`Maarten: ${idee.tekst.slice(0, 72)}`);
  const body = encodeURIComponent(
    `${genereerAgentOpdracht(idee)}\n\n---\n_Aangemaakt via goudzoeker · sync naar data/maarten-wachtrij.json_`
  );
  return `https://github.com/${GITHUB_REPO}/issues/new?title=${title}&body=${body}`;
}

export function pendingIdeeen(wachtrij: MaartenWachtrij): MaartenWachtrijItem[] {
  return wachtrij.ideeen.filter((i) => i.status === "pending");
}