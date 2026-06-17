"use client";

import { queryKeys } from "@/lib/query/keys";
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

const COLORS = ["#0891b2", "#7c3aed", "#d97706", "#dc2626"];

export function GraficoRD() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.home.distribuicaoRD,
    queryFn: getDistribuicaoRD,
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-full">
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
  );
}
