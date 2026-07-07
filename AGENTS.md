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
npm run scan:batch   # max 10 pending uit queue
```

### Agent / Mike workflow

1. URL + bedrijf in queue (`data/` + `public/scan-queue.json`, status `pending`)
2. Lokaal `npm run scan` of wacht op **scan-batch** Action (03:00 UTC + handmatig)
3. Rapport in `data/reports/<id>.json` + `public/reports/` — kopieer WhatsApp uit rapport of `/scan/`
4. Verkoop via **Website Veilig** (€299) + template `vakscan` in `data/verkoop.ts` → `/actie/`

**Disclaimer** staat in elk rapport en op `/scan/`: alleen met toestemming eigenaar of als aangeboden gratis check.
