import { DashboardShell } from "@/components/dashboard-shell";
import { ScanPanel } from "@/components/scan-panel";

export const metadata = {
  title: "VakScan — DoekoeWijs",
  description: "VakScan op pauze voor verkoop — alleen met toestemming, achtergrond-tool.",
};

export default function ScanPage() {
  return (
    <DashboardShell
      active="/scan/"
      title="VakScan"
      subtitle="Gepauzeerd op actie — alleen lokaal met toestemming · verkoop via /actie/ en /diensten/"
    >
      <ScanPanel />
    </DashboardShell>
  );
}