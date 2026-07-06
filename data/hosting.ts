export const hostingOpties = [
  {
    naam: "GitHub Pages",
    prijs: "€0/maand",
    aanbevolen: true,
    waarom: "Al actief. Onbeperkt verkeer voor statische sites. SEO-sitemap live.",
    actie: "Niets doen — draait al op mikevisser0904.github.io/OFFERTE-WIJS/",
  },
  {
    naam: "Cloudflare Pages",
    prijs: "€0/maand",
    aanbevolen: false,
    waarom: "Gratis, onbeperkte bandbreedte, sneller wereldwijd. Ideaal met eigen domein.",
    actie: "Optioneel: koppel repo in Cloudflare dashboard → Pages → gratis",
  },
  {
    naam: "Eigen domein (webklaar.nl)",
    prijs: "~€10/jaar",
    aanbevolen: true,
    waarom: "Beter voor SEO en vertrouwen dan .github.io. Cloudflare DNS is gratis.",
    actie: "Domein kopen → DNS naar GitHub Pages of Cloudflare Pages",
  },
  {
    naam: "Vercel / Netlify",
    prijs: "€0 (beperkt)",
    aanbevolen: false,
    waarom: "Werkt, maar geen voordeel t.o.v. GitHub Pages voor deze site.",
    actie: "Niet nodig",
  },
];

export const hostingAdvies =
  "Goedkoopste stack: GitHub Pages (€0) + later webklaar.nl (~€10/jaar). Totale hostingkosten: vrijwel nul.";