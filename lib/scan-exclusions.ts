export type ScanUitsluiting = {
  host: string;
  bedrijf?: string;
  reden?: string;
  sinds?: string;
};

export function hostKeyFromUrl(url: string): string {
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return "";
  }
}

export function isHostUitgesloten(url: string, hosts: ScanUitsluiting[]): boolean {
  const h = hostKeyFromUrl(url);
  return hosts.some((x) => x.host.toLowerCase() === h);
}