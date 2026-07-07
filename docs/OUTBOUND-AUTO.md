# Outbound volledig automatiseren

## Commando

```bash
npm run agent:outbound-auto
```

Pipeline: verkoop-bewijs → outreach → **max 5 contacten** (cooldown 14 dagen per domein).

## Live verzending

| Secret / env | Doel |
|--------------|------|
| `OUTBOUND_LIVE=1` | Echt versturen (zonder = dry-run) |
| `RESEND_API_KEY` | E-mail naar `info@…` uit klantenlijst |
| `OUTBOUND_FROM` | Afzender (default in `outbound-config.json`) |
| `OUTBOUND_WEBHOOK_URL` | Zapier/Make/n8n — elk contact als JSON |
| `WHATSAPP_ACCESS_TOKEN` + `WHATSAPP_PHONE_NUMBER_ID` | Alleen **goedgekeurde templates** (Meta) |

GitHub → Settings → Secrets → Actions.

## CI

- `.github/workflows/outbound-autopilot.yml` — werkdagen 08:00 & 13:00 UTC
- Autopilot (4u): zet `OUTBOUND_IN_AUTOPILOT=1` om outbound mee te draaien

## Kanalen (volgorde)

1. **E-mail** (Resend) — primair voor volledige auto  
2. **Webhook** — koppel eigen WhatsApp/SMS provider  
3. **WhatsApp Cloud** — template-only (`whatsappCloud.enabled` in config)  
4. **ntfy** — digest + WA-knoppen op telefoon (fallback)

## Status

- `public/outbound-status.json` — laatste run  
- `public/outbound-log.json` — historie (geen dubbele spam)  
- KPI `contactenDezeWeek` +1 per **echte** verzending  

## Grenzen

- Geen wachtwoordlijsten / geen spam: `maxPerRun` + `cooldownDays`  
- Alleen klanten met **bewijs-URL** als `alleenMetBewijs: true`  
- Cold mail: houd tekst feit-first (`docs/BEWIJS-AAN-KLANT.md`)