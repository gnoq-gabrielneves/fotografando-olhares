"use client";

import { MetricCard } from "@/shared/components/metrics/MetricCard";
import { queryKeys } from "@/shared/lib/query/keys";
import {
  getPacienteStatusBadge,
  getPacienteStatusLabel,
} from "@/shared/lib/utils/paciente-status";
import { useQuery } from "@tanstack/react-query";
import { Clock, ListChecks, TimerReset } from "lucide-react";
import { getEsteiraClinica } from "../services/relatorios-services";

const metricCards = [
  {
    key: "total" as const,
    label: "Pacientes na esteira",
    icon: ListChecks,
    tone: "cyan" as const,
  },
  {
    key: "totalPendencias" as const,
    label: "Pendências ativas",
    icon: Clock,
    tone: "amber" as const,
  },
  {
    key: "tempoMedioAteLaudo" as const,
    label: "Tempo médio até laudo",
    icon: TimerReset,
    tone: "violet" as const,
    suffix: "dias",
  },
];

export function RelatorioEsteiraClinica() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.relatorios.esteiraClinica,
    queryFn: getEsteiraClinica,
  });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-4">
        {metricCards.map((card) => (
          <MetricCard
            key={card.key}
            label={card.label}
            value={
              <>
                {data?.[card.key] ?? "-"}
                {data?.[card.key] !== null && card.suffix ? (
                  <span className="ml-1 text-sm font-medium text-slate-400">
                    {card.suffix}
                  </span>
                ) : null}
              </>
            }
            icon={card.icon}
            tone={card.tone}
            loading={isLoading}
          />
        ))}
      </div>

      <div className="xl:col-span-3 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-slate-700 font-medium text-sm mb-6">
          Distribuição por status operacional
        </h2>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-10 bg-slate-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {data?.distribuicao.map((item) => (
              <div key={item.status} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md font-medium border ${getPacienteStatusBadge(item.status)}`}
                  >
                    {getPacienteStatusLabel(item.status)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">
                      {item.total}
                    </span>
                    <span className="w-9 text-right text-xs text-slate-400">
                      {item.percentual}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-cyan-500 transition-all"
                    style={{ width: `${item.percentual}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
