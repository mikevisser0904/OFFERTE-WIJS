# Kwetsbaarheden — kaart + oplossing (WebKlaar)

Voor verkoop na VakScan. Gebaseerd op jullie echte hits (15 vakmannen, 2026-07).

---

## Ernst (voor klantgesprek)

| Niveau | Betekenis |
|--------|-----------|
| **Kritiek** | Iedereen kan database/config zien of zonder wachtwoord beheren |
| **Hoog** | Beheer-login op internet; bots kunnen aanvallen |
| **Middel** | Verouderde site, zwak HTTPS/headers, WP-login zichtbaar |
| **Laag** | Verbeterpunten zonder direct datalek |

---

## Wat jullie nu het meest zien

### 1. phpMyAdmin / database-beheer bereikbaar (HOOG — jullie hoofd-case)

**Wat:** MySQL-beheer (phpMyAdmin) via HTTP(S) bereikbaar — vaak op **hosting-subdomein** (`s205.webhostingserver.nl`) of soms op **eigen domein** (`/phpmyadmin/`).

**Risico:** Automatische scans + wachtwoord-gokken; bij zwak/lekt wachtwoord → klantdata, offertes, mail.

**Bewijs zonder inlog:** `adminProof.ok`, `scan:risico-passief`, link in rapport.

**Oplossing (Website Veilig €299 + evt. hosting):**
- phpMyAdmin alleen via VPN / IP-whitelist / hosting-panel
- Pad verwijderen of verplaatsen; geen publieke URL
- Sterk uniek DB-wachtwoord; geen hergebruik
- Overweeg: DB niet via publiek paneel, alleen lokaal/phpMyAdmin via SSH-tunnel

**Verkoopzin:** *“Deze beheer-URL reageert publiek — plak hem zelf; wij schermen af binnen 2 dagen (€299).”*

---

### 2. Gedeelde hosting zichtbaar (HOOG / context)

**Wat:** Lek wijst naar **gedeelde host** (webhostingserver.nl, hostingcp.eu) — klant herkent eigen site niet direct in URL.

**Risico:** Zelfde als (1); plus andere sites op server kunnen risico vergroten.

**Oplossing:** Zelfde als (1) + hostingpartij: “alleen localhost voor pma” + aparte site-isolatie bespreken.

---

### 3. Config-bestanden (.env, wp-config.bak) (KRITIEK als echt lekbaar)

**Wat:** `/.env` of backup met `DB_PASSWORD`, `DB_USER`, `APP_KEY`.

**Risico:** Inloggegevens staan op straat — geen “inbraak” nodig om te **lezen**.

**Oplossing:**
- Bestand uit public webroot
- Nieuwe DB- en app-secrets roteren
- `.htaccess` / server deny op gevoelige paden

**Jullie data:** sommige `.env`-URLs zijn in feite HTML/404 — altijd **live verifiëren** (`scan:toegang`).

---

### 4. SQL-dumps publiek (KRITIEK)

**Wat:** `backup.sql`, `dump.sql` met `CREATE TABLE` / `INSERT`.

**Risico:** Volledige database-export voor iedereen downloadbaar.

**Oplossing:** Verwijderen van webserver; backups alleen off-site encrypted.

---

### 5. Overige panelen (middel–hoog, zeldzamer in jullie set)

| Type | VakScan-check |
|------|----------------|
| Adminer | Zelfde aanpak als phpMyAdmin |
| Elasticsearch / Mongo UI | Afsluiten of auth + firewall |
| Redis UI | Idem |
| `.git` open | Repo + secrets lekken — verwijderen + keys roteren |

---

### 6. Basis website (volledige scan — Website Veilig)

| Check | Kwetsbaarheid | Fix |
|-------|---------------|-----|
| Geen HTTPS / cert | Man-in-the-middle, wantrouwen | SSL + redirect |
| Geen HSTS / headers | Clickjacking, XSS-kans | Headers |
| `/wp-login` open | Brute force op CMS | Limit login, 2FA, hide |
| Oud WordPress | Bekende exploits | Update of nieuwe static site |
| Cookies zonder Secure | Sessie-diefstal | Cookie-flags |

---

## Aanbod koppelen

| Klantprofiel | Product |
|--------------|---------|
| Alleen phpMyAdmin / lek | **Website Veilig €299** |
| Lek + oude site | **Website Veilig** → upsell **Vakman site €899** |
| Geen lek, wel slechte score | **Website Veilig** of **Google Start €299** |

---

## Intern (jullie proces)

```bash
npm run scan:risico-passief    # deuren op internet
npm run scan:toegang           # echt erin? (open/config/local)
npm run scan -- <url>          # volledig rapport
```

Data: `toegang-scan.json`, `leak-hits.json`, `reports/`, `/dashboard/`.

**Geen brute force** — kaart gebaseerd op passieve + toegestane actieve checks (`docs/GRENZEN-VAKSCAN.md`).