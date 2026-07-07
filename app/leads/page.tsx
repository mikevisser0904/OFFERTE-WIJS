import { DashboardShell } from "@/components/dashboard-shell";
import { LeadsPanel } from "@/components/leads-panel";

export const metadata = {
  title: "Potentiële klanten — WebKlaar",
  description: "OSM vakman-leads voor VakScan en verkoop.",
};

export default function LeadsPage() {
  return (
    <DashboardShell
      active="/leads/"
      title="Potentiële klanten"
      subtitle="Echte vakbedrijven met website — scan → bel → Website Veilig / Vakman Site"
    >
      <LeadsPanel />
    </DashboardShell>
  );
}