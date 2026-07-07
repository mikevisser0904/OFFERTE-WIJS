import { DashboardShell } from "@/components/dashboard-shell";
import { ListingsRedirect } from "@/components/listings-redirect";

export const metadata = {
  title: "Marktplaats — DoekoeWijs",
  description: "Doorsturen naar Listings (Marktplaats-tab).",
};

export default function MarktplaatsAliasPage() {
  return (
    <DashboardShell active="/listings/" title="Listings" subtitle="Marktplaats-tab">
      <ListingsRedirect tab="Marktplaats" />
    </DashboardShell>
  );
}