"use client";

import { ChartCard } from "@/shared/components/charts/ChartCard";
import {
  chartAxisTick,
  chartCategoryTick,
  chartCursor,
  chartTooltipStyle,
} from "@/shared/lib/charts/styles";
import { queryKeys } from "@/shared/lib/query/keys";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getDistribuicaoPorExtensionista } from "../services/relatorios-services";

export function RelatorioExtensionistas() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.relatorios.distribuicaoPorExtensionista,
    queryFn: getDistribuicaoPorExtensionista,
  });

  const chartHeight = Math.max(260, (data?.length ?? 0) * 34);

  return (
    <ChartCard title="Pacientes por extensionista">
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 bg-slate-100 rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 12, right: 24 }}
          >
            <XAxis
              type="number"
              tick={chartAxisTick}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={chartCategoryTick}
              axisLine={false}
              tickLine={false}
              interval={0}
              tickMargin={12}
              width={220}
            />
            <Tooltip contentStyle={chartTooltipStyle} cursor={chartCursor} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Pacientes">
              {data?.map((_, index) => (
                <Cell key={index} fill="#7c3aed" fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
