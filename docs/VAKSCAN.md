# VakScan — verbeteringen & roadmap

## Wat het nu doet

- **Volledige scan:** HTTPS, headers, WordPress, cookies + alle lek-paden
- **Leak-modus:** alleen database/datalek (sneller, bulk)
- **Rapport:** score, NL bullets, WhatsApp-verkooptekst
- **Integratie:** queue, leak-hits, Outreach-agent, Manager

## Recent verbeterd

| Onderdeel | Verbetering |
|-----------|-------------|
| Snelheid | Lek-paden parallel (5 tegelijk per site) |
| False positives | Strengere phpMyAdmin/Adminer/Redis-detectie |
| Outreach | Geen demo-URL's (neverssl, example.com); focus op `leakHit` |
| Stats | `data/scan-stats.json` — hit-rate per batch |
| Index | Rapporten tonen `leakHit` in `reports/index.json` |

## Commando's

```bash
npm run scan -- <url> --bedrijf X --plaats Y
npm run scan -- <url> --leaks
npm run scan:leaks
npm run agent:pipeline
```

## Volgende stappen (optioneel)

1. **Google Places API** — meer leads dan OSM (API-key in `data/integrations.ts`)
2. **PDF-rapport** — één pagina voor vakman (docx skill)
3. **Subdomeinen** — alleen `www` nu; `admin.site.nl` apart met toestemming-model
4. **Diff-scan** — zelfde URL opnieuw → "nieuw lek sinds vorige week"
5. **Rate limit per host** — configureerbaar in batch voor grote lijsten

## Grenzen (bewust)

- Geen poortscan, geen SQL-injectie, geen inlog
- Bulk alleen op **eigen queue** (vakman-outreach)
- Manager + disclaimer op `/scan/`