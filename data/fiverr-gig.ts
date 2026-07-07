import { webklaar } from "@/data/diensten-online";

export const fiverrPortfolioUrl = webklaar.demo;

export const fiverrGigTitle =
  "I will build a professional 5 page business website in 3 days";

export const fiverrTags = [
  "business website",
  "wordpress alternative",
  "small business",
  "landing page",
  "responsive website",
];

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

export const fiverrPackages = [
  { tier: "Basic", priceUsd: 199, pages: 5, revisions: 1, deliveryDays: 3, extra: "Contact form" },
  { tier: "Standard", priceUsd: 299, pages: 5, revisions: 2, deliveryDays: 3, extra: "Google Maps embed" },
  { tier: "Premium", priceUsd: 449, pages: 7, revisions: 3, deliveryDays: 3, extra: "Extra page + content polish" },
] as const;

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
    a: "Upgrade to Premium or message me for a custom offer.",
  },
] as const;

export const fiverrBuyerRequirements = `1. Business name and industry
2. Phone number and email
3. Logo file (or say "text logo only")
4. Short text for each page (bullets OK)
5. Photos (optional, 3–10)
6. Brand colors (optional)`;

export const fiverrThumbnailHeadline = "5-Page Business Website · 3 Days · Mobile Ready";

export const fiverrSetupSteps = [
  "Seller account → Create new Gig",
  "Paste Title, Description, Tags (copy buttons below)",
  "Add 3 packages: $199 / $299 / $449 — delivery 3 days each",
  "FAQ: paste the 3 Q&A blocks",
  "Gallery: 3–5 screenshots from demo link",
  "Buyer requirements: paste checklist",
  "Publish gig",
] as const;