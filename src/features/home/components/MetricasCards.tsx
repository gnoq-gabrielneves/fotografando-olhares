"use client";

import { queryKeys } from "@/lib/query/keys";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Clock, FileText, Users } from "lucide-react";
import { getMetricas } from "../queries/queries-home";
import { SkeletonCards } from "./SkeletonCards";

const cards = [
  {
    key: "totalPacientes",
    label: "Pacientes cadastrados",
    icon: Users,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
  },
  {
    key: "totalLaudos",
    label: "Laudos emitidos",
    icon: FileText,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  {
    key: "totalSemLaudo",
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

export function MetricasCards() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.home.metricas,
    queryFn: getMetricas,
  });

  if (isLoading) return <SkeletonCards />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <p className="text-3xl font-semibold text-slate-800">
            {data?.[card.key] ?? 0}
          </p>
        </div>
      ))}
    </div>
  );
}
