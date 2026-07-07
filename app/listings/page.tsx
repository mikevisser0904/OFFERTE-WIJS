import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { ListingsView } from "@/components/listings-view";

export const metadata = {
  title: "Listings — DoekoeWijs",
  description: "Fiverr gig + Marktplaats — alles kopieerbaar.",
};

export default function ListingsPage() {
  return (
    <DashboardShell
      active="/listings/"
      title="Listings"
      subtitle="Fiverr · Marktplaats · packages · berichten — copy-paste"
    >
      <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-white/[0.03]" />}>
        <ListingsView />
      </Suspense>
    </DashboardShell>
  );
}