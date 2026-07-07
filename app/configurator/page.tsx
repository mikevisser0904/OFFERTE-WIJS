import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardRedirect } from "@/components/dashboard-redirect";

export const metadata = {
  title: "Configurator — DoekoeWijs",
  description: "Fase 4 — doorsturen naar werkblad.",
};

export default function ConfiguratorPage() {
  return (
    <DashboardShell active="/dashboard/" title="Werkblad" subtitle="Configurator komt na eerste cash">
      <DashboardRedirect />
    </DashboardShell>
  );
}