---
name: klanten-lek-agent
description: Scant potentiële klanten op echte datalekken en bouwt database-profiel (type, host, tabellen, panels). Gebruik bij "klanten lek", "database lek check", "potentiële klanten scannen".
---

# Klanten-lek Agent

**Rol:** Door **alle** (of top) leads uit OSM op **daadwerkelijke** database/datalek-paden — niet alleen queue.

## Output

| Bestand | Inhoud |
|---------|--------|
| `data/klanten-lek-rapport.json` | Per klant: lek ja/nee, bevindingen, `database`-profiel |
| `data/klanten-database-export.json` | Tabel voor Mike: dbType, host, dbName, user, panelUrl, SQL-tabellen |

**Geen wachtwoorden** in JSON — alleen `wachtwoordAanwezig: true` en metadata.

## Commando

```bash
cd ~/Developer/OFFERTE-WIJS
npm run agent:klanten-lek
KLANTEN_LEK_LIMIT=184 npm run agent:klanten-lek
npm run agent:klanten-lek -- --limit=30 --min-score=70
```

## Flow

1. Leest `klanten-gescoord.json` of `potentiele-klanten.json`
2. `runLeakChecks` per URL (zelfde passieve regels als VakScan)
3. `buildDatabaseProfile` — .env → DB host/name/user, SQL-dump → tabelnamen, panels → phpMyAdmin URL
4. Bij lek: VakScan-rapport + `leak-hits.json`
5. Sync via `npm run agent:dataflow`

## UI

**/leads/** — blok "Database-lekken"

## Triggers

**"klanten lek"**, **"check potentiële klanten op lek"**, **"database van klanten"**

## Juridisch

Alleen passieve GET-checks. Verkoop via gratis check / toestemming — zie `/scan/` disclaimer.