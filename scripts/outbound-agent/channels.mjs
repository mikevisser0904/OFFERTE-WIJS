/**
 * Outbound kanalen — alleen met OUTBOUND_LIVE=1 en credentials.
 */
const LIVE = process.env.OUTBOUND_LIVE === "1";

export function isLive() {
  return LIVE;
}

export async function sendEmail({ to, subject, text, html, config }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, skipped: true, reason: "geen RESEND_API_KEY" };
  if (!LIVE) return { ok: true, simulated: true, channel: "email", to };

  const from = process.env.OUTBOUND_FROM || config.email?.from;
  const replyTo = config.email?.replyTo;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
      html: html || undefined,
      reply_to: replyTo,
    }),
  });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, channel: "email", to, status: res.status, id: body.id, error: body.message };
}

export async function sendWebhook(url, payload) {
  if (!url) return { ok: false, skipped: true, reason: "geen webhook URL" };
  if (!LIVE) return { ok: true, simulated: true, channel: "webhook" };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "User-Agent": "WebKlaar-Outbound/1" },
    body: JSON.stringify(payload),
  });
  return { ok: res.ok, channel: "webhook", status: res.status };
}

export async function sendWhatsAppCloud({ toE164, templateName, language, variables, config }) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneId || !config.whatsappCloud?.enabled) {
    return { ok: false, skipped: true, reason: "WhatsApp Cloud niet geconfigureerd" };
  }
  if (!LIVE) return { ok: true, simulated: true, channel: "whatsapp", to: toE164 };

  const to = toE164.replace(/\D/g, "");
  const url = `https://graph.facebook.com/v21.0/${phoneId}/messages`;
  const body = {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: templateName || config.whatsappCloud.templateName,
      language: { code: language || config.whatsappCloud.language || "nl" },
      components: variables?.length
        ? [{ type: "body", parameters: variables.map((t) => ({ type: "text", text: String(t) })) }]
        : undefined,
    },
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, channel: "whatsapp", to, data };
}

export async function ntfyDigest(topic, title, lines, actions = []) {
  const headers = {
    Title: title,
    Tags: "outbound,email",
    Priority: "high",
  };
  if (actions.length) {
    headers.Actions = actions.map((a) => `${a.action}, ${a.label}, ${a.url}`).join("; ");
  }
  try {
    await fetch(`https://ntfy.sh/${topic}`, { method: "POST", headers, body: lines.join("\n").slice(0, 3500) });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}