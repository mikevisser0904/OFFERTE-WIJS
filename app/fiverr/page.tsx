import { DashboardShell } from "@/components/dashboard-shell";
import { FiverrGigPanel } from "@/components/fiverr-gig-panel";

export const metadata = {
  title: "Fiverr gig — WebKlaar",
  description: "Copy-paste Fiverr gig setup — $199 starter package.",
};

export default function FiverrPage() {
  return (
    <DashboardShell
      active="/fiverr/"
      title="Fiverr gig"
      subtitle="Setup · packages · berichten · profiel — alles kopieerbaar"
    >
      <FiverrGigPanel />
    </DashboardShell>
  );
}