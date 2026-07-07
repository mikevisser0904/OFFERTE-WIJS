<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# OFFERTE-WIJS — agent instructies

Repo: `~/Developer/offerte-wijs` · Live: https://mikevisser0904.github.io/OFFERTE-WIJS/

Mike verkoopt, Maarten bouwt. Static Next.js export op GitHub Pages — **geen server API routes**.

## Maarten-wachtrij (ideeën doorvoeren)

Maarten deelt ideeën via het formulier op `/ideeen/` of in de goudzoeker-agent. Ze komen binnen via ntfy en worden elke 5 min gesynchroniseerd naar:

- `data/maarten-wachtrij.json` — canoniek (voor jou als agent)
- `public/maarten-wachtrij.json` — zelfde inhoud (voor UI op GitHub Pages)

### Trigger

Als Mike zegt: **"voer maarten wachtrij uit"**, **"verwerk maarten ideeën"**, of vergelijkbaar:

1. Lees `data/maarten-wachtrij.json`
2. Pak alle items met `status: "pending"` (oudste eerst als meerdere)
3. Voer elk idee uit in de codebase — kies zelf de beste implementatie
4. Build moet slagen: `GITHUB_PAGES=true npm run build`
5. Update het item in **beide** JSON-bestanden:
   - `status`: `"klaar"`
   - `uitgevoerdOp`: ISO-datum (bijv. `2026-07-07T14:30:00.000Z`)
   - `notitie`: korte samenvatting wat je deed
6. Commit + push met duidelijke message (bijv. `feat: maarten-wachtrij — configurator-idee`)

Bij `status: "bezig"` — iemand is al bezig; sla over tenzij Mike expliciet vraagt.

Bij onduidelijk of onhaalbaar idee: zet `status: "afgewezen"` + `notitie` met reden. Vraag Mike/Maarten alleen als echt nodig.

### Handmatige sync (lokaal)

```bash
npm run sync:maarten
```

Haalt nieuwe ntfy-berichten op en merged in de wachtrij (behoudt bestaande status).

### Types & helpers

- `lib/maarten-wachtrij.ts` — types, `genereerAgentOpdracht()`, `pendingIdeeen()`
- `lib/maarten-ideeen.ts` — ntfy-parsing, `haalWachtrijOp()`
- `scripts/sync-maarten-wachtrij.mjs` — GitHub Action + lokaal script

### Voorbeeld pending item

```json
{
  "id": "abc123",
  "tekst": "klant X wil configurator",
  "euro": "€899",
  "tijd": 1751890000000,
  "van": "Maarten",
  "status": "pending",
  "agentOpdracht": "## Maarten-idee — uitvoeren...",
  "aangemaakt": "2026-07-07T12:00:00.000Z"
}
```

### Belangrijke paden

| Onderdeel | Pad |
|-----------|-----|
| Goudzoeker | `components/goudzoeker.tsx`, `hooks/use-goudzoeker-wandel.ts` |
| Idee delen | `components/maarten-idee-deel.tsx` |
| Wachtrij UI | `components/maarten-wachtrij-panel.tsx` |
| Integraties | `data/integrations.ts` |
| Geld dashboard | `app/dashboard/page.tsx` |
| Monitor | `app/monitor/page.tsx`, `scripts/health-check.mjs` |
| Team KPI snapshot | `data/kpi-snapshot.json`, `npm run kpi:snapshot` |

## Monitor / geld-dashboard (wekelijks of op verzoek)

