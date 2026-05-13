import { RelatorioExtensionistas } from "@/features/relatorios/components/RelatorioExtensionistas";
import { RelatorioLocais } from "@/features/relatorios/components/RelatorioLocais";
import { RelatorioMetricas } from "@/features/relatorios/components/RelatorioMetricas";
import { RelatorioPorMes } from "@/features/relatorios/components/RelatorioPorMes";
import { RelatorioResultados } from "@/features/relatorios/components/RelatorioResultados";

export default function RelatoriosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Relatórios</h1>
        <p className="text-slate-500 text-sm mt-1">
          Análises e estatísticas do projeto
        </p>
      </div>
      <RelatorioMetricas />
      <RelatorioResultados />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RelatorioExtensionistas />
        <RelatorioLocais />
      </div>
      <RelatorioPorMes />
    </div>
  );
}
