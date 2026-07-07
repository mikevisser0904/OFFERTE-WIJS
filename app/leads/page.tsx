import { DashboardShell } from "@/components/dashboard-shell";
import { EchteKlantenPanel } from "@/components/echte-klanten-panel";
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
      <EchteKlantenPanel />
      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-white/60">Alle URLs (scores)</h2>
        <LeadsPanel />
      </div>
    </DashboardShell>
  );
}