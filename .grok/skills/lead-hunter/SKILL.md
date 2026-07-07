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
npm run scan:leaks          # eindigt met sanitize — alleen actionable phpMyAdmin
npm run lead:berichten      # schrik-tekst alleen bij verified admin-bewijs
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
- Outreach alleen met **gratis-check-verhaar** of toestemming
- Geen mass-scan zonder queue — altijd via `scan-queue.json`
- **Geen false-positive phpMyAdmin:** alleen `pma_username`/loginform + live confirm → `leak-hits.json` met `actionable: true`. Geen lek-claim zonder `adminProof.ok`.

## Schriftelijke toestemming

```bash
# 1. Vul data/scan-toestemming.json (zie scan-toestemming.example.json)
# 2. Optioneel: data/scan-toestemming.local.json (gitignored)
npm run scan:consent
npm run lead:berichten
```

## Triggers

**"agent leads"**, **"potentiële klanten"**, **"haal leads op"**