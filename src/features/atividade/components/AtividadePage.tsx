"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { EmptyState, QueryErrorState } from "@/shared/components/states/EmptyState";
import { PageHeader } from "@/shared/components/PageHeader/PageHeader";
import {
  formatDisplayTextOrDash,
  formatSentenceStart,
} from "@/shared/lib/format/text";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { queryKeys } from "@/shared/lib/query/keys";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import {
  ACTIVITY_ACTION_OPTIONS,
  getActivityActionConfig,
} from "../lib/activity-actions";
import {
  AtividadeLog,
  FiltrosAtividade,
  getAtividadePaginada,
  getUsuariosAtivos,
} from "../services/atividade-services";

function iniciais(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function formatarData(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}

function agruparPorDia(items: AtividadeLog[]) {
  const grupos: Record<string, AtividadeLog[]> = {};
  items.forEach((item) => {
    const dia = new Date(item.created_at).toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "America/Sao_Paulo",
    });
    if (!grupos[dia]) grupos[dia] = [];
    grupos[dia].push(item);
  });
  return grupos;
}

const PAGE_SIZE = 25;

export function AtividadePage() {
  const [filtros, setFiltros] = useState<FiltrosAtividade>({
    action: "todos",
    user_id: "todos",
    page: 1,
    pageSize: PAGE_SIZE,
  });

  const { data, error, isError, isLoading } = useQuery({
    queryKey: queryKeys.atividade.paginada(filtros),
    queryFn: () => getAtividadePaginada(filtros),
  });

  const { data: usuarios } = useQuery({
    queryKey: queryKeys.atividade.usuarios,
    queryFn: getUsuariosAtivos,
  });

  const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 1;
  const grupos = agruparPorDia(data?.data ?? []);

  function setFiltro(key: keyof FiltrosAtividade, value: string) {
    setFiltros((prev) => ({ ...prev, [key]: value, page: 1 }));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Activity}
        title="Atividade"
        description="Histórico de ações do sistema"
        meta={
          data ? (
          <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            {data.count} {data.count === 1 ? "registro" : "registros"}
          </span>
          ) : null
        }
      />

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-52">
          <Select value={filtros.action} onValueChange={(v) => setFiltro("action", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as ações" />
            </SelectTrigger>
            <SelectContent position="popper">
              {ACTIVITY_ACTION_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-52">
          <Select value={filtros.user_id} onValueChange={(v) => setFiltro("user_id", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os usuários" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="todos">Todos os usuários</SelectItem>
              {usuarios?.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {formatDisplayTextOrDash(u.full_name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista */}
      {isError ? (
        <QueryErrorState message={error.message} />
      ) : (
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-slate-100 rounded animate-pulse w-1/2" />
                  <div className="h-3 bg-slate-100 rounded animate-pulse w-1/4" />
                </div>
                <div className="h-3 bg-slate-100 rounded animate-pulse w-20" />
              </div>
            ))}
          </div>
        ) : !data?.data.length ? (
          <EmptyState
            title="Nenhuma atividade encontrada"
            description="Ajuste os filtros ou aguarde novas ações no sistema."
            className="border-0 shadow-none"
          />
        ) : (
          Object.entries(grupos).map(([dia, items]) => (
            <div key={dia}>
              <div className="px-6 py-2 bg-slate-50 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {formatSentenceStart(dia)}
                </p>
              </div>
              {items.map((log) => {
                const cfg = getActivityActionConfig(log.action);
                const Icon = cfg.icon;
                const nome = log.profiles?.full_name
                  ? formatDisplayTextOrDash(log.profiles.full_name)
                  : "Usuário";

                return (
                  <div
                    key={log.id}
                    className="flex items-center gap-4 px-6 py-3.5 border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="relative shrink-0">
                      <Avatar className="w-9 h-9">
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
                      <p className="text-sm text-slate-800">
                        <span className="font-semibold">{nome}</span>{" "}
                        <span className="text-slate-500">{log.description}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`hidden sm:inline-flex text-xs px-2 py-0.5 rounded-md font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                      >
                        {cfg.label}
                      </span>
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {formatarData(log.created_at)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
      )}

      {/* Paginação */}
      {!isError && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Página {filtros.page} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={(filtros.page ?? 1) <= 1}
              onClick={() => setFiltros((p) => ({ ...p, page: (p.page ?? 1) - 1 }))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={(filtros.page ?? 1) >= totalPages}
              onClick={() => setFiltros((p) => ({ ...p, page: (p.page ?? 1) + 1 }))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
