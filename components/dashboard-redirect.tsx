"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function DashboardRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/");
  }, [router]);
  return <p className="text-sm text-white/50">Doorsturen naar werkblad…</p>;
}