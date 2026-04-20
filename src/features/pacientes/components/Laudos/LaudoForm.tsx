"use client";

import { Button } from "@/components/ui/button";
import { queryKeys } from "@/lib/query/keys";
import { ResultadoRD } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IMaskInput } from "react-imask";
import { toast } from "sonner";
import { criarLaudo } from "../../queries/queries-pacientes";

type FormData = {
  resultado_rd: ResultadoRD | "";
  data_laudo: string;
  dilatacao: string;
  descricao: string;
};

type Props = {
  pacienteId: string;
};

const resultados: { value: ResultadoRD; activeClass: string }[] = [
  {
    value: "Exame de retinografia normal",
    activeClass: "bg-cyan-950 border-cyan-500 text-cyan-400",
  },
  {
    value: "Retinopatia diabética não proliferativa",
    activeClass: "bg-amber-950 border-amber-500 text-amber-400",
  },
  {
    value: "Retinopatia diabética proliferativa",
    activeClass: "bg-red-950 border-red-500 text-red-400",
  },
  {
    value: "Retinopatia hipertensiva",
    activeClass: "bg-orange-950 border-orange-500 text-orange-400",
  },
  {
    value: "Outras alterações",
    activeClass: "bg-violet-950 border-violet-500 text-violet-400",
  },
  {
    value: "Qualidade da imagem ruim",
    activeClass: "bg-slate-700 border-slate-500 text-slate-300",
  },
];

const inputClass =
  "w-full bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 rounded-md px-3 h-10 text-sm outline-none";
const labelClass = "text-slate-400 text-xs mb-1.5 block";

export function LaudoForm({ pacienteId }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<FormData>({
    resultado_rd: "",
    data_laudo: "",
    dilatacao: "",
    descricao: "",
  });

  const [erros, setErros] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  const { mutate, isPending } = useMutation({
    mutationFn: criarLaudo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.pacientes.byId(pacienteId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.laudos.byPaciente(pacienteId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.home.metricas });
      queryClient.invalidateQueries({
        queryKey: queryKeys.home.ultimosPacientes,
      });
      toast.success("Laudo registrado com sucesso!");
      router.push(`/pacientes/${pacienteId}`);
    },
    onError: (error) => {
      toast.error("Erro ao registrar laudo", { description: error.message });
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

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Resultado RD */}
      <div className="space-y-1.5">
        <label className={labelClass}>Resultado da RD *</label>
        <div className="grid grid-cols-2 gap-3">
          {resultados.map((r) => {
            const isActive = form.resultado_rd === r.value;
            return (
              <button
                key={r.value}
                type="button"
                onClick={() => set("resultado_rd", r.value)}
                className={`h-11 rounded-lg text-sm font-medium border transition-all px-2
                  ${
                    isActive
                      ? r.activeClass
                      : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                  }`}
              >
                {r.value}
              </button>
            );
          })}
        </div>
        {erros.resultado_rd && (
          <p className="text-red-400 text-xs mt-1">{erros.resultado_rd}</p>
        )}
      </div>

      {/* Data e Dilatação */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className={labelClass}>Data do laudo *</label>
          <IMaskInput
            mask="00/00/0000"
            placeholder="DD/MM/AAAA"
            className={inputClass}
            onAccept={(value: string) => {
              if (value.length === 10) {
                const [d, m, y] = value.split("/");
                set("data_laudo", `${y}-${m}-${d}`);
              } else {
                set("data_laudo", "");
              }
            }}
          />
          {erros.data_laudo && (
            <p className="text-red-400 text-xs mt-1">{erros.data_laudo}</p>
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
          className="w-full bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 rounded-md px-3 py-2.5 text-sm resize-none outline-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/pacientes/${pacienteId}`)}
          className="flex-1 h-11 bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1 h-11 bg-cyan-600 hover:bg-cyan-500 text-white font-medium"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar laudo"
          )}
        </Button>
      </div>
    </form>
  );
}
