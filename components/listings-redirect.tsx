"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Static export: client redirect naar /listings/ (basePath via Next). */
export function ListingsRedirect({ tab }: { tab?: string }) {
  const router = useRouter();

  useEffect(() => {
    const q = tab ? `?tab=${encodeURIComponent(tab)}` : "";
    router.replace(`/listings/${q}`);
  }, [router, tab]);

  return <p className="text-sm text-white/50">Doorsturen naar Listings…</p>;
}