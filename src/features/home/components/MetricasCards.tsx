"use client";

import { queryKeys } from "@/lib/query/keys";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Clock, FileText, Users } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { getMetricas } from "../queries/queries-home";
import { SkeletonCards } from "./SkeletonCards";

const cards = [
  {
    key: "totalPacientes",
    label: "Pacientes",
    sublabel: "cadastrados",
    icon: Users,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-100",
    href: "/pacientes",
  },
  {
    key: "totalLaudos",
    label: "Laudos",
    sublabel: "emitidos",
    icon: FileText,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
    href: "/laudos",
  },
  {
    key: "totalSemLaudo",
    label: "Pendentes",
    sublabel: "sem laudo",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    href: "/pacientes",
    urgent: true,
  },
  {
    key: "totalComRD",
    label: "Casos com RD",
    sublabel: "retinopatia",
    icon: AlertTriangle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-100",
    href: "/pacientes",
    urgent: true,
  },
] satisfies { key: "totalPacientes" | "totalLaudos" | "totalSemLaudo" | "totalComRD"; label: string; sublabel: string; icon: React.ElementType; color: string; bg: string; border: string; href: string; urgent?: boolean }[];

export function MetricasCards() {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.home.metricas,
    queryFn: getMetricas,
  });

  if (isLoading) return <SkeletonCards />;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => (
        <button
          key={card.key}
          onClick={() => router.push(card.href)}
          className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm text-left hover:border-slate-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg ${card.bg} border ${card.border}`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            {card.urgent && (data?.[card.key] ?? 0) > 0 && (
              <span className={`w-2 h-2 rounded-full ${card.color.replace("text-", "bg-")} animate-pulse`} />
            )}
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-slate-800 leading-none">
            {data?.[card.key] ?? 0}
          </p>
          <p className="text-xs text-slate-400 mt-1.5">
            {card.label}{" "}
            <span className="text-slate-300">{card.sublabel}</span>
          </p>
        </button>
      ))}
    </div>
  );
}
