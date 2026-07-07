import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const ROOT = join(import.meta.dirname, "../..");

export function patchAgent(id, data) {
  const path = join(ROOT, "data/agents-status.json");
  const pub = join(ROOT, "public/agents-status.json");
  let base = { versie: 1, updatedAt: null, agents: {} };
  try {
    base = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    /* new */
  }
  base.updatedAt = new Date().toISOString();
  base.agents[id] = {
    lastRun: new Date().toISOString(),
    ...data,
  };
  writeFileSync(path, JSON.stringify(base, null, 2));
  mkdirSync(join(ROOT, "public"), { recursive: true });
  writeFileSync(pub, JSON.stringify(base, null, 2));
  return base.agents[id];
}