import { DashboardShell } from "@/components/dashboard-shell";
import { FiverrGigPanel } from "@/components/fiverr-gig-panel";

export const metadata = {
  title: "Fiverr gig — DoekoeWijs",
  description: "Copy-paste Fiverr gig setup — $199 starter package.",
};

export default function FiverrPage() {
  return (
    <DashboardShell
      active="/fiverr/"
      title="Fiverr gig"
      subtitle="Fiverr setup · Marktplaats-advertentie · packages · berichten — alles kopieerbaar"
    >
      <FiverrGigPanel />
    </DashboardShell>
  );
}