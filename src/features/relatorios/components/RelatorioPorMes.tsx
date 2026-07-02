"use client";

import { ChartCard, ChartLoading } from "@/shared/components/charts/ChartCard";
import { chartAxisTick, chartTooltipStyle } from "@/shared/lib/charts/styles";
import { queryKeys } from "@/shared/lib/query/keys";
import { useQuery } from "@tanstack/react-query";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getCadastrosPorMes, getLaudosPorMes } from "../services/relatorios-services";

export function RelatorioPorMes() {
  const { data: laudos, isLoading: loadingLaudos } = useQuery({
    queryKey: queryKeys.relatorios.laudosPorMes,
    queryFn: getLaudosPorMes,
  });

  const { data: cadastros, isLoading: loadingCadastros } = useQuery({
    queryKey: queryKeys.relatorios.cadastrosPorMes,
    queryFn: getCadastrosPorMes,
  });

  const isLoading = loadingLaudos || loadingCadastros;

  const merged = (() => {
    const meses: Record<string, { mes: string; laudos: number; cadastros: number }> = {};

    cadastros?.forEach((c) => {
      meses[c.mes] = { mes: c.label, laudos: 0, cadastros: c.total };
    });

    laudos?.forEach((l) => {
      if (meses[l.mesRaw]) {
        meses[l.mesRaw].laudos = l.total;
      } else {
        meses[l.mesRaw] = { mes: l.mesLabel, laudos: l.total, cadastros: 0 };
      }
    });

    return Object.entries(meses)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v);
  })();

  return (
    <ChartCard title="Evolução mensal">
      {isLoading ? (
        <ChartLoading />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={merged} margin={{ left: 0, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="mes"
              tick={chartAxisTick}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={chartAxisTick}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ color: "#64748b", fontSize: "12px" }}>{value}</span>
              )}
            />
            <Line
              type="monotone"
              dataKey="cadastros"
              stroke="#0891b2"
              strokeWidth={2}
              dot={{ fill: "#0891b2", r: 3 }}
              activeDot={{ r: 5 }}
              name="Cadastros"
            />
            <Line
              type="monotone"
              dataKey="laudos"
              stroke="#7c3aed"
              strokeWidth={2}
              dot={{ fill: "#7c3aed", r: 3 }}
              activeDot={{ r: 5 }}
              name="Laudos"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
