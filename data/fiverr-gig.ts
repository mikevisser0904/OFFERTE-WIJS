import { webklaar } from "@/data/diensten-online";

export const fiverrPortfolioUrl = webklaar.demo;
export const fiverrSellerUrl = "https://www.fiverr.com/start_selling";

export const fiverrGigTitle =
  "I will build a professional 5 page business website in 3 days";

export const fiverrGigTitleVariants = [
  "I will create a modern small business website with contact form in 3 days",
  "I will design a mobile friendly website for electricians plumbers and local trades",
  "I will build a fast business website wordpress alternative in 72 hours",
] as const;

export const fiverrTags = [
  "business website",
  "wordpress alternative",
  "small business",
  "landing page",
  "responsive website",
  "website design",
  "custom website",
];

export const fiverrCategoryHint =
  "Programming & Tech → Website Development → Business Website (or WordPress if required)";

export const fiverrDescription = `Hi — I'm Mike from WebKlaar (EU). I build fast, mobile-first business websites for local businesses and trades.

YOU GET:
• 5 pages: Home, Services, About, Projects/Gallery, Contact
• Mobile responsive design
• Contact form + WhatsApp / click-to-call
• Basic SEO (titles, meta, sitemap)
• Delivery in 3 days after I receive your content

I NEED FROM YOU:
• Business name, phone, email
• Logo (or text logo)
• Short text per page (bullet points are fine)
• 3–10 photos (optional)

Portfolio: ${fiverrPortfolioUrl}

Message me before ordering if you have questions — happy to help.`;

export type FiverrPackage = {
  tier: string;
  priceUsd: number;
  pages: number;
  revisions: number;
  deliveryDays: number;
  extra: string;
  description: string;
  features: string[];
};

export const fiverrPackages: FiverrPackage[] = [
  {
    tier: "Basic",
    priceUsd: 199,
    pages: 5,
    revisions: 1,
    deliveryDays: 3,
    extra: "Contact form",
    description:
      "Starter for local businesses. 5 pages, mobile-ready, contact form. Best if logo + short texts are ready.",
    features: [
      "5 pages (Home, Services, About, Gallery, Contact)",
      "Mobile responsive",
      "Contact form",
      "1 revision round",
      "3-day delivery",
    ],
  },
  {
    tier: "Standard",
    priceUsd: 299,
    pages: 5,
    revisions: 2,
    deliveryDays: 3,
    extra: "Google Maps + WhatsApp",
    description: "Most popular — Basic plus Google Maps and WhatsApp click-to-chat.",
    features: [
      "Everything in Basic",
      "Google Maps embed",
      "WhatsApp button",
      "2 revision rounds",
      "Basic on-page SEO",
    ],
  },
  {
    tier: "Premium",
    priceUsd: 449,
    pages: 7,
    revisions: 3,
    deliveryDays: 3,
    extra: "Extra pages + copy polish",
    description: "More pages or light English copy polish included.",
    features: [
      "7 pages total",
      "3 revision rounds",
      "Light copy polish",
      "Screen recording handover",
    ],
  },
];

export const fiverrExtras = [
  { name: "Extra page", priceUsd: 49, note: "Per page above package limit" },
  { name: "Rush 24h delivery", priceUsd: 79, note: "Only if content is complete" },
  { name: "Google Business setup guide", priceUsd: 39, note: "PDF checklist — you verify listing" },
] as const;

export function fiverrPackageBlock(p: FiverrPackage): string {
  return `${p.tier} — $${p.priceUsd}
${p.description}

Includes:
${p.features.map((f) => `• ${f}`).join("\n")}

Delivery: ${p.deliveryDays} days · Revisions: ${p.revisions}`;
}

export const fiverrFaqs = [
  {
    q: "Do you use WordPress?",
    a: "I use a modern static stack — faster and more secure. It looks like a premium business site, without slow plugins.",
  },
  {
    q: "What about hosting?",
    a: "I deliver files ready to upload, or I guide you to affordable static hosting (including free-tier options).",
  },
  {
    q: "Need more pages?",
    a: "Upgrade to Premium or add the Extra page gig extra.",
  },
  {
    q: "What industries?",
    a: "Electricians, plumbers, salons, contractors, local shops — any small business that needs trust online.",
  },
  {
    q: "Can you write all my text?",
    a: "Premium includes light polish. Full copywriting = custom quote.",
  },
] as const;

export const fiverrBuyerRequirements = `1. Business name and industry
2. Phone number and email (for contact page)
3. Logo file (PNG/SVG) OR "text logo only"
4. Text for Home, Services, About, Contact (bullets OK)
5. Photos optional (3–10)
6. Brand colors (hex or "match logo")
7. Your domain if you already own one`;

export const fiverrThumbnailHeadline = "5-Page Business Website · 3 Days · Mobile Ready";

export const fiverrThumbnailBullets = ["MOBILE READY", "5 PAGES", "3 DAY DELIVERY", "$199 FROM"];

export const fiverrSellerProfile = `Web developer (EU) — fast business websites for trades & local shops.

✓ 5-page sites in 3 days
✓ Mobile-first, contact form, WhatsApp
✓ Clear pricing — no surprise invoices

Portfolio: ${fiverrPortfolioUrl}

Message your business type before ordering — I'll confirm fit within 1 hour.`;

export const fiverrGalleryShots = [
  { label: "Home desktop", url: fiverrPortfolioUrl },
  { label: "Home mobile (DevTools)", url: fiverrPortfolioUrl },
  { label: "Services", url: `${fiverrPortfolioUrl}diensten/` },
  { label: "Contact CTA", url: `${fiverrPortfolioUrl}bestellen/` },
] as const;

export const fiverrMessages = {
  inquiryReply: `Hi! Thanks for reaching out.

To confirm package and timeline:
1) Your industry?
2) Logo + texts ready?
3) Basic $199, Standard $299, or Premium $449?

Demo: ${fiverrPortfolioUrl}

— Mike / WebKlaar`,

  orderReceived: `Thank you for your order!

Please send in this thread:
• Logo (or text-only)
• Phone + email
• Bullet text per page
• Photos (optional)
• Brand colors (optional)

Your 3-day clock starts when I have everything.`,

  delivery: `Your site is ready — thank you!

I'll send preview link + short hosting notes. Use your revision round for tweaks. A 5★ review helps a lot when you're happy — thanks!`,
} as const;

export const fiverrSetupSteps = [
  "Seller profile → paste bio",
  "New gig → category hint",
  "Title, tags, description",
  "3 packages — paste each tier block",
  "Optional gig extras",
  "FAQ ×5, gallery, buyer requirements",
  "Publish",
] as const;