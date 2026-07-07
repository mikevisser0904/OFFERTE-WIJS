import { DashboardShell } from "@/components/dashboard-shell";
import { GrootPlanPanel } from "@/components/groot-plan-panel";

export const metadata = {
  title: "Groot plan — DoekoeWijs",
  description: "Visie en fases: VakScan + agent-machine voor heel Nederland.",
};

export default function VisiePage() {
  return (
    <DashboardShell
      active="/visie/"
      title="Groot plan"
      subtitle="Van €10k naar VakScan-product en schaal — agents zijn de motor"
    >
      <GrootPlanPanel />
    </DashboardShell>
  );
}