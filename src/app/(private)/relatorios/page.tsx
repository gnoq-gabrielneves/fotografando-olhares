import type { Metadata } from "next";
import { RelatorioExtensionistas } from "@/features/relatorios/components/RelatorioExtensionistas";

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
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center shrink-0">
          <BarChart2 className="w-5 h-5 text-cyan-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Relatórios</h1>
          <p className="text-slate-400 text-sm">Análises e estatísticas do projeto</p>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Visão geral</h2>
        <RelatorioMetricas />
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Distribuição de resultados</h2>
        <RelatorioResultados />
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Atendimentos</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RelatorioExtensionistas />
          <RelatorioLocais />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Evolução temporal</h2>
        <RelatorioPorMes />
      </section>
    </div>
  );
}
