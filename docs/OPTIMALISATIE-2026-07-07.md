# Optimalisatie-sessie (Mike weg ~1u)

Live dashboard: https://mikevisser0904.github.io/OFFERTE-WIJS/

## Wat is verbeterd

| Onderdeel | Wijziging |
|-----------|-----------|
| **Toestemming** | `consent:bulk` vereist nu `CONFIRM_BULK_CONSENT=1`; scrub revoke ook `bundeltoestemming` zonder `individualConsent` |
| **Berichten** | Alleen verifieerbare consent in verkooptekst; `metScanFeiten` in `echte-klanten.json` |
| **Funnel** | Stap 3b–3d: rebuild actionable hits → sanitize → consent scrub |
| **Optimizer** | Auto: consent scrub + sanitize leak-hits naast rapport-index |
| **UI** | CSV-download via `publicAssetPath` (GitHub Pages basePath) |
| **AGENTS.md** | Documentatie bulk vs `consent:scrub` |

## Metrics (na `lead:berichten` + outreach)

- **18** klanten met live admin-bewijs (GET, `adminProof.ok`)
- **15** outreach-contacten op `/agents/` en `/actie/`
- **1** actionable leak-hit in `leak-hits.json`

## Jouw actie (verdienen)

1. Open **/actie/** → top 5 WhatsApps (Fred van Rijn, Amer, …)
2. Op bellen: bewijs-URL laten zien — **niet** claimen dat jullie ingelogd zijn
3. Lokaal volledige pipeline: `npm run funnel` (zwaar) of `npm run funnel:light`

## Commando’s

```bash
npm run test:vakscan-detect
npm run lead:berichten && npm run agent:outreach
npm run agent:optimizer:apply
GITHUB_PAGES=true npm run build
```