"use client";

import { queryKeys } from "@/lib/query/keys";
import { resultadoBadge } from "@/lib/utils/resultado-badge";
import { ResultadoRD } from "@/types";
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

const COLORS = [
  "#0891b2",
  "#d97706",
  "#dc2626",
  "#ea580c",
  "#7c3aed",
  "#64748b",
];

export function RelatorioResultados() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.relatorios.distribuicaoResultados,
    queryFn: getDistribuicaoResultados,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Donut */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-slate-700 font-medium text-sm mb-6">
          Distribuição por resultado
        </h2>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-slate-100 border-t-cyan-500 animate-spin" />
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
                {data?.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  color: "#1e293b",
                  fontSize: "13px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
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
      </div>

      {/* Tabela resumo */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-slate-700 font-medium text-sm mb-6">
          Resumo por resultado
        </h2>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-10 bg-slate-100 rounded animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {data?.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200"
              >
                <span
                  className={`text-xs px-2 py-1 rounded-md font-medium border ${resultadoBadge[item.name as ResultadoRD] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}
                >
                  {item.name}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-800 font-medium text-sm">
                    {item.value}
                  </span>
                  <span className="text-slate-400 text-xs w-10 text-right">
                    {item.percentual}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
