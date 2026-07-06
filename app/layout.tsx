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
    default: "WebKlaar — Websites voor vakmannen | Online bestellen",
    template: "%s | WebKlaar",
  },
  description:
    "Website vakman €899, Google Start €299, digitale opruiming, Excel & AI. Vaste prijs, live in 3 dagen. Online bestellen.",
  keywords: [
    "website vakman",
    "website installateur",
    "website zonwering",
    "google business vakman",
    "goedkope website zzp",
    "website laten maken snel",
  ],
  manifest: "/site.webmanifest",
  alternates: { canonical: "/" },
  openGraph: {
    title: "WebKlaar — Websites voor vakmannen",
    description: "Online bestellen. Vaste prijs. Live in 3 dagen.",
    url: "/",
    siteName: "WebKlaar",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "WebKlaar" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
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
