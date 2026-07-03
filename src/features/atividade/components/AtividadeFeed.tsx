"use client";

import { queryKeys } from "@/shared/lib/query/keys";
import { useQuery } from "@tanstack/react-query";
import { Activity } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { EmptyState, QueryErrorState } from "@/shared/components/states/EmptyState";
import { formatDisplayTextOrDash } from "@/shared/lib/format/text";
import { getActivityActionConfig } from "../lib/activity-actions";
import { getAtividadeRecente } from "../services/atividade-services";

function tempoRelativo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min}min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h}h`;
  const d = Math.floor(h / 24);
  return `há ${d}d`;
}

function iniciais(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function AtividadeFeed() {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: queryKeys.atividade.recente,
    queryFn: () => getAtividadeRecente(4),
    refetchInterval: 30000,
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-full">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
        <Activity className="w-4 h-4 text-slate-400" />
        <h2 className="text-sm font-medium text-slate-700">Atividade recente</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isError ? (
          <div className="p-4">
            <QueryErrorState message={error.message} />
          </div>
        ) : isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-slate-100 animate-pulse shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-slate-100 rounded animate-pulse w-3/4" />
                  <div className="h-2.5 bg-slate-100 rounded animate-pulse w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : !data?.length ? (
          <div className="p-4">
            <EmptyState
              title="Nenhuma atividade ainda"
              description="As ações importantes do time aparecerão aqui conforme o uso do sistema."
              className="border-0 shadow-none"
            />
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {data.map((log) => {
              const cfg = getActivityActionConfig(log.action);
              const Icon = cfg.icon;
              const nome = log.profiles?.full_name
                ? formatDisplayTextOrDash(log.profiles.full_name)
                : "Usuário";

              return (
                <div key={log.id} className="flex items-start gap-3 px-5 py-3">
                  <div className="relative shrink-0 mt-0.5">
                    <Avatar className="w-7 h-7">
                      <AvatarImage src={log.profiles?.avatar_url || undefined} />
                      <AvatarFallback className="text-xs bg-slate-100 text-slate-600">
                        {iniciais(nome)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full ${cfg.bg} border border-white flex items-center justify-center`}
                    >
                      <Icon className={`w-2.5 h-2.5 ${cfg.color}`} />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 leading-snug">
                      <span className="font-medium">{nome}</span>{" "}
                      {log.description}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {tempoRelativo(log.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
