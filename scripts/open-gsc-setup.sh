#!/bin/bash
# Opent Google Search Console met juiste property-URL
SITE="https://mikevisser0904.github.io/OFFERTE-WIJS/"
SITEMAP="https://mikevisser0904.github.io/OFFERTE-WIJS/sitemap.xml"

open "https://search.google.com/search-console/welcome"
open "https://search.google.com/search-console/sitemaps?resource_id=${SITE}"

echo "GSC stappen:"
echo "1. Property toevoegen → URL-prefix → $SITE"
echo "2. Verificatie → HTML-tag → kopieer content= waarde"
echo "3. Zet in GitHub: Settings → Secrets → GOOGLE_SITE_VERIFICATION"
echo "4. Sitemap indienen: $SITEMAP"