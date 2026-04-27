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
    color: "text-cyan-400",
    bg: "bg-cyan-950",
    border: "border-cyan-900/50",
  },
  {
    key: "totalLaudos",
    label: "Total de laudos",
    icon: FileText,
    color: "text-violet-400",
    bg: "bg-violet-950",
    border: "border-violet-900/50",
  },
  {
    key: "totalPendentes",
    label: "Pendentes de laudo",
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-950",
    border: "border-amber-900/50",
  },
  {
    key: "totalComRD",
    label: "Casos com RD",
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-950",
    border: "border-red-900/50",
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
          className="bg-slate-900 border border-slate-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm">{card.label}</span>
            <div className={`p-2 rounded-lg ${card.bg} border ${card.border}`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 w-16 bg-slate-800 rounded animate-pulse" />
          ) : (
            <p className="text-3xl font-semibold text-white">
              {data?.[card.key] ?? 0}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
