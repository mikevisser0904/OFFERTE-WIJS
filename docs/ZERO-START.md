# €0 opstart — verkopen (geen VakScan-schrik)

**Doel:** eerste order via Fiverr, Marktplaats of bekenden.  
**Demo:** https://mikevisser0904.github.io/OFFERTE-WIJS/demo/

## Jij (week 1)

1. **Fiverr** — gig plakken uit `docs/FIVERR.md` (EN, ±30 min)
2. **Marktplaats** — zelfde aanbod, blok “Marktplaats” in dat bestand
3. **2 bekenden** — demo-link + prijs (€349–499 NL / $199 Fiverr)

## Bij een order

```bash
npm run order:intake -- --bedrijf "Naam BV" --kanaal fiverr --prijs 199 --email klant@mail.nl
```

→ Maarten-wachtrij + ntfy. Checklist: `docs/FIVERR.md` § Levering.

## Grok / GitHub (achtergrond)

- SEO-landingen (gratis traffic, traag)
- Geen automatische lek-WhatsApp (tenzij `VAKSCAN_SALES=1` in Actions)

## SEO 1× (gratis)

```bash
npm run setup:gsc
```

Sitemap indienen in Google Search Console.