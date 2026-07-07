import { DashboardShell } from "@/components/dashboard-shell";
import { AgentsPanel } from "@/components/agents-panel";

export const metadata = {
  title: "Agents — WebKlaar",
  description: "Lead Hunter + Outreach + VakScan agent-team voor Mike.",
};

export default function AgentsPage() {
  return (
    <DashboardShell
      active="/agents/"
      title="Agents"
      subtitle="Lead Hunter vindt klanten · Outreach zegt wie je belt · VakScan scant"
    >
      <AgentsPanel />
    </DashboardShell>
  );
}