"use client";

import { useSearchParams } from "next/navigation";
import { FiverrGigPanel } from "@/components/fiverr-gig-panel";

const tabs = ["Setup", "Packages", "Berichten", "Profiel", "Marktplaats"] as const;
type Tab = (typeof tabs)[number];

function tabFromParam(raw: string | null): Tab | undefined {
  if (!raw) return undefined;
  const hit = tabs.find((t) => t.toLowerCase() === raw.toLowerCase());
  return hit;
}

export function ListingsView() {
  const sp = useSearchParams();
  const initialTab = tabFromParam(sp.get("tab"));
  return <FiverrGigPanel initialTab={initialTab} />;
}