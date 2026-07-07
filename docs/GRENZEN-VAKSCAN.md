# Grenzen VakScan (rode lijn)

## Wel (met toestemming in `scan-toestemming.json`)

| Actie | Waarom geen “inbraak” |
|--------|------------------------|
| GET op phpMyAdmin / .env / SQL-dump | Zelfde als bezoeker; publiek bereikbaar |
| Dashboard **zonder** inlog zichtbaar | Systeem staat open — misconfiguratie bewijzen |
| **Eén** login-POST met wachtwoord uit **publieke** .env van díe site | Geheim lag al op straat; geen raden |
| **Eén** login-POST per klant-inlog in `local.json` | Klant gaf credentials |
| **Max 5** vaste phpMyAdmin-misconfig-paren (zie onder) | Alleen met `VAKSCAN_DEFAULT_CREDS=1` + `individualConsent` — geen woordenlijst |

## Niet

- Wachtwoordlijsten / Hydra / duizenden pogingen  
- Sites **zonder** toestemming-entry  
- Data exporteren (tabellen/rijen dumpen) — alleen bewijzen dat toegang **kan**  
- “Inlogscherm zichtbaar” = **niet** automatisch rechten om wachtwoorden te raden  

## Rode lijn in één zin

**Openstaan = passief zien of binnen zonder wachtwoord.**  
**Dicht maar bereikbaar inlogscherm = alleen testen met gegeven of gelekt geheim, of expliciete default-check (5).**

## Commando’s

```bash
npm run scan:toegang
VAKSCAN_DEFAULT_CREDS=1 npm run scan:toegang   # +5 defaults, alleen met consent
```