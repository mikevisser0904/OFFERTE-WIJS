#!/usr/bin/env node
import { readFileSync, writeFileSync, copyFileSync } from "fs";
import { join } from "path";

const root = process.cwd();
const queuePath = join(root, "data/scan-queue.json");
const publicQueue = join(root, "public/scan-queue.json");

const q = JSON.parse(readFileSync(queuePath, "utf8"));
const seen = new Set();
q.items = (q.items || []).filter((i) => {
  if (i.url.includes("neverssl.com") || i.url.includes("example.com")) return false;
  const key = i.url.replace(/\/$/, "").toLowerCase();
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});
q.updatedAt = new Date().toISOString();
writeFileSync(queuePath, JSON.stringify(q, null, 2));
copyFileSync(queuePath, publicQueue);
const pending = q.items.filter((i) => i.status === "pending").length;
console.log(`Queue schoon: ${q.items.length} items, ${pending} pending`);