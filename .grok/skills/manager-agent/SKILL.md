---
name: manager-agent
description: Managende agent — houdt Lead Hunter, VakScan, Outreach, Autopilot en site-health in de gaten. Eén grokPrompt en Mike-actie. Gebruik bij "manager", "agent hub", "wat moet er nu", "alles in de gaten".
---

# Manager Agent (OFFERTE-WIJS)

**Rol:** Baas van het agent-team. Jij volgt **één prompt**, niet vijf losse scripts.

## Run

```bash
cd ~/Developer/OFFERTE-WIJS
npm run agent:manager
```

Met automatische sub-stappen (voorzichtig):

```bash
npm run agent:manager:run
```

## Leest / schrijft

- In: health, queue, leak-hits, outreach, leads, maarten-wachtrij, agents-status
- Uit: `data/manager-status.json`, update `agents-status.json`, **overschrijft** `autopilot-status.nextAgentPrompt`

## UI

**/agents/** — bovenin: fase, agent-kaarten (groen/rood), Grok-prompt kopiëren, Mike-actie

## Fases (prioriteit)

1. **site** — site unhealthy → fix eerst  
2. **bouw** — Maarten pending → wachtrij  
3. **verkopen** — lekken / outreach klaar → Mike  
4. **scan** — veel pending, oude scan → `scan:leaks`  
5. **prospectie** — weinig leads → `agent:leads`  
6. **rust** — monitor of pipeline

## Triggers Mike → Grok

- **"manager check"**, **"wat moet er nu"**, **"agent hub"**, **"alles in de gaten"**

## Pipeline (onder manager)

`npm run agent:pipeline` blijft bestaan; daarna altijd `npm run agent:manager` voor status.