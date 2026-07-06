"use client";

import { useSearchParams } from "next/navigation";
import { BestelForm } from "@/components/bestel-form";

export function BestelPageClient() {
  const params = useSearchParams();
  const dienst = params.get("dienst") ?? undefined;
  return <BestelForm preselect={dienst} />;
}