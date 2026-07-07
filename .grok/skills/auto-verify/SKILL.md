---
name: auto-verify
description: Auto-verify OFFERTE-WIJS — hercontroleert actionable leak-hits, phpMyAdmin-verify, consent (individualConsent), ververst lead:berichten. Gebruik bij "auto verify", "verify:auto".
---

# Auto-verify

```bash
npm run agent:auto-verify
# alias
npm run verify:auto
```

## Wat het doet

1. `consent:scrub`
2. Optioneel `consent:activate` als `data/auto-verify.json` → `autoActivateHits` + `mikeToestemming`
3. `scan:verify-pma`
4. Live recheck evidence URLs (actionable hits)
5. Consent deep **alleen** `individualConsent` entries
6. `lead:berichten` + `data-flow`

Status: `data/auto-verify-status.json`

## Config

`data/auto-verify.json` — geen secrets.

## CI

Elke 4u: `.github/workflows/auto-verify.yml`

## Grens

Geen massa-inlog, geen klantdata-export. `auth-verify` alleen met `scan-toestemming.local.json` per site.