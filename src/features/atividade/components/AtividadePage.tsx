"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { queryKeys } from "@/lib/query/keys";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  FilePlus,
  FileText,
  Pencil,
  UserPlus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import {
  AtividadeLog,
  FiltrosAtividade,
  getAtividadePaginada,
  getUsuariosAtivos,
} from "../services/atividade-services";

const ACTION_OPTIONS = [
  { value: "todos", label: "Todas as ações" },
  { value: "paciente_criado", label: "Paciente cadastrado" },
  { value: "paciente_editado", label: "Paciente editado" },
  { value: "paciente_excluido", label: "Paciente excluído" },
  { value: "laudo_criado", label: "Laudo emitido" },
  { value: "laudo_editado", label: "Laudo editado" },
  { value: "usuario_criado", label: "Usuário criado" },
];

const actionConfig: Record<
  string,
  { icon: React.ElementType; label: string; color: string; bg: string; border: string; text: string }
> = {
  paciente_criado: {
    icon: UserPlus,
    label: "Paciente cadastrado",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    text: "text-cyan-700",
  },
  paciente_editado: {
    icon: Pencil,
    label: "Paciente editado",
    color: "text-slate-500",
    bg: "bg-slate-100",
    border: "border-slate-200",
    text: "text-slate-600",
  },
  paciente_excluido: {
    icon: Trash2,
    label: "Paciente excluído",
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
  },
  laudo_criado: {
    icon: FilePlus,
    label: "Laudo emitido",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-700",
  },
  laudo_editado: {
    icon: Pencil,
    label: "Laudo editado",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-700",
  },
  usuario_criado: {
    icon: FileText,
    label: "Usuário criado",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
  },
};

const fallback = {
  icon: Activity,
  label: "Ação",
  color: "text-slate-500",
  bg: "bg-slate-100",
  border: "border-slate-200",
  text: "text-slate-600",
};

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

  const { data, isLoading } = useQuery({
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
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
          <Activity className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Atividade</h1>
          <p className="text-slate-400 text-sm">Histórico de ações do sistema</p>
        </div>
        {data && (
          <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            {data.count} {data.count === 1 ? "registro" : "registros"}
          </span>
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={filtros.action} onValueChange={(v) => setFiltro("action", v)}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Todas as ações" />
          </SelectTrigger>
          <SelectContent position="popper">
            {ACTION_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filtros.user_id} onValueChange={(v) => setFiltro("user_id", v)}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Todos os usuários" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="todos">Todos os usuários</SelectItem>
            {usuarios?.map((u) => (
              <SelectItem key={u.id} value={u.id}>
                {u.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Lista */}
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
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
            <Activity className="w-8 h-8 text-slate-200" />
            <p className="text-sm">Nenhuma atividade encontrada</p>
          </div>
        ) : (
          Object.entries(grupos).map(([dia, items]) => (
            <div key={dia}>
              <div className="px-6 py-2 bg-slate-50 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider capitalize">
                  {dia}
                </p>
              </div>
              {items.map((log) => {
                const cfg = actionConfig[log.action] ?? fallback;
                const Icon = cfg.icon;
                const nome = log.profiles?.full_name ?? "Usuário";

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

      {/* Paginação */}
      {totalPages > 1 && (
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
