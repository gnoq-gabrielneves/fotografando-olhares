"use client";
import { queryKeys } from "@/lib/query/keys";
import { useQuery } from "@tanstack/react-query";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getLaudosPorMes } from "../services/relatorios-services";

export function RelatorioPorMes() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.relatorios.laudosPorMes,
    queryFn: getLaudosPorMes,
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-white font-medium text-sm mb-6">Laudos por mês</h2>
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border-4 border-slate-800 border-t-cyan-500 animate-spin" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data} margin={{ left: 0, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="mes"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "13px",
              }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#22d3ee"
              strokeWidth={2}
              dot={{ fill: "#22d3ee", r: 4 }}
              activeDot={{ r: 6 }}
              name="Laudos"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
