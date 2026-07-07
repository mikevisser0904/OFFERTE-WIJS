import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "fs";
import { join } from "path";

const root = process.cwd();
const dataPath = join(root, "data/scan-stats.json");
const publicPath = join(root, "public/scan-stats.json");

export function loadStats() {
  try {
    return JSON.parse(readFileSync(dataPath, "utf8"));
  } catch {
    return {
      versie: 1,
      lastBatchAt: null,
      lastBatchMode: null,
      totaalGescand: 0,
      totaalLekken: 0,
      totaalSchoon: 0,
      totaalFout: 0,
      batches: [],
    };
  }
}

export function recordBatchResult({ mode, processed, leaks, clean, errors, durationMs }) {
  const s = loadStats();
  s.lastBatchAt = new Date().toISOString();
  s.lastBatchMode = mode;
  s.totaalGescand += processed;
  s.totaalLekken += leaks;
  s.totaalSchoon += clean;
  s.totaalFout += errors;
  const hitRate = processed > 0 ? Math.round((leaks / processed) * 1000) / 10 : 0;
  s.batches.unshift({
    at: s.lastBatchAt,
    mode,
    processed,
    leaks,
    clean,
    errors,
    hitRate,
    durationMs,
  });
  if (s.batches.length > 30) s.batches = s.batches.slice(0, 30);
  s.hitRateLaatste = hitRate;
  mkdirSync(join(root, "data"), { recursive: true });
  writeFileSync(dataPath, JSON.stringify(s, null, 2));
  if (existsSync(join(root, "public"))) {
    copyFileSync(dataPath, publicPath);
  }
  return s;
}