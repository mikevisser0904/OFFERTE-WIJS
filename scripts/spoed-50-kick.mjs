#!/usr/bin/env node
const NTFY = "webklaar-mike";
const url = "https://mikevisser0904.github.io/OFFERTE-WIJS/spoed/";
const body = [
  "€50 in 1 uur project staat klaar",
  "1) Marktplaats copy op /actie/",
  "2) Publiceer + app SPOED",
  url,
].join("\n");
const r = await fetch(`https://ntfy.sh/${NTFY}`, {
  method: "POST",
  headers: { Title: "Spoed 50 euro plan", Priority: "urgent", Click: url },
  body,
});
console.log(r.ok ? "ok" : "fail");