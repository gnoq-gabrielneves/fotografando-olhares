"use client";

import { MetricCard } from "@/shared/components/metrics/MetricCard";
import { queryKeys } from "@/shared/lib/query/keys";
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
      tone: "cyan" as const,
      sub: taxa !== null ? `${taxa}% com laudo` : undefined,
    },
    {
      key: "totalLaudos" as const,
      label: "Laudos emitidos",
      icon: FileText,
      tone: "violet" as const,
      sub: data?.totalPacientes ? `de ${data.totalPacientes} pacientes` : undefined,
    },
    {
      key: "totalPendentes" as const,
      label: "Pendentes de laudo",
      icon: Clock,
      tone: "amber" as const,
      sub: data && data.totalPacientes > 0
        ? `${Math.round((data.totalPendentes / data.totalPacientes) * 100)}% do total`
        : undefined,
    },
    {
      key: "totalComRD" as const,
      label: "Casos com RD",
      icon: AlertTriangle,
      tone: "red" as const,
      sub: data && data.totalLaudos > 0
        ? `${Math.round((data.totalComRD / data.totalLaudos) * 100)}% dos laudos`
        : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <MetricCard
          key={card.key}
          label={card.label}
          value={data?.[card.key] ?? 0}
          icon={card.icon}
          tone={card.tone}
          sublabel={card.sub}
          loading={isLoading}
          accent
        />
      ))}
    </div>
  );
}
