/**
 * Pad naar bestanden in public/ — GitHub Pages gebruikt basePath /OFFERTE-WIJS.
 * NEXT_PUBLIC_BASE_PATH wordt gezet bij `GITHUB_PAGES=true npm run build`.
 */
export function githubPagesBase(): string {
  const fromEnv = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (fromEnv) return fromEnv;
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/OFFERTE-WIJS")) {
    return "/OFFERTE-WIJS";
  }
  return "";
}

export function publicAssetPath(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${githubPagesBase()}${p}`;
}

export function publicAssetUrl(path: string): string {
  const rel = publicAssetPath(path);
  if (typeof window === "undefined") return rel;
  return `${window.location.origin}${rel}`;
}