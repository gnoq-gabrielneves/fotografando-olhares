"use client";

import { Button } from "@/shared/components/ui/button";
import {
  formatIsoDateToBrazilian,
  parseBrazilianDateToIso,
} from "@/shared/lib/format/date";
import { queryKeys } from "@/shared/lib/query/keys";
import { ResultadoRD } from "@/shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IMaskInput } from "react-imask";
import { toast } from "sonner";
import {
  atualizarLaudo,
  type LaudoDetalhe,
} from "@/features/laudos/services/laudo.services";
import { criarLaudo } from "../../services/pacientes.services";

type FormData = {
  resultado_rd: ResultadoRD | "";
  data_laudo: string;
  dilatacao: string;
  descricao: string;
};

type Props = {
  pacienteId: string;
  laudo?: LaudoDetalhe;
};

const resultados: { value: ResultadoRD; activeClass: string }[] = [
  {
    value: "Exame de retinografia normal",
    activeClass: "bg-emerald-50 border-emerald-500 text-emerald-700",
  },
  {
    value: "Retinopatia diabética não proliferativa",
    activeClass: "bg-amber-50 border-amber-500 text-amber-800",
  },
  {
    value: "Retinopatia diabética proliferativa",
    activeClass: "bg-rose-50 border-rose-500 text-rose-700",
  },
  {
    value: "Retinopatia hipertensiva",
    activeClass: "bg-sky-50 border-sky-500 text-sky-700",
  },
  {
    value: "Outras alterações",
    activeClass: "bg-violet-50 border-violet-500 text-violet-700",
  },
  {
    value: "Qualidade da imagem ruim",
    activeClass: "bg-slate-100 border-slate-400 text-slate-600",
  },
];

const inputClass =
  "w-full bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 rounded-md px-3 h-10 text-sm outline-none";
const labelClass = "text-slate-600 text-xs mb-1.5 block";

export function LaudoForm({ pacienteId, laudo }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = Boolean(laudo);

  const [form, setForm] = useState<FormData>({
    resultado_rd: laudo?.resultado_rd ?? "",
    data_laudo: laudo?.data_laudo ?? "",
    dilatacao: laudo?.dilatacao ?? "",
    descricao: laudo?.descricao ?? "",
  });

  const [erros, setErros] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: {
      paciente_id: string;
      resultado_rd: ResultadoRD;
      data_laudo?: string;
      dilatacao?: string;
      descricao?: string;
    }) =>
      isEditing && laudo
        ? atualizarLaudo(laudo.id, {
            resultado_rd: payload.resultado_rd,
            data_laudo: payload.data_laudo,
            dilatacao: payload.dilatacao,
            descricao: payload.descricao,
          })
        : criarLaudo(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
        queryKey: queryKeys.pacientes.byId(pacienteId),
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.pacientes.all }),
        queryClient.invalidateQueries({
        queryKey: queryKeys.laudos.byPaciente(pacienteId),
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.laudos.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.home.metricas }),
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
      toast.success(
        isEditing
          ? "Laudo atualizado com sucesso!"
          : "Laudo registrado com sucesso!",
      );
      router.push(`/pacientes/${pacienteId}`);
    },
    onError: (error) => {
      toast.error(isEditing ? "Erro ao atualizar laudo" : "Erro ao registrar laudo", {
        description: error.message,
      });
    },
  });

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErros((prev) => ({ ...prev, [key]: undefined }));
  }

  function validar() {
    const novosErros: Partial<Record<keyof FormData, string>> = {};
    if (!form.resultado_rd) novosErros.resultado_rd = "Selecione o resultado";
    if (!form.data_laudo) novosErros.data_laudo = "Informe a data do laudo";
    return novosErros;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const novosErros = validar();
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }
    mutate({
      paciente_id: pacienteId,
      resultado_rd: form.resultado_rd as ResultadoRD,
      data_laudo: form.data_laudo || undefined,
      dilatacao: form.dilatacao || undefined,
      descricao: form.descricao || undefined,
    });
  }

  const isDirty =
    isEditing
      ? form.resultado_rd !== (laudo?.resultado_rd ?? "") ||
        form.data_laudo !== (laudo?.data_laudo ?? "") ||
        form.dilatacao !== (laudo?.dilatacao ?? "") ||
        form.descricao !== (laudo?.descricao ?? "")
      : !!form.resultado_rd ||
        !!form.data_laudo ||
        !!form.dilatacao ||
        !!form.descricao;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-1.5">
        <label className={labelClass}>Resultado do laudo *</label>
        <div className="grid grid-cols-2 gap-3">
          {resultados.map((r) => {
            const isActive = form.resultado_rd === r.value;
            return (
              <button
                key={r.value}
                type="button"
                onClick={() => set("resultado_rd", r.value)}
                disabled={isPending}
                className={`h-11 rounded-lg text-sm font-medium border transition-all px-2 ${
                  isActive
                    ? r.activeClass
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                {r.value}
              </button>
            );
          })}
        </div>
        {erros.resultado_rd && (
          <p className="text-red-500 text-xs mt-1">{erros.resultado_rd}</p>
        )}
      </div>

      {/* Data e Dilatação */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className={labelClass}>Data do laudo *</label>
          <IMaskInput
            mask="00/00/0000"
            placeholder="DD/MM/AAAA"
            value={formatIsoDateToBrazilian(form.data_laudo) ?? ""}
            className={inputClass}
            onAccept={(value: string) => {
              set("data_laudo", parseBrazilianDateToIso(value));
            }}
          />
          {erros.data_laudo && (
            <p className="text-red-500 text-xs mt-1">{erros.data_laudo}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className={labelClass}>Dilatação</label>
          <IMaskInput
            mask="0x"
            placeholder="Ex: 3x"
            className={inputClass}
            onAccept={(value: string) => set("dilatacao", value)}
          />
        </div>
      </div>

      {/* Descrição */}
      <div className="space-y-1.5">
        <label className={labelClass}>Descrição / outras alterações</label>
        <textarea
          value={form.descricao}
          onChange={(e) => set("descricao", e.target.value)}
          placeholder="Descreva os achados do laudo..."
          rows={5}
          className="w-full bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 rounded-md px-3 py-2.5 text-sm resize-none outline-none"
        />
      </div>

      <p className="text-xs text-slate-400">
        {isPending
          ? isEditing
            ? "Atualizando laudo..."
            : "Salvando laudo..."
          : isDirty
            ? "Laudo com alterações prontas para salvar."
            : "Selecione o resultado e informe a data do laudo."}
      </p>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/pacientes/${pacienteId}`)}
          className="flex-1 h-11 bg-transparent border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isPending || !isDirty}
          className="flex-1 h-11 bg-cyan-600 hover:bg-cyan-500 text-white font-medium"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isEditing ? "Atualizando..." : "Salvando..."}
            </>
          ) : (
            isEditing ? "Atualizar laudo" : "Salvar laudo"
          )}
        </Button>
      </div>
    </form>
  );
}
