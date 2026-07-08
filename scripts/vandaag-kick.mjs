#!/usr/bin/env node
/** Stuurt Mike een urgente ntfy — open /actie/ en stuur 5 WhatsApps */
const NTFY = process.env.VAKSCAN_NTFY_TOPIC || "webklaar-mike";
const url = "https://mikevisser0904.github.io/OFFERTE-WIJS/actie/";
const diensten = "https://mikevisser0904.github.io/OFFERTE-WIJS/diensten/";
const show = "https://mikevisser0904.github.io/OFFERTE-WIJS/show/";

const body = [
  "Vandaag geld — internetdiensten:",
  "1. Open " + url,
  "2. Kies bericht (internet-menu) + 5 nummers",
  "3. 5x Verstuur -> 5/5",
  "Deel: " + show,
  "Catalogus: " + diensten,
  "Snel: Spoed 50 | Listings 149 | SEO 199 | Google 299",
].join("\n");

const r = await fetch(`https://ntfy.sh/${NTFY}`, {
  method: "POST",
  headers: {
    Title: "Vandaag geld - 5 WhatsApps",
    Priority: "urgent",
    Tags: "moneybag,rotating_light",
    Click: url,
  },
  body,
});
console.log(r.ok ? "ntfy OK" : "ntfy fail " + r.status);