Live: **/dashboard/** (doel €10k) · **/monitor/** (KPI + health + integraties)

Als Mike zegt **"monitor check"**, **"dashboard inrichten"**, of **"voer monitor uit"**:

1. Lees `public/health.json` — unhealthy → fix site, push, hercheck
2. Lees `data/integrations.ts` — GSC secret / UptimeRobot nog pending? Documenteer in commit of update status na bevestiging
3. `data/maarten-wachtrij.json` — pending items → **voer maarten wachtrij uit**
4. `GITHUB_PAGES=true npm run build` vóór push
5. Korte status naar Mike: slagingskans-tip, pending count, health OK ja/nee

KPI team-sync: Monitor → Exporteer JSON → `npm run kpi:snapshot -- file.json` → commit `data/` + `public/kpi-snapshot.json`

## Autopilot (volledig geautomatiseerd — zoveel mogelijk)

- **GitHub Action** `.github/workflows/autopilot.yml` — elke 4u + handmatig
- **Script** `node scripts/autopilot-run.mjs` — health, maarten-sync, `autopilot-status.json`, ntfy
- **Dashboard** `/dashboard/` toont status via `AutopilotPanel`
- **Bestelling** → ntfy + KPI `bestellingen++` (client)
- **Actie WhatsApp** → KPI `contactenDezeWeek++`

**Jij (Grok) bij elke ntfy "Goud: agent-wachtrij" of scheduled run:**

1. Open repo `OFFERTE-WIJS`
2. Lees `data/autopilot-status.json` → `nextAgentPrompt`
3. Als pending > 0: **voer maarten wachtrij uit** (build, commit, push)
4. Anders: monitor check + 1 verbetering richting verkoop (SEO, actie, verkoopkit)

Geen menselijke stappen voor site-health of wachtrij-sync — alleen **verkopen** (actie) en **goedkeuren** blijft bij Mike.

## VakScan (veiligheid → verkopen Website Veilig)

Live UI: **/scan/** · Rapporten: `public/reports/` · Queue: `data/scan-queue.json`

**Passief:** publieke HTTP(S)-checks + bekende misconfiguratie-paden (phpMyAdmin, Adminer, Elastic/Mongo UI, `.env`, SQL-dumps). **Geen** poortscan, SQL-injectie, inlog of brute force.

### Commando's

```bash
npm run scan -- https://bedrijf.nl --bedrijf "Naam" --plaats Utrecht
npm run scan:batch              # volledige check, 10 pending
npm run scan:import -- data/jouw-urls.txt
npm run scan:leaks              # alleen database/datalek-paden, 200 pending, parallel 4
VAKSCAN_LIMIT=2000 VAKSCAN_CONCURRENCY=5 npm run scan:leaks   # grote lijst lokaal
```

Bulk leak-scan slaat **geen** rapport op voor schone sites (alleen `data/leak-hits.json` + rapport bij treffer).

Verbeteringen & roadmap: `docs/VAKSCAN.md` · stats: `data/scan-stats.json`

### Agent / Mike workflow

1. URL + bedrijf in queue (`data/` + `public/scan-queue.json`, status `pending`)
2. Lokaal `npm run scan` of wacht op **scan-batch** Action (03:00 UTC + handmatig)
3. Rapport in `data/reports/<id>.json` + `public/reports/` — kopieer WhatsApp uit rapport of `/scan/`
4. Verkoop via **Website Veilig** (€299) + template `vakscan` in `data/verkoop.ts` → `/actie/`

**Disclaimer** staat in elk rapport en op `/scan/`: alleen met toestemming eigenaar of als aangeboden gratis check.

## Lead hunter (potentiële klanten — aparte agent-taak)

Skill: `.grok/skills/lead-hunter/SKILL.md` · UI: **/leads/**

Als Mike zegt **"potentiële klanten"**, **"leads"**, **"vul queue"**:

1. `npm run lead:hunt` (OSM → `data/potentiele-klanten.json` + import queue)
2. Optioneel `LEAD_SCAN=1 npm run lead:hunt` of `npm run scan:leaks`
3. Commit `data/`, `public/potentiele-klanten.json`, queue, leak-hits
4. Mike: **/leads/** → top targets → **/scan/** hits → **/actie/** WhatsApp

### Klanten-lek (database per klant)

Skill: `.grok/skills/klanten-lek-agent/SKILL.md` · UI: **/leads/** (database-tabel)

```bash
npm run agent:klanten-lek
KLANTEN_LEK_LIMIT=184 npm run agent:klanten-lek   # alle OSM-leads
```

Output: `data/klanten-database-export.json` (dbType, host, dbName, user, panel, SQL-tabellen). **Geen wachtwoorden** in repo.

Geen verzonnen bedrijven — alleen OSM + handmatige aanvullingen in `data/klanten-leads-import.txt`.

### Verkoop met admin-bewijs (strikt)

- **Wel:** publieke URL naar phpMyAdmin/Adminer-inlogscherm in bericht; klant opent zelf; scherm delen op belletje.
- **Niet:** inloggen, wachtwoorden proberen, data downloaden, beweren *"wij zitten in uw admin"*.
- Copy: *"admin-voordeur staat open op internet"* + `bewijsUrl` uit `npm run lead:berichten`.

## Agent-team — één taak = één agent

Live hub: **/agents/** · Registry (bron): `data/agents-registry.json` (+ skill per agent in `.grok/skills/<id>/`)

| Agent | Taak | Commando |
|-------|------|----------|
| **Data-flow** | Alle `data/` → `public/` streams | `npm run agent:dataflow` |
| **Optimizer** | Continu meten + veilige fixes + Grok-wachtrij | `npm run agent:optimizer:apply` |
| **Data-flow** | Alle `data/` → `public/` streams | `npm run agent:dataflow` |
| **Manager** | Orchestratie | `npm run agent:manager` |
| **Health Monitor** | Site ping | `npm run agent:health` |
| **Maarten Sync** | ntfy → wachtrij | `npm run agent:maarten-sync` |
| **Maarten Bouw** | Pending ideeën bouwen | `npm run agent:maarten-bouw` → Grok voert uit |
| **Lead Hunter** | OSM leads → queue | `npm run agent:leads` |
| **Klanten-lek** | Leads → echte lek + database-profiel | `npm run agent:klanten-lek` |
| **VakScan Import** | URL-lijst → queue | `npm run agent:vakscan-import` |
| **VakScan Leaks** | Database-lek scan | `npm run agent:vakscan-leaks` |
| **VakScan Full** | Volledige scan | `npm run agent:vakscan-full` |
| **Outreach** | Verkooplijst Mike | `npm run agent:outreach` |
| **SEO** | Sitemap / IndexNow | `npm run agent:seo` |
| **KPI** | Snapshot team-KPI | `npm run agent:kpi` |
| **Deploy Pages** | Push → GitHub Pages | `git push` + workflow deploy |

**Mike → Grok:** `manager check` (start hier). Status: `data/agents-status.json` per agent-id.

```bash
npm run funnel            # dataflow → leads (+scan) → outreach → manager (canoniek)
npm run funnel:light      # zonder zware leak-scan
npm run agent:pipeline    # alias voor funnel
npm run agent:status      # health + sync + bouw-hint + outreach + manager
npm run autopilot         # dataflow + health + sync + optimizer (meten) + manager + ntfy
```

**Optimizer** draait ook elke **6 uur** in CI (`.github/workflows/optimizer-agent.yml`).  
Grok-taken: `data/optimizer-wachtrij.json` — trigger: **optimizer wachtrij**.

Legacy: `npm run scan:leaks` = zelfde als `agent:vakscan-leaks`.

## Data-flow (alle datastromen)

Skill: `.grok/skills/data-flow-agent/SKILL.md` · Registry: `data/data-flow-registry.json` · Status: **/agents/** (Data-flow blok)

Als Mike zegt **"dataflow"**, **"sync public"**, of na bulk scan/leads/outreach:

1. `npm run agent:dataflow` — kopieert drift, herbouwt `public/reports/index.json`, valideert JSON
2. `npm run agent:dataflow:check` — alleen audit (geen copy)
3. Commit `data/` + `public/` vóór deploy

Nieuwe JSON voor de UI? Voeg stream toe in `data-flow-registry.json`, niet alleen los `copyFileSync` in scripts.

## Groot plan (visie & fases)

UI: **/visie/** · Data: `data/groot-plan.ts` · `GROOT-PLAN.md`

Fase 1 = agent-funnel naar €10k. Bij "groots bouwen" / strategie: lees groot-plan, werk alleen aan **nu**-fase tenzij Mike vraagt om Fase 2+.
