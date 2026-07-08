import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DoekoeWijs — Internetdiensten | Online bestellen",
    template: "%s | DoekoeWijs",
  },
  description:
    "Internetdiensten: SEO €199, Google Start €299, websites, listings, Excel & AI. Vaste prijs voor zzp en mkb. Online bestellen.",
  keywords: [
    "internetdiensten zzp",
    "seo starter",
    "google business",
    "website laten maken",
    "website vakman",
    "excel automatisering",
  ],
  manifest: "/site.webmanifest",
  alternates: { canonical: "/" },
  openGraph: {
    title: "DoekoeWijs — Internetdiensten",
    description: "Online bestellen. Vaste prijs. Meer doekoe.",
    url: "/",
    siteName: "DoekoeWijs",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "DoekoeWijs" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
