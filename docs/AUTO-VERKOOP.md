# Automatisch verkopen — DoekoeWijs (praktisch)

## Wat is wél automatisch

| Onderdeel | Hoe |
|-----------|-----|
| SEO-landings + sitemap | `traffic-daily.yml` |
| Health + manager + optimizer | `autopilot.yml` (4u), `VAKSCAN_SALES=0` |
| Outbound e-mail (internet) | `outbound-autopilot.yml` + Resend secrets |
| Bestelling → ntfy | `bestel-form` → topic `webklaar-mike` |
| Order → Maarten | `npm run order:intake` |
| Herinnering Mike | `npm run vandaag:kick` / Grok scheduler |

## Wat blijft handmatig (snelste geld)

- **5× WhatsApp/week** — `/actie/` (geen bulk-API)
- **Tikkie** na ja
- **Fiverr + Marktplaats** — 1× plaatsen (`/listings/`)
- **GSC** — 1× `npm run setup:gsc`
- **Levering** — Maarten

## Week 0 (Mike ~90 min)

1. GSC + sitemap  
2. Fiverr gig + Marktplaats  
3. `/actie/` 5× internet-menu + `/show/`  
4. Monitor: contacten = 5  

## Outbound internet (geen VakScan-scare)

- Config: `data/outbound-config.json` → `modus: internetdiensten`  
- GitHub Secrets: `RESEND_API_KEY`, `OUTBOUND_LIVE=1`, optioneel `OUTBOUND_FROM`  
- Max 5 mails/run, 14 dagen cooldown per domein  
- Zet **uit** bij klachten: `enabled: false` in config  

## Secrets (GitHub → Settings → Actions)

- `RESEND_API_KEY`  
- `OUTBOUND_LIVE=1` (alleen als je live wilt)  
- `OUTBOUND_FROM` (verified domain bij Resend)  

## KPI

- Week 2: ≥5 contacten/week, ≥1 bestelling of €149+  
- Zie `docs/SLAGINGSKANS.md` en `docs/PRODUCTEN-ANALYSE.md`  

## Kill-switch

- 0 reacties 3 weken → andere niche / alleen warm  
- Outbound spam → `enabled: false`  
- Alleen traffic 0 sales 8 weken → domein `.nl` + trust eerst