import { DashboardShell } from "@/components/dashboard-shell";
import { GrootPlanPanel } from "@/components/groot-plan-panel";

export const metadata = {
  title: "Groot plan — DoekoeWijs",
  description: "Internetdiensten eerst, agents op de achtergrond — traffic, actie, opdrachten.",
};

export default function VisiePage() {
  return (
    <DashboardShell
      active="/visie/"
      title="Groot plan"
      subtitle="DoekoeWijs internetdiensten + autopilot — VakScan later"
    >
      <GrootPlanPanel />
    </DashboardShell>
  );
}