/**
 * Passieve HTTP-hulp — alleen GET/HEAD, timeout, geen credentials.
 */

const DEFAULT_TIMEOUT_MS = 12_000;
const MAX_BODY_BYTES = 64_000;

export function normalizeTargetUrl(input) {
  let raw = String(input || "").trim();
  if (!raw) throw new Error("Geen URL opgegeven");
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
  const u = new URL(raw);
  if (!["http:", "https:"].includes(u.protocol)) {
    throw new Error("Alleen http(s) URL's");
  }
  return u;
}

export function originOf(url) {
  const u = typeof url === "string" ? new URL(url) : url;
  return `${u.protocol}//${u.host}`;
}

export async function fetchSafe(url, { method = "GET", timeoutMs = DEFAULT_TIMEOUT_MS, maxBytes = MAX_BODY_BYTES } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method,
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "VakScan/1.0 (WebKlaar passieve veiligheidscheck)",
        Accept: "text/html,application/json,text/plain,*/*",
      },
    });
    let body = "";
    if (method !== "HEAD" && res.body) {
      const reader = res.body.getReader();
      const chunks = [];
      let total = 0;
      while (total < maxBytes) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        total += value.length;
      }
      try {
        await reader.cancel();
      } catch {
        /* ignore */
      }
      body = Buffer.concat(chunks).toString("utf8", 0, Math.min(total, maxBytes));
    }
    return {
      ok: res.ok,
      status: res.status,
      url: res.url,
      headers: Object.fromEntries(res.headers.entries()),
      body,
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function probePath(baseOrigin, path, opts = {}) {
  const url = new URL(path, baseOrigin).href;
  try {
    const res = await fetchSafe(url, { method: opts.headOnly ? "HEAD" : "GET", ...opts });
    return { path, url, ...res, error: null };
  } catch (e) {
    return {
      path,
      url,
      ok: false,
      status: 0,
      headers: {},
      body: "",
      error: String(e),
    };
  }
}