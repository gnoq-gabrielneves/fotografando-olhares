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
import { getDistribuicaoPorLocal } from "../services/relatorios-services";

export function RelatorioLocais() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.relatorios.distribuicaoPorLocal,
    queryFn: getDistribuicaoPorLocal,
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-white font-medium text-sm mb-6">
        Pacientes por local de atendimento
      </h2>
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 bg-slate-800 rounded animate-pulse" />
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
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={140}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "13px",
              }}
              cursor={{ fill: "#1e293b" }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Pacientes">
              {data?.map((_, index) => (
                <Cell key={index} fill="#22d3ee" fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
