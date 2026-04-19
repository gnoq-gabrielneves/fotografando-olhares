"use client";

import { Button } from "@/components/ui/button";
import { queryKeys } from "@/lib/query/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IMaskInput } from "react-imask";
import { toast } from "sonner";
import { criarLaudo } from "../../queries/queries-pacientes";

type ResultadoRD =
  | "Sem RD"
  | "Não proliferativa"
  | "Proliferativa"
  | "Outra patologia";

type FormData = {
  resultado_rd: ResultadoRD | "";
  data_laudo: string;
  dilatacao: string;
  descricao: string;
};

type Props = {
  pacienteId: string;
};

const resultados: { value: ResultadoRD; className: string }[] = [
  {
    value: "Sem RD",
    className:
      "border-cyan-900/50 data-[active=true]:bg-cyan-950 data-[active=true]:border-cyan-500 data-[active=true]:text-cyan-400",
  },
  {
    value: "Não proliferativa",
    className:
      "border-amber-900/50 data-[active=true]:bg-amber-950 data-[active=true]:border-amber-500 data-[active=true]:text-amber-400",
  },
  {
    value: "Proliferativa",
    className:
      "border-red-900/50 data-[active=true]:bg-red-950 data-[active=true]:border-red-500 data-[active=true]:text-red-400",
  },
  {
    value: "Outra patologia",
    className:
      "border-violet-900/50 data-[active=true]:bg-violet-950 data-[active=true]:border-violet-500 data-[active=true]:text-violet-400",
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
          {resultados.map((r) => (
            <button
              key={r.value}
              type="button"
              data-active={form.resultado_rd === r.value}
              onClick={() => set("resultado_rd", r.value)}
              className={`h-11 rounded-lg text-sm font-medium border transition-all
                bg-slate-800/50 text-slate-400 hover:border-slate-600 hover:text-slate-300
                ${r.className}
                ${form.resultado_rd === r.value ? "ring-1 ring-offset-1 ring-offset-slate-900" : ""}
              `}
            >
              {r.value}
            </button>
          ))}
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
