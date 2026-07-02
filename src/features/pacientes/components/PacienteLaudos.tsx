"use client";

import { Button } from "@/shared/components/ui/button";
import { queryKeys } from "@/shared/lib/query/keys";
import { formatDisplayTextOrDash } from "@/shared/lib/format/text";
import { resultadoBadge } from "@/shared/lib/utils/resultado-badge";
import { LaudoComLaudador, ResultadoRD } from "@/shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { excluirLaudo } from "../services/laudos.actions";

type Props = {
  laudos: LaudoComLaudador[];
  pacienteId: string;
};

export function PacienteLaudos({ laudos, pacienteId }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [confirmandoId, setConfirmandoId] = useState<string | null>(null);

  const { mutate: deletar, isPending } = useMutation({
    mutationFn: excluirLaudo,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.pacientes.byId(pacienteId),
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.pacientes.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.laudos.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.home.metricas }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.home.distribuicaoRD,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.home.ultimosPacientes,
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.relatorios.geral }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.relatorios.distribuicaoResultados,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.relatorios.laudosPorMes,
        }),
      ]);
      router.refresh();
      setConfirmandoId(null);
      toast.success("Laudo excluído.");
    },
    onError: (error: Error) => {
      toast.error("Erro ao excluir laudo", { description: error.message });
    },
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs font-medium text-cyan-600 uppercase tracking-wider">
          Histórico de laudos
        </h2>
        <Button
          onClick={() => router.push(`/pacientes/${pacienteId}/laudo`)}
          size="sm"
          className="gap-2 bg-cyan-600 hover:bg-cyan-500 text-white h-8 text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Novo laudo
        </Button>
      </div>

      {laudos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
            <FileText className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-slate-400 text-sm">Nenhum laudo registrado</p>
        </div>
      ) : (
        <div className="space-y-4">
          {laudos.map((laudo) => (
            <div
              key={laudo.id}
              className="border border-slate-200 rounded-lg p-4 space-y-3 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  {laudo.resultado_rd ? (
                    <span className={`text-xs px-2.5 py-1 rounded-md font-medium border ${resultadoBadge[laudo.resultado_rd as ResultadoRD] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}>
                      {laudo.resultado_rd}
                    </span>
                  ) : (
                    <span className="text-xs px-2.5 py-1 rounded-md font-medium bg-slate-100 text-slate-500 border border-slate-200">
                      Sem resultado
                    </span>
                  )}
                  {laudo.dilatacao && (
                    <span className="text-xs text-slate-400">Dilatação: {laudo.dilatacao}</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    {laudo.profiles?.full_name && (
                      <span>{formatDisplayTextOrDash(laudo.profiles.full_name)}</span>
                    )}
                    {laudo.data_laudo && (
                      <>
                        <span className="text-slate-300">·</span>
                        <span>{new Date(laudo.data_laudo).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</span>
                      </>
                    )}
                  </div>

                  {confirmandoId === laudo.id ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-500">Excluir?</span>
                      <button
                        type="button"
                        onClick={() => deletar(laudo.id)}
                        disabled={isPending}
                        className="text-xs text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                      >
                        Sim
                      </button>
                      <span className="text-slate-300 text-xs">·</span>
                      <button
                        type="button"
                        onClick={() => setConfirmandoId(null)}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        Não
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmandoId(laudo.id)}
                      disabled={isPending}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                      aria-label="Excluir laudo"
                      title="Excluir laudo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Excluir
                    </button>
                  )}
                </div>
              </div>

              {laudo.descricao && (
                <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                  {laudo.descricao}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
