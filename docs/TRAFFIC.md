# Traffic (geautomatiseerd)

**Doel:** organisch verkeer via SEO-landingspagina's — geen VakScan-spam.

## Wat draait vanzelf

| Wat | Wanneer |
|-----|---------|
| **traffic-daily** (GitHub Actions) | Elke dag 05:00 UTC — 3 landings + sitemap + IndexNow + push |
| **seo-weekly** | Maandag — 5 landings + build |
| **deploy-pages** | Na elke push naar `main` |

## Lokaal / Grok

```bash
npm run traffic              # pool + 3 landings + IndexNow
npm run funnel:traffic       # dataflow + traffic + manager (geen scan)
GITHUB_PAGES=true npm run build && git push
```

## Pool

- Generator: `scripts/seo-fill-pool.mjs` (stad × vak NL)
- Toevoegen: `scripts/seo-add-from-pool.mjs`
- Status: `data/traffic-status.json` · live `public/traffic-status.json`

## Jij (1×)

```bash
npm run setup:gsc
```

Sitemap in Google Search Console — versnelt indexering.

## Conversie

Traffic → `/start/` (€299) en `/bestellen/`. Verkoop blijft `/actie/` (warm netwerk).