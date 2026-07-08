import { DashboardShell } from "@/components/dashboard-shell";
import { EchteKlantenPanel } from "@/components/echte-klanten-panel";
import { LeadsPanel } from "@/components/leads-panel";

export const metadata = {
  title: "Potentiële klanten — DoekoeWijs",
  description: "Warme lijsten voor actie en verkoop — Google Start, SEO, websites.",
};

export default function LeadsPage() {
  return (
    <DashboardShell
      active="/leads/"
      title="Potentiële klanten"
      subtitle="Warm netwerk + OSM — bel/WhatsApp met internet-menu (Spoed, Listings, Google Start)"
    >
      <EchteKlantenPanel />
      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-white/60">Alle URLs (scores)</h2>
        <LeadsPanel />
      </div>
    </DashboardShell>
  );
}