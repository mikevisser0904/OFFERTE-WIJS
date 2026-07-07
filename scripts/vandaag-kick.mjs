#!/usr/bin/env node
/** Stuurt Mike een urgente ntfy — open /actie/ en stuur 5 WhatsApps */
const NTFY = process.env.VAKSCAN_NTFY_TOPIC || "webklaar-mike";
const url = "https://mikevisser0904.github.io/OFFERTE-WIJS/actie/";
const start = "https://mikevisser0904.github.io/OFFERTE-WIJS/start/";

const body = [
  "Vandaag geld — jouw enige job nu:",
  "1. Open " + url,
  "2. Plak 5 nummers (warm netwerk)",
  "3. 5× Verstuur → teller naar 5/5",
  "4. Deel status-knop op de pagina",
  "Deel naar klanten: " + start,
  "Snelste deal: Google Start €299",
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