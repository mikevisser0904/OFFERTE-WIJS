---
name: outreach-agent
description: Tweede sales-agent — prioriteert wie Mike vandaag belt/WhatsAppt op basis van VakScan-lekken en scores. Gebruik bij "wie bellen", "outreach", "verkoop vandaag", "agent outreach".
---

# Outreach Agent (OFFERTE-WIJS)

**Rol:** Mike hoeft niet te zoeken — jij levert een **gesorteerde bellen/WhatsApp-lijst**.

## Run

```bash
cd ~/Developer/OFFERTE-WIJS
npm run agent:outreach
```

Leest: `leak-hits.json`, `reports/index.json`, `scan-queue.json`, `potentiele-klanten.json`  
Schrijft: `data/outreach-vandaag.json` + `public/` + `agents-status.json`  
UI: **/agents/** → kopieer WhatsApp per contact

## Prioriteit

1. **Database/datalek** (VakScan hit) → Website Veilig €299, vandaag
2. **Score ≥ 60** → Website Veilig
3. **Score 35–59** → demo + site
4. **Leads in queue, schoon** → koud met demo-link

## Pipeline (samen met Lead Hunter)

```bash
npm run agent:pipeline
```

= leads ophalen → leak-scan → outreach-lijst

## Triggers voor Grok

- Mike: **"agent outreach"**, **"wie moet ik bellen"**, **"verkoop vandaag"**
- Na ntfy **"Outreach: N voor Mike"** → open `/agents/`, geen code tenzij lijst leeg

## KPI

Elk verstuurd bericht via `/actie/` telt `contactenDezeWeek++`.