# Bewijs aan de klant — geen “lucht”

De klant moet **zelf** kunnen controleren dat jij meetbare feiten hebt, geen vermoeden.

## Wat je in het gesprek zegt (30 sec)

1. **“We hebben niet ingelogd.”** Passieve check: browser-achtige GET op publieke URL’s.
2. **“Plak deze link zelf.”** `controleUrl` uit dashboard / WhatsApp (phpMyAdmin of ander paneel).
3. **“Dit is ons scanrapport.”** Link naar `https://mikevisser0904.github.io/OFFERTE-WIJS/reports/{reportId}.json` — open JSON met datum, score en `evidence`-URL’s.
4. **“Zelfde als live check.”** Noem HTTP-status en paginatitel (staat in bericht onder BEWIJS).

## Waar het vandaan komt

| Bron | Wat het bewijst |
|------|------------------|
| `npm run lead:berichten` | Vult `verkoopBericht`, `scanBewijs`, live `adminProof` |
| `data/reports/*.json` | Eerste scan + findings met evidence-URL |
| `haalAdminBewijs` | Hercontrole op moment van bericht-generatie |

## Bellen / scherm delen

1. Open **zelf** de controle-URL in een incognito-tab (klant ziet hetzelfde).
2. Open **scanrapport-JSON** — wijs `scannedAt` en `evidence` aan.
3. Pas daarna Website Veilig €299 aanbieden.

## Niet doen

- Zeggen “wij zitten in uw database” zonder echte login met toestemming.
- Alleen score noemen zonder URL of rapport.
- Oude berichten gebruiken na `consent:scrub` of uitsluiting — check dashboard “herstel”.