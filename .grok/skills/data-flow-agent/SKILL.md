---
name: data-flow-agent
description: Beheert alle OFFERTE-WIJS datastromen — sync data/ naar public/, validatie, rapport-index. Gebruik bij "dataflow", "data stromen", "sync public".
---

# Data-flow Agent

**Rol:** Eén plek voor **alle JSON/dir mirrors** die de static site leest (`/scan/`, `/agents/`, `/leads/`, …).

Canoniek = meestal `data/` · UI = `public/` (zelfde bestandsnaam).

## Commando's

```bash
cd ~/Developer/OFFERTE-WIJS
npm run agent:dataflow          # sync + validatie (default --fix)
npm run agent:dataflow:check    # alleen rapporteren, geen copy
```

## Registry

`data/data-flow-registry.json` — lijst van streams (queue, leads, outreach, agents-status, reports, …).

Status na elke run: `data/data-flow-status.json` + `public/data-flow-status.json`.

## Wat de agent doet

1. **File streams** — hash-vergelijk `data/*` vs `public/*`, kopieer bij drift
2. **Reports** — `data/reports/*.json|md` → `public/reports/` + herbouw `index.json`
3. **Public-only** — `health.json`, `maarten-ideeen.json` (alleen valideren)
4. **Cross-check** — o.a. `totaal` vs `leads.length`, queue/leak drift hint
5. **patchAgent** — `data-flow` in `agents-status.json`

## Wanneer draaien

- Vóór **deploy** of na bulk scan/lead/outreach
- CI: elke 2u + na scan-batch
- Manager signaleert drift → `npm run agent:dataflow`

## Triggers

**"dataflow"**, **"data stromen"**, **"sync public"**, **"alles naar pages"**

## Andere agents

Lead Hunter, Outreach, Optimizer kopiëren soms zelf naar `public/` — Data-flow **centraliseert** en vangt gemiste mirrors op. Nieuwe stream? Voeg toe aan registry + commit.