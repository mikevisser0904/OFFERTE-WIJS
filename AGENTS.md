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
