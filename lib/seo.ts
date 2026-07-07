export const SITE_URL = "https://mikevisser0904.github.io/OFFERTE-WIJS";

export function absoluteUrl(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p.endsWith("/") ? p : `${p}/`}`;
}

export function pageMetadata({
  title,
  description,
  path,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}) {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "DoekoeWijs",
      locale: "nl_NL",
      type: "website" as const,
      images: [{ url: absoluteUrl("/og.svg"), width: 1200, height: 630, alt: "DoekoeWijs" }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [absoluteUrl("/og.svg")],
    },
    robots: { index: true, follow: true },
  };
}