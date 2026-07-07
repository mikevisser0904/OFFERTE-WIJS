---
name: health-monitor
description: Agent site-health — pingt GitHub Pages routes. Trigger: health check, site down. Run npm run agent:health
---

# Health Monitor Agent

`npm run agent:health` → `scripts/health-check.mjs` → `public/health.json`

Bij unhealthy: **Manager** blokkeert verkopen; Grok fix + push + opnieuw health.