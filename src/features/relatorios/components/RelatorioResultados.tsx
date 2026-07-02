"use client";

import { ChartCard, ChartLoading } from "@/shared/components/charts/ChartCard";
import { chartTooltipStyle } from "@/shared/lib/charts/styles";
import { queryKeys } from "@/shared/lib/query/keys";
import {
  getResultadoChartColor,
  getResultadoProgressColor,
  resultadoBadge,
} from "@/shared/lib/utils/resultado-badge";
import { ResultadoRD } from "@/shared/types";
import { useQuery } from "@tanstack/react-query";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { getDistribuicaoResultados } from "../services/relatorios-services";

export function RelatorioResultados() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.relatorios.distribuicaoResultados,
    queryFn: getDistribuicaoResultados,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Donut */}
      <ChartCard title="Resultados dos laudos">
        {isLoading ? (
          <ChartLoading />
        ) : !data?.length ? (
          <div className="h-64 flex items-center justify-center text-sm text-slate-400">
            Nenhum laudo emitido
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {data?.map((item) => (
                  <Cell
                    key={item.name}
                    fill={getResultadoChartColor(item.name)}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ color: "#64748b", fontSize: "12px" }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* Tabela resumo */}
      <ChartCard title="Resumo por resultado">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-14 bg-slate-100 rounded animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {data?.map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md font-medium border ${resultadoBadge[item.name as ResultadoRD] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}
                  >
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-800 font-semibold text-sm">
                      {item.value}
                    </span>
                    <span className="text-slate-400 text-xs w-8 text-right">
                      {item.percentual}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${getResultadoProgressColor(item.name)}`}
                    style={{ width: `${item.percentual}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </ChartCard>
    </div>
  );
}
