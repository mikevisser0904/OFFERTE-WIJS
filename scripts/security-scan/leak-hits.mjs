import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "fs";
import { join } from "path";

const root = process.cwd();
const dataPath = join(root, "data/leak-hits.json");
const publicPath = join(root, "public/leak-hits.json");

export function loadHits() {
  try {
    return JSON.parse(readFileSync(dataPath, "utf8"));
  } catch {
    return { updatedAt: null, hits: [] };
  }
}

export function appendHit(entry) {
  const store = loadHits();
  const key = `${entry.url}:${entry.reportId}`;
  store.hits = store.hits.filter((h) => `${h.url}:${h.reportId}` !== key);
  store.hits.unshift(entry);
  store.updatedAt = new Date().toISOString();
  if (store.hits.length > 2000) store.hits = store.hits.slice(0, 2000);
  mkdirSync(join(root, "data"), { recursive: true });
  mkdirSync(join(root, "public"), { recursive: true });
  writeFileSync(dataPath, JSON.stringify(store, null, 2));
  copyFileSync(dataPath, publicPath);
  return store;
}

export function isLeakFinding(f) {
  return f.check === "database" || f.check === "datalek";
}

export function hasLeakFindings(findings) {
  return findings.some(isLeakFinding);
}