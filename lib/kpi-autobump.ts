import type { KpiInput } from "@/data/monitoring";
import { laadKpi, slaKpi } from "@/lib/goudzoeker";

export function bumpKpi(patch: Partial<KpiInput>) {
  const current = laadKpi();
  const next = { ...current, ...patch };
  slaKpi(next);
  return next;
}

export function recordBestelling(prijsLabel: string) {
  const k = laadKpi();
  bumpKpi({ bestellingen: k.bestellingen + 1 });
  void prijsLabel;
}

export function recordContactVerstuurd() {
  const k = laadKpi();
  bumpKpi({ contactenDezeWeek: k.contactenDezeWeek + 1 });
}

export async function notifyNtfy(
  topic: string,
  title: string,
  body: string,
  priority: "default" | "high" | "urgent" = "high"
) {
  try {
    await fetch(`https://ntfy.sh/${topic}`, {
      method: "POST",
      headers: { Title: title, Priority: priority, Tags: "moneybag" },
      body,
    });
  } catch {
    /* push mag UX niet breken */
  }
}