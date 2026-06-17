"use client";

import { queryKeys } from "@/lib/query/keys";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Clock, FileText, Users } from "lucide-react";
import { getRelatorioGeral } from "../services/relatorios-services";

export function RelatorioMetricas() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.relatorios.geral,
    queryFn: getRelatorioGeral,
  });

  const taxa = data && data.totalPacientes > 0
    ? Math.round((data.totalLaudos / data.totalPacientes) * 100)
    : null;

  const cards = [
    {
      key: "totalPacientes" as const,
      label: "Total de pacientes",
      icon: Users,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      border: "border-cyan-100",
      accent: "border-l-cyan-400",
      sub: taxa !== null ? `${taxa}% com laudo` : undefined,
    },
    {
      key: "totalLaudos" as const,
      label: "Laudos emitidos",
      icon: FileText,
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-100",
      accent: "border-l-violet-400",
      sub: data?.totalPacientes ? `de ${data.totalPacientes} pacientes` : undefined,
    },
    {
      key: "totalPendentes" as const,
      label: "Pendentes de laudo",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
      accent: "border-l-amber-400",
      sub: data && data.totalPacientes > 0
        ? `${Math.round((data.totalPendentes / data.totalPacientes) * 100)}% do total`
        : undefined,
    },
    {
      key: "totalComRD" as const,
      label: "Casos com RD",
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100",
      accent: "border-l-red-400",
      sub: data && data.totalLaudos > 0
        ? `${Math.round((data.totalComRD / data.totalLaudos) * 100)}% dos laudos`
        : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className={`bg-white border border-slate-200 border-l-4 ${card.accent} rounded-xl p-5 shadow-sm`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-xs font-medium">{card.label}</span>
            <div className={`p-1.5 rounded-lg ${card.bg} border ${card.border}`}>
              <card.icon className={`w-3.5 h-3.5 ${card.color}`} />
            </div>
          </div>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-8 w-16 bg-slate-100 rounded animate-pulse" />
              <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
            </div>
          ) : (
            <>
              <p className="text-3xl font-bold text-slate-800">
                {data?.[card.key] ?? 0}
              </p>
              {card.sub && (
                <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
