"use client";

import { queryKeys } from "@/lib/query/keys";
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
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-slate-700 font-medium text-sm mb-6">
        Pacientes por extensionista
      </h2>

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
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "#475569", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              interval={0}
              tickMargin={12}
              width={220}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                color: "#1e293b",
                fontSize: "13px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              cursor={{ fill: "#f1f5f9" }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Pacientes">
              {data?.map((_, index) => (
                <Cell key={index} fill="#7c3aed" fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
