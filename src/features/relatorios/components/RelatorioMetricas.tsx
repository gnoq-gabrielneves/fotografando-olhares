"use client";

import { queryKeys } from "@/lib/query/keys";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Clock, FileText, Users } from "lucide-react";
import { getRelatorioGeral } from "../services/relatorios-services";

const cards = [
  {
    key: "totalPacientes",
    label: "Total de pacientes",
    icon: Users,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
  },
  {
    key: "totalLaudos",
    label: "Total de laudos",
    icon: FileText,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  {
    key: "totalPendentes",
    label: "Pendentes de laudo",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    key: "totalComRD",
    label: "Casos com RD",
    icon: AlertTriangle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
] as const;

export function RelatorioMetricas() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.relatorios.geral,
    queryFn: getRelatorioGeral,
  });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm">{card.label}</span>
            <div className={`p-2 rounded-lg ${card.bg} border ${card.border}`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 w-16 bg-slate-100 rounded animate-pulse" />
          ) : (
            <p className="text-3xl font-semibold text-slate-800">
              {data?.[card.key] ?? 0}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
