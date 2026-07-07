---
name: lead-hunter
description: Eerste prospectie-agent — haalt echte vakman-URL's uit OpenStreetMap, vult scan-queue, start VakScan-funnel. Gebruik bij "potentiële klanten", "leads", "agent leads", "vul queue".
---

# Lead Hunter Agent (OFFERTE-WIJS)

**Rol:** Automatisch **potentiële klanten met website** in jullie regio's.

## Volledige agent-run

```bash
cd ~/Developer/OFFERTE-WIJS
npm run agent:leads
```

Stappen: OSM Overpass → `potentiele-klanten.json` → merge `scan-queue.json` → ntfy → `agents-status.json`

## Daarna (vaak zelfde sessie)

```bash
npm run scan:leaks
npm run agent:outreach
```

Of alles: `npm run agent:pipeline`

## Handmatig

```bash
node scripts/lead-hunter/osm-fetch.mjs
npm run scan:import -- data/klanten-leads-import.txt
```

## Steden (aanpasbaar)

Utrecht, Amersfoort, Amsterdam, Rotterdam, Den Haag, Haarlem — zie `scripts/lead-hunter/osm-fetch.mjs`

## Regels

- Alleen **publieke OSM-data**; geen verzonnen bedrijven
- Outreach alleen met **gratis-check-verhaal** of toestemming
- Geen mass-scan zonder queue — altijd via `scan-queue.json`

## Triggers

**"agent leads"**, **"potentiële klanten"**, **"haal leads op"**