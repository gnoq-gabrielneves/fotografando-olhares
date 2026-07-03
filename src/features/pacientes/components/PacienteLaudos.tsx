"use client";

import { Button } from "@/shared/components/ui/button";
import { formatIsoDateToBrazilian } from "@/shared/lib/format/date";
import { formatDisplayTextOrDash } from "@/shared/lib/format/text";
import { queryKeys } from "@/shared/lib/query/keys";
import { resultadoBadge } from "@/shared/lib/utils/resultado-badge";
import type { LaudoComLaudador, ResultadoRD } from "@/shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  FileText,
  Pencil,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { excluirLaudo } from "../services/laudos.actions";

type Props = {
  laudos: LaudoComLaudador[];
  pacienteId: string;
};

function formatarData(data: string | null) {
  return formatIsoDateToBrazilian(data) ?? "Sem data";
}

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
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg border border-cyan-100 bg-cyan-50 text-cyan-700">
              <FileText className="size-4" />
            </span>
            <h2 className="text-sm font-semibold text-slate-800">
              Histórico de laudos
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {laudos.length === 0
              ? "Nenhum laudo registrado para este paciente."
              : `${laudos.length} laudo${laudos.length === 1 ? "" : "s"} registrado${laudos.length === 1 ? "" : "s"}.`}
          </p>
        </div>
        <Button
          onClick={() => router.push(`/pacientes/${pacienteId}/laudo`)}
          size="sm"
          className="gap-2 bg-cyan-600 hover:bg-cyan-500 text-white"
        >
          <Plus className="size-4" />
          Novo laudo
        </Button>
      </div>

      {laudos.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-200 bg-slate-50 py-12">
          <div className="flex size-12 items-center justify-center rounded-lg border border-slate-200 bg-white">
            <FileText className="size-5 text-slate-400" />
          </div>
          <p className="text-sm text-slate-500">
            O histórico oftalmológico aparecerá aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {laudos.map((laudo) => (
            <div
              key={laudo.id}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-slate-300"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 space-y-3">
                  {laudo.resultado_rd ? (
                    <span
                      className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${resultadoBadge[laudo.resultado_rd as ResultadoRD] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}
                    >
                      {laudo.resultado_rd}
                    </span>
                  ) : (
                    <span className="inline-flex rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                      Sem resultado
                    </span>
                  )}

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="size-3.5 text-slate-400" />
                      {formatarData(laudo.data_laudo)}
                    </span>
                    {laudo.profiles?.full_name ? (
                      <span className="inline-flex items-center gap-1">
                        <UserRound className="size-3.5 text-slate-400" />
                        {formatDisplayTextOrDash(laudo.profiles.full_name)}
                      </span>
                    ) : null}
                    {laudo.dilatacao ? (
                      <span>Dilatação: {laudo.dilatacao}</span>
                    ) : null}
                  </div>

                  {laudo.descricao ? (
                    <p className="max-w-3xl text-sm leading-7 text-slate-600">
                      {laudo.descricao}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-400">
                      Sem descrição complementar.
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {confirmandoId === laudo.id ? (
                    <div className="flex items-center gap-2 rounded-md border border-red-100 bg-red-50 px-2 py-1.5">
                      <span className="text-xs text-red-700">Excluir?</span>
                      <button
                        type="button"
                        onClick={() => deletar(laudo.id)}
                        disabled={isPending}
                        className="text-xs font-medium text-red-700 hover:text-red-800 disabled:opacity-50"
                      >
                        Sim
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmandoId(null)}
                        className="text-xs text-slate-500 hover:text-slate-700"
                      >
                        Não
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => router.push(`/laudos/${laudo.id}/editar`)}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-500 transition-colors hover:bg-cyan-50 hover:text-cyan-700"
                        aria-label="Editar laudo"
                        title="Editar laudo"
                      >
                        <Pencil className="size-3.5" />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmandoId(laudo.id)}
                        disabled={isPending}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        aria-label="Excluir laudo"
                        title="Excluir laudo"
                      >
                        <Trash2 className="size-3.5" />
                        Excluir
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
