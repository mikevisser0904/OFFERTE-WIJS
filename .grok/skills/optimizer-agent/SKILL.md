---
name: optimizer-agent
description: Optimaliseert continu OFFERTE-WIJS funnel — meet, past veilig aan (queue, outreach, scan), zet Grok-taken in optimizer-wachtrij. Gebruik bij "optimaliseer", "optimizer", "verbeter automatisch".
---

# Optimizer Agent

**Rol:** Constant verbeteren zonder chaos — **meten → veilig fixen → code-taken voor Grok**.

## Commando's

```bash
cd ~/Developer/OFFERTE-WIJS
npm run agent:optimizer          # audit alleen
npm run agent:optimizer:apply    # voert veilige fixes uit
```

## Veilig automatisch (--apply)

- Demo-URL's uit scan-queue
- Rapport-index sync
- Outreach verversen als lekken oud zijn
- VakScan leaks als queue vastloopt
- Lead Hunter (max 1× per 20u, als weinig leads)

## Grok-wachtrij

`data/optimizer-wachtrij.json` — performance, betere leads, site fix.  
Als Mike zegt **"optimizer wachtrij"**: pak `pending`, bouw in repo, zet `status: klaar`.

## Constant draaien

- GitHub Action: `.github/workflows/optimizer-agent.yml` (elke 6u, `--apply`)
- Na elke run: **Manager** leest `optimizerHint`

## Triggers

**"optimizer"**, **"optimaliseer"**, **"verbeter het systeem"**

## KPI

Optimizer stuurt Mike als outreach klaar maar `contactenDezeWeek === 0`.