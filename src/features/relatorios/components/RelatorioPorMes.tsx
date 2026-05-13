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
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-slate-700 font-medium text-sm mb-6">
        Laudos por mês
      </h2>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border-4 border-slate-100 border-t-cyan-500 animate-spin" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data} margin={{ left: 0, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="mes"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
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
            <Line
              type="monotone"
              dataKey="total"
              stroke="#0891b2"
              strokeWidth={2}
              dot={{ fill: "#0891b2", r: 4 }}
              activeDot={{ r: 6 }}
              name="Laudos"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
