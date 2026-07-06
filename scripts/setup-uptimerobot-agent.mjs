#!/usr/bin/env node
/**
 * UptimeRobot Quick Monitor Setup (AI agent flow)
 * https://uptimerobot.com/quick-monitor-setup/
 */
import { createHash } from "node:crypto";

const EMAIL = process.env.MONITOR_EMAIL || "mikevisser0904@gmail.com";
const BASE = "https://mikevisser0904.github.io/OFFERTE-WIJS";

const URLS = [
  `${BASE}/`,
  `${BASE}/bestellen/`,
  `${BASE}/diensten/`,
  `${BASE}/sitemap.xml`,
];

function solvePow(nonce, difficulty) {
  let counter = 0;
  while (true) {
    const h = createHash("sha256").update(`${nonce}|${counter}`).digest();
    let zeros = 0;
    for (const byte of h) {
      if (byte === 0) zeros += 8;
      else {
        zeros += 8 - Math.floor(Math.log2(byte)) - 1;
        break;
      }
    }
    if (zeros >= difficulty) return counter;
    counter++;
    if (counter % 500000 === 0) process.stderr.write(".");
  }
}

async function createMonitor(url) {
  const challengeUrl = `https://api.uptimerobot.com/agentic/agent-monitor/challenge?email=${encodeURIComponent(EMAIL)}&url=${encodeURIComponent(url)}`;
  const challengeRes = await fetch(challengeUrl);
  if (!challengeRes.ok) throw new Error(`Challenge failed ${url}: ${challengeRes.status}`);
  const { nonce, timestamp, difficulty, signature } = await challengeRes.json();

  process.stderr.write(`\nPoW ${url} (difficulty ${difficulty})...`);
  const counter = solvePow(nonce, difficulty);
  process.stderr.write(` done (${counter})\n`);

  const submitRes = await fetch("https://api.uptimerobot.com/agentic/agent-monitor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: EMAIL,
      url,
      nonce,
      timestamp,
      counter,
      signature,
    }),
  });

  const body = await submitRes.json();
  return { url, status: submitRes.status, body };
}

console.log(`UptimeRobot setup voor ${EMAIL}\n`);

const results = [];
for (const url of URLS) {
  try {
    results.push(await createMonitor(url));
    await new Promise((r) => setTimeout(r, 2000));
  } catch (e) {
    results.push({ url, error: String(e) });
  }
}

console.log(JSON.stringify(results, null, 2));
console.log("\n→ Check inbox:", EMAIL, "— klik elke activatielink van UptimeRobot");