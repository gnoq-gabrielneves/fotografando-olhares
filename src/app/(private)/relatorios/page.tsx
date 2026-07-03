import type { Metadata } from "next";
import { RelatorioEsteiraClinica } from "@/features/relatorios/components/RelatorioEsteiraClinica";
import { RelatorioExtensionistas } from "@/features/relatorios/components/RelatorioExtensionistas";
import { ModuleGate } from "@/shared/components/ModuleGate/ModuleGate";
import { PageHeader } from "@/shared/components/PageHeader/PageHeader";

export const metadata: Metadata = {
  title: "Relatórios | Fotografando Olhares",
  description: "Estatísticas e gráficos sobre pacientes, laudos e evolução do projeto.",
};
import { RelatorioLocais } from "@/features/relatorios/components/RelatorioLocais";
import { RelatorioMetricas } from "@/features/relatorios/components/RelatorioMetricas";
import { RelatorioPorMes } from "@/features/relatorios/components/RelatorioPorMes";
import { RelatorioResultados } from "@/features/relatorios/components/RelatorioResultados";
import { BarChart2 } from "lucide-react";

export default function RelatoriosPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        icon={BarChart2}
        title="Relatórios"
        description="Análises e estatísticas do projeto"
      />

      <section className="space-y-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Visão geral</h2>
        <RelatorioMetricas />
      </section>

      <ModuleGate moduleId="oftalmo" fallback="hidden">
        <section className="space-y-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Esteira clínica</h2>
          <RelatorioEsteiraClinica />
        </section>
      </ModuleGate>

      <ModuleGate moduleId="oftalmo" fallback="hidden">
        <section className="space-y-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Distribuição de resultados</h2>
          <RelatorioResultados />
        </section>
      </ModuleGate>

      <section className="space-y-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Atendimentos</h2>
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-3">
            <RelatorioExtensionistas />
          </div>
          <div className="xl:col-span-2">
            <RelatorioLocais />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Evolução temporal</h2>
        <RelatorioPorMes />
      </section>
    </div>
  );
}
