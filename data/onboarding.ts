export const klantIntake = `KLANT INTAKE — stuur dit naar Grok, wij bouwen de site

Bedrijfsnaam:
Telefoon:
E-mail:
Regio/plaats:
Diensten (bijv. screens, rolluiken):
Logo (bijlage of link):
Kleuren (of: kies voor mij):
Teksten (of: schrijf voor mij):
Pakket (slug): spoed-hulp / listings-setup / seo-starter / google-start / landing-snel / vakman-site / …
Deadline gewenst:`;

export const factuurTemplate = `FACTUUR

Van: Mike Visser + Maarten (opdevlugt-tech)
Aan: [BEDRIJF]
Datum: [DATUM]

Omschrijving: [Pakket naam]
Bedrag: €[PRIJS] excl. BTW
BTW 21%: €[BTW]
Totaal: €[TOTAAL]

Betaling: 50% vooraf (Tikkie), rest bij oplevering — spoed €50 volledig vooraf
IBAN: [INVULLEN]`;

/** Bellen na schriftelijke toestemming voor diepere VakScan */
/** Na false positive scan (bijv. Ambiance) — plak naar klant */
export const excuusScanFout = `Beste [BEDRIJF],

Mike van DoekoeWijs. Dank voor uw toestemming om mee te kijken.

Na handmatige controle: onze eerdere melding over een open database-beheer (phpMyAdmin) op uw website was onjuist. Dat kwam door een fout in onze automatische scan (een gewone WordPress-pagina, geen database-inlog).

Excuses voor de zorg en uw tijd. Wij hebben niet ingelogd op uw systemen en geen gegevens uit uw database gehaald.

Als u wilt, licht ik kort toe wat wij wél hebben gedaan (alleen publieke, passieve checks).

Vriendelijke groet,
Mike`;

export const belscriptToestemming = `BELSCRIPT — klant gaf toestemming (Website Veilig / diepere check)

1. "Dank voor uw toestemming — ik noteer dat u [datum] akkoord gaf voor een veiligheidscheck op [domein]."
2. "We loggen niet zomaar in op systemen van anderen; bij u mag het omdat u dat expliciet vroeg."
3. Deel scherm: open de bewijs-URL uit het rapport (phpMyAdmin/Adminer) — laat zien wat íedereen kan zien zonder wachtwoord.
4. Als u inloggegevens gaf: "Met úw gegevens hebben we alleen gecontroleerd of het paneel echt bereikbaar is — we hebben geen klantdata gedownload."
5. Afsluiten: "Website Veilig €299 — binnen 2 werkdagen dichten we dit + kort rapport. Zal ik de factuur sturen?"

Vastleggen: vul data/scan-toestemming.json (consentRef = mail/WhatsApp) → npm run scan:consent → npm run lead:berichten`;