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
import { getDistribuicaoPorLocal } from "../queries/queries-home";

export function GraficoLocais() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.home.distribuicaoPorLocal,
    queryFn: getDistribuicaoPorLocal,
  });

  return (
    <ChartCard title="Pacientes por local">
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 bg-slate-100 rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 8, right: 24 }}
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
              width={140}
            />
            <Tooltip contentStyle={chartTooltipStyle} cursor={chartCursor} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Pacientes">
              {data?.map((_, index) => (
                <Cell key={index} fill="#0891b2" fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
