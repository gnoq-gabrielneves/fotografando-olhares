"use client";

import { queryKeys } from "@/lib/query/keys";
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
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-slate-700 font-medium text-sm mb-6">
        Evolução mensal
      </h2>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border-4 border-slate-100 border-t-cyan-500 animate-spin" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={merged} margin={{ left: 0, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="mes"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={32}
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
            />
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
    </div>
  );
}
