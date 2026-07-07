---
name: verkoop-bewijs-agent
description: Verkoop-agent met aantoonbaar bewijs — ververst berichten (HTTP-check + scanrapport), levert verkoop-vandaag voor Mike/Grok. Gebruik bij "verkoop bewijs", "geen lucht", "bewijs aan klant", "agent verkoop".
---

# Verkoop-bewijs Agent (OFFERTE-WIJS)

**Rol:** Dit is het **verkoopstuk** — elk contact heeft controle-URL, scanrapport en BEWIJS-blok in het bericht.

## Run

```bash
cd ~/Developer/offerte-wijs
npm run agent:verkoop-bewijs
```

## Worktree (geïsoleerd van main)

```bash
npm run agent:verkoop-bewijs:worktree
```

Map: `~/Developer/offerte-wijs-wt-verkoop-bewijs` · branch `agent/verkoop-bewijs`  
Open die map in een **nieuw Cursor-venster** om alleen de agent te draaien zonder je main checkout te raken.

Snel (berichten al vers):
```bash
npm run agent:verkoop-bewijs -- --skip-berichten
```

## Wat het doet

1. `personalize-verkoop.mjs` — live GET + `scanBewijs` + BEWIJS-tekst
2. `data/verkoop-vandaag.json` + `public/` — top 12 met `belScript` + `grokTaak`
3. `agents-status.json` → agent `verkoop-bewijs`

## UI

- **/dashboard/** — Echte klanten (bewijs-URL + rapport)
- **/agents/** — outreach-lijst (outreach draait deze agent eerst)

## Keten

```bash
npm run agent:auto-verify    # hercheck + berichten
npm run agent:verkoop-bewijs -- --skip-berichten
npm run agent:outreach       # SKIP_VERKOOP_BEWIJS=1 als bewijs net gedraaid
```

Of: `npm run funnel` (bevat verkoop-bewijs vóór outreach).

## Grok — per klant

Lees `public/verkoop-vandaag.json` → `vandaag[n].grokTaak` + `belScript`.  
Spreektekst: `docs/BEWIJS-AAN-KLANT.md`.

## Triggers

- **"agent verkoop-bewijs"**, **"verkoop met bewijs"**, **"klant denkt het is lucht"**
- Na auto-verify: verkoop-lijst verversen

## Outreach

Outreach-agent roept standaard `verkoop-bewijs` aan (tenzij `SKIP_VERKOOP_BEWIJS=1`).  
Outreach prioriteert kandidaten met `scanBewijs` / `verkoop-bewijs` bron.