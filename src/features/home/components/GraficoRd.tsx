"use client";

import { ChartCard, ChartLoading } from "@/shared/components/charts/ChartCard";
import { chartTooltipStyle } from "@/shared/lib/charts/styles";
import { queryKeys } from "@/shared/lib/query/keys";
import { getResultadoChartColor } from "@/shared/lib/utils/resultado-badge";
import { useQuery } from "@tanstack/react-query";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { getDistribuicaoRD } from "../queries/queries-home";

export function GraficoRD() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.home.distribuicaoRD,
    queryFn: getDistribuicaoRD,
  });

  return (
    <ChartCard title="Resultados dos laudos" className="h-full">
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
  );
}
