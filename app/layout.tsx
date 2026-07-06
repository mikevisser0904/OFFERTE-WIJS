import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "WebKlaar — Websites voor vakmannen | Online bestellen",
  description:
    "Website vakman €899, Google Start €299, digitale opruiming, Excel & AI. Vaste prijs, live in dagen. Online bestellen.",
  keywords: [
    "website vakman",
    "website installateur",
    "google business zzp",
    "goedkope website",
  ],
  openGraph: {
    title: "WebKlaar — Websites voor vakmannen",
    description: "Online bestellen. Vaste prijs. Live in 3 dagen.",
    url: "https://mikevisser0904.github.io/OFFERTE-WIJS/",
    siteName: "WebKlaar",
    locale: "nl_NL",
    type: "website",
  },
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
