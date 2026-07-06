# Mike + Maarten — projectinspiratie

Jullie hebben bewezen dat samenwerken werkt: **ZonComfort-site**, git-flow, Grok aan beide kanten.

## 5 ideeën (kort)

### 1. OfferteWijs ⭐ (dit project)
**Wat:** Offerte in 2 minuten voor vakbedrijven (zonwering, kozijnen, schilders).  
**Waarom jullie:** configurator + prijzen + mooie UI al gedaan bij ZonComfort.  
**Geld:** SaaS €29/maand per bedrijf, of white-label per installateur.  
**Mike:** product, prijslogica, klantcontact. **Maarten:** UI, flows, deploy.

### 2. KlusBoard Web
**Wat:** Webversie van Mikes renovatie-app — uren, materialen, planning.  
**Waarom:** Mike heeft de app al; Maarten maakt dashboard + delen met opdrachtgever.  
**Geld:** freemium voor zzp'ers.

### 3. ZonScan
**Wat:** Foto van raam uploaden → AI schat maat + productadvies + prijsrange.  
**Waarom:** wow-factor voor zonwering-klanten, viral potentie.  
**Geld:** leads verkopen aan installateurs.

### 4. InstallateurKit (template-verkoop)
**Wat:** Jullie ZonComfort-site als template — ander bedrijf, andere kleuren, zelfde motor.  
**Waarom:** eenmalig bouwen, meerdere keren verkopen.  
**Geld:** €499 eenmalig + hosting.

### 5. Beslisser (beslisser-app)
**Wat:** "Moet ik dit wel/niet doen?" — renovatie, aankoop, klus.  
**Waarom:** Mike had dit al als Expo-idee; web + app combo.  
**Geld:** affiliate (bol.com gereedschap), premium tips.

---

## Waarom OfferteWijs als eerste?

| Criterium | Score |
|-----------|-------|
| Bouwt voort op ZonComfort | ✅✅✅ |
| Duidelijke klant (zzp vakman) | ✅✅ |
| Snel MVP (2–3 weken) | ✅✅ |
| Jullie rollen passen | ✅✅✅ |
| Geld verdienen realistisch | ✅✅ |

---

## MVP OfferteWijs (versie 0.1)

1. Bedrijfsnaam + logo upload
2. Product kiezen (zonwering, rolluik, …)
3. Maten + opties
4. **PDF-offerte** of shareable link
5. Dashboard: openstaande offertes

**Niet in v0.1:** betalingen, multi-user, app.

---

## Wie doet wat (voorstel)

| Mike | Maarten |
|------|---------|
| `data/products.ts` prijzen | `app/` pagina's |
| Klantgesprekken / validatie | Componenten + styling |
| `lib/pricing.ts` | PDF/export |
| Deploy + domein later | Logo/branding per klant |

Afspraak: **git pull → werk → push**, net als ZonComfort.