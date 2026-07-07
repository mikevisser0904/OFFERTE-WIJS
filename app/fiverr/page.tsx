import { DashboardShell } from "@/components/dashboard-shell";
import { ListingsRedirect } from "@/components/listings-redirect";

export const metadata = {
  title: "Fiverr — DoekoeWijs",
  description: "Doorsturen naar Listings.",
};

export default function FiverrAliasPage() {
  return (
    <DashboardShell active="/listings/" title="Listings" subtitle="Fiverr-tab">
      <ListingsRedirect />
    </DashboardShell>
  );
}