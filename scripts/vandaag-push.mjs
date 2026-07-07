#!/usr/bin/env node
/** Extra push: ntfy met /start/ + /actie/ — geen VakScan */
const NTFY = process.env.VAKSCAN_NTFY_TOPIC || "webklaar-mike";
const start = "https://mikevisser0904.github.io/OFFERTE-WIJS/start/";
const actie = "https://mikevisser0904.github.io/OFFERTE-WIJS/actie/";

const body = [
  "Geld vandaag:",
  "1) Deel " + start + " naar 5 warme contacten",
  "2) Of /actie/ - Verstuur-knoppen",
  "3) Bij ja: 150 euro Tikkie (Google Start)",
].join("\n");

const r = await fetch(`https://ntfy.sh/${NTFY}`, {
  method: "POST",
  headers: {
    Title: "Deel /start/ nu",
    Priority: "urgent",
    Tags: "moneybag",
    Click: actie,
  },
  body,
});
console.log(r.ok ? "push OK" : "push fail");