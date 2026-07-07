import { DashboardShell } from "@/components/dashboard-shell";
import { ScanPanel } from "@/components/scan-panel";

export const metadata = {
  title: "VakScan — DoekoeWijs",
  description: "Passieve veiligheidscheck voor vakman-websites — rapport en verkooptekst.",
};

export default function ScanPage() {
  return (
    <DashboardShell
      active="/scan/"
      title="VakScan"
      subtitle="Gratis check → rapport → WhatsApp met aanbod Website Veilig"
    >
      <ScanPanel />
    </DashboardShell>
  );
}